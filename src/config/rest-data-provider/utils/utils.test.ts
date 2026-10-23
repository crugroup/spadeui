import { describe, expect, it } from "vitest";
import { generateFilter, generateSort, mapOperator } from ".";

describe("mapOperator", () => {
  it.each([
    ["eq", ""],
    ["ne", "_ne"],
    ["gte", "_gte"],
    ["lte", "_lte"],
    ["contains", "_like"],
    ["in", ""],
  ] as const)("maps %s to %j", (operator, expected) => {
    expect(mapOperator(operator)).toBe(expected);
  });
});

describe("generateSort", () => {
  it("returns undefined when there are no sorters", () => {
    expect(generateSort()).toBeUndefined();
    expect(generateSort([])).toBeUndefined();
  });

  it("prefixes descending fields with a minus and joins with commas", () => {
    expect(
      generateSort([
        { field: "name", order: "asc" },
        { field: "created_at", order: "desc" },
      ])
    ).toBe("name,-created_at");
  });
});

describe("generateFilter", () => {
  it("returns an empty object when there are no filters", () => {
    expect(generateFilter()).toEqual({});
  });

  it("appends the mapped operator to the field name", () => {
    expect(
      generateFilter([
        { field: "status", operator: "eq", value: "new" },
        { field: "size", operator: "gte", value: 10 },
        { field: "name", operator: "contains", value: "report" },
      ])
    ).toEqual({ status: "new", size_gte: 10, name_like: "report" });
  });

  it("passes the `q` search field through unchanged", () => {
    expect(generateFilter([{ field: "q", operator: "contains", value: "foo" }])).toEqual({ q: "foo" });
  });

  it("throws for conditional `or` / `and` filters", () => {
    expect(() => generateFilter([{ operator: "or", value: [] }])).toThrow(/not supported/);
    expect(() => generateFilter([{ operator: "and", value: [] }])).toThrow(/not supported/);
  });
});
