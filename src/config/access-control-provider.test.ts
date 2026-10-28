import { describe, expect, it } from "vitest";
import accessControlProvider from "./access-control-provider";
import { USER_PERMISSIONS_KEY } from "./constants";
import { MENU_ADMIN_TAB, MENU_USER_TAB } from "./routes/resources";

const setPermissions = (...codenames: string[]) =>
  localStorage.setItem(
    USER_PERMISSIONS_KEY,
    JSON.stringify(codenames.map((codename) => ({ name: codename, codename })))
  );

const can = async (resource: string | undefined, action: string) =>
  (await accessControlProvider.can({ resource, action })).can;

describe("accessControlProvider", () => {
  it("allows everything when no resource is given", async () => {
    expect(await can(undefined, "list")).toBe(true);
  });

  it("allows everything for a superuser", async () => {
    setPermissions("*");
    expect(await can("executors", "delete")).toBe(true);
  });

  it("denies everything when there are no stored permissions", async () => {
    expect(await can("files", "list")).toBe(false);
  });

  it("maps refine actions to Django codenames", async () => {
    setPermissions("view_file", "change_process");
    expect(await can("files", "list")).toBe(true);
    expect(await can("files", "show")).toBe(true);
    expect(await can("files", "edit")).toBe(false);
    expect(await can("processes", "edit")).toBe(true);
  });

  it("strips hyphens from multi-word resource names", async () => {
    setPermissions("view_variableset");
    expect(await can("variable-sets", "list")).toBe(true);
  });

  it("shows the work tab when the user can view files or processes", async () => {
    setPermissions("view_process");
    expect(await can(MENU_USER_TAB, "list")).toBe(true);
    expect(await can(MENU_ADMIN_TAB, "list")).toBe(false);
  });

  it("shows the admin tab when the user can view executors", async () => {
    setPermissions("view_executor");
    expect(await can(MENU_ADMIN_TAB, "list")).toBe(true);
  });
});
