import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import IconStatusMapper from "./icon-status-mapper";

describe("IconStatusMapper", () => {
  it.each(["success", "finished", "failed", "error", "warning", "new", "running"])(
    "renders an icon for %s",
    (status) => {
      const { container } = render(<IconStatusMapper status={status} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    }
  );

  it("renders nothing visible for an unknown status", () => {
    const { container } = render(<IconStatusMapper status="unknown" />);
    expect(container.querySelector("svg")).toBeNull();
  });
});
