import { describe, expect, it } from "vitest";
import { spadeTitleHandler } from "./title-handler";

describe("spadeTitleHandler", () => {
  it("returns the app name when there is no resource or action", () => {
    expect(spadeTitleHandler({ resource: undefined, action: undefined, params: {} })).toBe("Spade");
  });

  it("includes the capitalised resource and action", () => {
    expect(spadeTitleHandler({ resource: { name: "files" }, action: "list", params: {} })).toBe("Files / List / Spade");
  });

  it("includes the record id when present", () => {
    expect(spadeTitleHandler({ resource: { name: "processes" }, action: "edit", params: { id: "7" } })).toBe(
      "Processes / Edit / 7 | Spade"
    );
  });
});
