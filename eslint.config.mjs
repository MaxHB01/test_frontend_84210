import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier";

import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

import parser from "@typescript-eslint/parser";
import pluginTs from "@typescript-eslint/eslint-plugin";

import { defineConfig } from "eslint/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default defineConfig([
  // Next.js rules (via compat for now)
  ...compat.extends("next/core-web-vitals"),

  // Ignore files/folders
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "next-env.d.ts",
      "eslint.config.mjs",
    ],
  },

  // JS base rules
  js.configs.recommended,

  // All JS/TS files
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: __dirname,
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      prettier: prettierPlugin,
      "@typescript-eslint": pluginTs,
    },
    rules: {
      // General stylistic rules
      "indent": ["warn", "tab"],
      semi: ["error", "always"],
      quotes: [
        "warn",
        "double",
        { avoidEscape: true, allowTemplateLiterals: true },
      ],
      camelcase: "warn",
      "object-shorthand": "warn",
      "brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "space-before-blocks": ["error", "always"],
      "block-spacing": ["error", "always"],
      "no-duplicate-imports": "error",
      eqeqeq: ["error", "always"],
      "no-console": "error",
      "no-unreachable": "error",
      "no-fallthrough": "error",
      "max-lines": [
        "warn",
        { max: 300, skipBlankLines: true, skipComments: true },
      ],
      "max-lines-per-function": [
        "warn",
        { max: 50, skipBlankLines: true, skipComments: true },
      ],
      "max-params": ["warn", 7],
      complexity: ["warn", { max: 12 }],

      // Prettier integration
      "prettier/prettier": "warn",

      // TS rules (shared here for simplicity)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "warn",
      "@typescript-eslint/switch-exhaustiveness-check": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "@typescript-eslint/prefer-readonly": "warn",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-module-boundary-types": "warn",

      // Naming conventions
      "@typescript-eslint/naming-convention": [
        "warn",
        { selector: "typeLike", format: ["PascalCase"] },
        { selector: "variableLike", format: ["camelCase"] },
        {
          selector: "variable",
          modifiers: ["const"],
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
        },
        { selector: "enumMember", format: ["UPPER_CASE", "PascalCase"] },
        { selector: "function", format: ["camelCase"] },
      ],
    },
  },

  // React-specific
  {
    files: ["src/**/*.{tsx,jsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/prop-types": "off",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",

      // Exported components/function naming (overrides base)
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "function",
          modifiers: ["exported"],
          format: ["PascalCase", "camelCase"],
        },
      ],
    },
  },
]);
