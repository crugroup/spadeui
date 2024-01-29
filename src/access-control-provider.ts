import { USER_PERMISSIONS_KEY } from "./auth-provider";
import { CanParams } from "@refinedev/core";
import { singular } from "pluralize";

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

    // Permissions are stored as a stringified JSON response from /api/permissions in local storage
    const permissions: { name: string; codename: string }[] = JSON.parse(
      localStorage.getItem(USER_PERMISSIONS_KEY) ?? "[]"
    );

    // Superuser has access to all resources and actions
    if (permissions.some((p) => p.codename === "*")) {
      return { can: true };
    }

    // Action names used by Refine are different from the ones used by Django
    const actionMapped = ACTIONS_MAPPING[action as keyof typeof ACTIONS_MAPPING];

    return {
      can: permissions.some((p) => p.codename === `${actionMapped}_${singular(resource)}`),
    };
  },
};
