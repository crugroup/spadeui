import { CrudSorting } from "@refinedev/core";

export const generateSort = (sorters?: CrudSorting) => {
  if (sorters && sorters.length > 0) {
    const sort: string[] = [];

    sorters.map((item) => {
      if (item.order === "desc") {
        sort.push(`-${item.field}`);
      } else {
        sort.push(item.field);
      }
    });

    return sort.join(",");
  }

  return;
};
