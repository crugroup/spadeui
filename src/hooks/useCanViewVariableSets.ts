import { useCan } from "@refinedev/core";

// Reading variable sets needs the `view_variableset` permission. Pages that show
// or pick variable sets use this to skip the request (and its 403 notification)
// for users who don't have it.
export const useCanViewVariableSets = (): boolean => {
  const { data } = useCan({ resource: "variable-sets", action: "list" });
  return !!data?.can;
};
