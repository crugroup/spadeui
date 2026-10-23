/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const VENDOR_CHUNKS: Record<string, string[]> = {
  "vendor-react": ["react", "react-dom", "react-router"],
  "vendor-antd": ["antd", "@ant-design/icons"],
  "vendor-refine": [
    "@refinedev/antd",
    "@refinedev/core",
    "@refinedev/react-router",
    "@refinedev/simple-rest",
    "@refinedev/kbar",
  ],
  "vendor-rjsf": ["@rjsf/antd", "@rjsf/core", "@rjsf/utils", "@rjsf/validator-ajv8"],
  "vendor-utils": ["axios", "axios-auth-refresh", "dayjs", "pretty-bytes", "query-string"],
};

function manualChunks(id: string): string | undefined {
  for (const [chunk, packages] of Object.entries(VENDOR_CHUNKS)) {
    if (packages.some((pkg) => id.includes(`/node_modules/${pkg}/`))) {
      return chunk;
    }
  }
  return undefined;
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom", "antd", "rc-field-form"],
  },
  server: {
    forwardConsole: false,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks,
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
