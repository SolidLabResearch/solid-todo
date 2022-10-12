module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname, // this is the reason this is a .js file
    project: ["./tsconfig.eslint.json"],
  },
  extends: [
    "@rubensworks",
    //"plugin:unicorn/recommended"
  ],
  plugins: ["react-hooks"],
  rules: {
    "no-implicit-coercion": "off",
    "no-control-regex": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn", // <--- THIS IS THE NEW RULE
  },
};
