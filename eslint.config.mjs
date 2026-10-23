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
            "@typescript-eslint/no-explicit-any": "warn",
            // TypeScript already reports undefined identifiers, and the core rule
            // doesn't understand types or browser globals in .ts files.
            // https://typescript-eslint.io/troubleshooting/faqs/eslint#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
            "no-undef": "off",
            // The core rule flags parameter names in type signatures.
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "error"
        }
    }
];