import { useCallback, useEffect, useState } from "react";
import axiosHelper from "../helpers/axios-token-interceptor";
import { API_URL } from "../config/constants";

const STORAGE_KEY = "spade_favorites";
const LABELS_KEY = "spade_favorite_labels";

function loadLabels(): Record<string, string> {
  try {
    const parsed = JSON.parse(localStorage.getItem(LABELS_KEY) || "{}");
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, string>;
    }
  } catch { /* ignore */ }
  return {};
}

type Favorites = Record<string, number[]>;

function loadFavorites(): Favorites {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveFavorites(favs: Favorites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}

async function syncFromAPI() {
  try {
    // Snapshot localStorage before the request so we can detect concurrent
    // local changes (e.g. user toggled a favorite while sync was in-flight).
    const localBefore = localStorage.getItem(STORAGE_KEY);
    const { data } = await axiosHelper.axiosInstance.get(`${API_URL}/favorites`);
    // If localStorage changed since we started, skip hydration to avoid
    // overwriting the user's newer local state.
    if (localStorage.getItem(STORAGE_KEY) !== localBefore) return null;
    const favs: Favorites = {};
    const labels: Record<string, string> = {};
    (data ?? []).forEach((f: any) => {
      if (!favs[f.resource]) favs[f.resource] = [];
      favs[f.resource].push(f.resource_id);
      labels[`${f.resource}:${f.resource_id}`] = f.label || "";
    });
    saveFavorites(favs);
    try {
      localStorage.setItem(LABELS_KEY, JSON.stringify(labels));
    } catch { /* ignore label cache failures */ }
    return favs;
  } catch {
    return null;
  }
}

async function addToAPI(resource: string, id: number) {
  try {
    await axiosHelper.axiosInstance.post(`${API_URL}/favorites`, { resource, resource_id: id });
  } catch { /* silent */ }
}

async function removeFromAPI(resource: string, id: number) {
  try {
    await axiosHelper.axiosInstance.delete(`${API_URL}/favorites`, {
      params: { resource, resource_id: id },
    });
  } catch { /* silent */ }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorites>(loadFavorites);
  const [synced, setSynced] = useState(false);

  // Hydrate from API on mount
  useEffect(() => {
    let cancelled = false;
    syncFromAPI().then((apiFavs) => {
      if (cancelled) return;
      if (apiFavs) setFavorites(apiFavs);
      setSynced(true);
    });
    return () => { cancelled = true; };
  }, []);

  const isFavorite = useCallback(
    (resource: string, id: number) => {
      return favorites[resource]?.includes(id) ?? false;
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (resource: string, id: number, _label?: string) => {
      const current = loadFavorites();
      const ids = current[resource] || [];
      const wasFavorite = ids.includes(id);

      if (wasFavorite) {
        current[resource] = ids.filter((i) => i !== id);
        removeFromAPI(resource, id);
      } else {
        current[resource] = [...ids, id];
        addToAPI(resource, id);
      }

      // Update label cache immediately so the dashboard shows the real
      // name without waiting for the next syncFromAPI.
      const labelKey = `${resource}:${id}`;
      const labels = loadLabels();
      if (wasFavorite) {
        delete labels[labelKey];
      } else if (_label) {
        labels[labelKey] = _label;
      }
      try {
        localStorage.setItem(LABELS_KEY, JSON.stringify(labels));
      } catch { /* ignore */ }

      saveFavorites(current);
      setFavorites({ ...current });
      window.dispatchEvent(new Event("spade-favorites-changed"));
    },
    []
  );

  const getFavoriteIds = useCallback(
    (resource: string) => favorites[resource] || [],
    [favorites]
  );

  const getAllFavorites = useCallback(() => {
    const labels = loadLabels();
    return Object.entries(favorites).flatMap(([resource, ids]) =>
      ids.map((id) => ({
        resource,
        id,
        label: labels[`${resource}:${id}`] || `${resource}/${id}`,
      }))
    );
  }, [favorites]);

  return { isFavorite, toggleFavorite, getFavoriteIds, getAllFavorites, synced };
}
