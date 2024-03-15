import { CanParams } from "@refinedev/core";
import axios, { AxiosResponse } from "axios";
import { singular } from "pluralize";
import { ACCESS_TOKEN_KEY, API_URL } from "./auth-provider";
import { MENU_ADMIN_TAB, MENU_USER_TAB } from "./routes/resources";

const ACTIONS_MAPPING = {
  create: "add",
  show: "view",
  list: "view",
  edit: "change",
  delete: "delete",
};

// Permissions-related data is stored in variables rather than local storage
// so it can be refetched simply by refreshing the page
let permissions: { name: string; codename: string }[] = [];

// API query promise is stored in a variable to avoid making multiple requests
let permissionsQuery: Promise<AxiosResponse> | null;

async function fetchPermissions() {
  if (!permissionsQuery) {
    permissionsQuery = axios.get(`${API_URL}/permissions`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
      },
    });
  }

  try {
    const res = await permissionsQuery;
    permissions = res.data;
  } catch (e) {
    if (!window.location.href.endsWith("/login")) {
      localStorage.clear();
      window.location.href = "/login";
    }
  } finally {
    permissionsQuery = null;
  }
}

export default {
  can: async ({ resource, action }: CanParams) => {
    if (!resource) {
      return { can: true };
    }

    if (!permissions.length) {
      await fetchPermissions();
    }

    // Superuser has access to all resources and actions
    if (permissions.some((p) => p.codename === "*")) {
      return { can: true };
    }

    if (resource === MENU_USER_TAB) {
      const canAccessFiles = permissions.some(
        (p) => p.codename === `${ACTIONS_MAPPING[action as keyof typeof ACTIONS_MAPPING]}_${singular("files")}`
      );
      const canAccessProcesses = permissions.some(
        (p) => p.codename === `${ACTIONS_MAPPING[action as keyof typeof ACTIONS_MAPPING]}_${singular("processes")}`
      );

      return { can: canAccessFiles || canAccessProcesses };
    }

    if (resource === MENU_ADMIN_TAB) {
      const canAccessFileFormats = permissions.some(
        (p) => p.codename === `${ACTIONS_MAPPING[action as keyof typeof ACTIONS_MAPPING]}_${singular("fileformats")}`
      );
      const canAccessFileProcessors = permissions.some(
        (p) => p.codename === `${ACTIONS_MAPPING[action as keyof typeof ACTIONS_MAPPING]}_${singular("fileprocessors")}`
      );
      const canAccessExecutors = permissions.some(
        (p) => p.codename === `${ACTIONS_MAPPING[action as keyof typeof ACTIONS_MAPPING]}_${singular("executors")}`
      );

      return { can: canAccessFileFormats || canAccessFileProcessors || canAccessExecutors };
    }

    // Action names used by Refine are different from the ones used by Django
    const actionMapped = ACTIONS_MAPPING[action as keyof typeof ACTIONS_MAPPING];

    return {
      can: permissions.some((p) => p.codename === `${actionMapped}_${singular(resource)}`),
    };
  },
};
