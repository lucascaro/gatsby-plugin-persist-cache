module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  ignorePatterns: ["/*.js", "__tests__/**"],
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["@typescript-eslint"],
  env: {
    node: true,
    es2021: true,
  },
  parserOptions: {
    sourceType: "module",
  },
};
