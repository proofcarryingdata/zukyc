/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/next.js", "plugin:react-hooks/recommended"],
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    node: true
  },
  plugins: ["@typescript-eslint", "react-hooks"],
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error"
  }
};
