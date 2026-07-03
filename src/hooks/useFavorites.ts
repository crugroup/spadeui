import { useCallback, useState } from "react";

const STORAGE_KEY = "spade_favorites";

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

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorites>(loadFavorites);

  const isFavorite = useCallback(
    (resource: string, id: number) => {
      return favorites[resource]?.includes(id) ?? false;
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (resource: string, id: number, label: string) => {
      const current = loadFavorites();
      const ids = current[resource] || [];
      if (ids.includes(id)) {
        current[resource] = ids.filter((i) => i !== id);
      } else {
        current[resource] = [...ids, id];
      }
      // Also store label for display
      const labels = JSON.parse(localStorage.getItem("spade_favorite_labels") || "{}");
      labels[`${resource}:${id}`] = label;
      localStorage.setItem("spade_favorite_labels", JSON.stringify(labels));
      saveFavorites(current);
      setFavorites({ ...current });
      // Notify other components (e.g. sidebar badge)
      window.dispatchEvent(new Event("spade-favorites-changed"));
    },
    []
  );

  const getFavoriteIds = useCallback(
    (resource: string) => favorites[resource] || [],
    [favorites]
  );

  const getAllFavorites = useCallback(() => {
    let labels: Record<string, string> = {};
    try {
      labels = JSON.parse(localStorage.getItem("spade_favorite_labels") || "{}");
    } catch {
      labels = {};
    }
    return Object.entries(favorites).flatMap(([resource, ids]) =>
      ids.map((id) => ({
        resource,
        id,
        label: labels[`${resource}:${id}`] || `${resource}/${id}`,
      }))
    );
  }, [favorites]);

  return { isFavorite, toggleFavorite, getFavoriteIds, getAllFavorites };
}
