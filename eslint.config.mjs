import reactRefresh from "eslint-plugin-react-refresh";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import prettierPlugin from "eslint-plugin-prettier";
import js from "@eslint/js";

export default [
    // Explicitly ignore files outside src
    {
        ignores: [
            "node_modules/**",
            "dist/**",
            "build/**",
            "public/**",
            "*.config.js",
            "*.config.ts",
            "*.config.mjs",
            "*.config.cjs",
        ]
    },
    js.configs.recommended,
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true
                }
            },
            // Manually specify common browser globals
            globals: {
                window: true,
                document: true,
                navigator: true,
                fetch: true,
                console: true,
                // Add other globals as needed
            }
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
            "react": reactPlugin,
            "react-hooks": reactHooksPlugin,
            "prettier": prettierPlugin,
            "react-refresh": reactRefresh
        },
        rules: {
            "react-refresh/only-export-components": "warn",
            "react/react-in-jsx-scope": "off",
            "@typescript-eslint/no-explicit-any": "warn"
        }
    }
];