import * as js from "@eslint/js";
import * as globals from "globals";
import * as tseslint from "typescript-eslint";
import * as pluginReact from "eslint-plugin-react";
import * as jsxA11y from "eslint-plugin-jsx-a11y";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ["cypress/**/*.cy.ts"],
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  jsxA11y.configs.recommended,
]);
