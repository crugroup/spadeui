import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
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
        },
      },
    },
  },
});
