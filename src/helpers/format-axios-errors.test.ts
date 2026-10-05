import { describe, expect, it } from "vitest";
import formatAxiosErrors from "./format-axios-errors";

describe("formatAxiosErrors", () => {
  it("returns a generic message when there is no data", () => {
    expect(formatAxiosErrors(undefined as any)).toBe("Something went wrong. Please try again later.");
  });

  it("returns a plain string message as-is", () => {
    expect(formatAxiosErrors({ detail: "Not found." } as any)).toBe("Not found.");
  });

  it("lists every message for every field", () => {
    expect(
      formatAxiosErrors({
        email: ["Enter a valid email address."],
        password: ["Too short.", "Too common."],
      })
    ).toBe('"email": Enter a valid email address.\n"password": Too short.\n"password": Too common.\n');
  });

  it("falls back to a default message when there are no field errors", () => {
    expect(formatAxiosErrors({})).toBe("Please provide a valid data");
  });
});
