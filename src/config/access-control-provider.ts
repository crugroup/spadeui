import { CanParams } from "@refinedev/core";
import { singular } from "pluralize";
import { MENU_ADMIN_TAB, MENU_USER_TAB } from "./routes/resources";
import { USER_PERMISSIONS_KEY } from "./constants";

const ACTIONS_MAPPING = {
  create: "add",
  show: "view",
  list: "view",
  edit: "change",
  delete: "delete",
};

export default {
  can: async ({ resource, action }: CanParams) => {
    if (!resource) {
      return { can: true };
    }

    const permissions: { name: string; codename: string }[] = JSON.parse(
      localStorage.getItem(USER_PERMISSIONS_KEY) ?? "[]"
    );

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
