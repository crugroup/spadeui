import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// `src/config/constants.ts` reads runtime config from `window.env` (injected by
// `public/env.js` in production). Tests run without it, so API_URL falls back
// to the default.
(window as any).env = {};

// Node 25+ ships its own `localStorage`/`sessionStorage` globals, which are
// undefined unless Node runs with `--localstorage-file`, and they shadow
// jsdom's. Point both at the jsdom implementation that vitest exposes as `jsdom`.
const { jsdom } = globalThis as unknown as { jsdom: { window: Window } };
for (const key of ["localStorage", "sessionStorage"] as const) {
  Object.defineProperty(globalThis, key, { configurable: true, value: jsdom.window[key] });
}

// jsdom doesn't implement matchMedia, which antd uses for responsive behaviour.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});
