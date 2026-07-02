// React 19 removed event.persist() but RJSF still calls it.
// Monkey-patch as no-op on native Event prototype (safe — persist was always a no-op for behavior).
if (typeof Event !== "undefined" && !("persist" in Event.prototype)) {
  Object.defineProperty(Event.prototype, "persist", { value() {}, writable: true, configurable: true });
}

import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(<App />);
