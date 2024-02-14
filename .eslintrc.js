/* eslint-env node */

module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  ignorePatterns: ["dist/**/*", "tmp/**/*", "**/*.js"],
  env: {
    node: true,
  },
  rules: {},
};
