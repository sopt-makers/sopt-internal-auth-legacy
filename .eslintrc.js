module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      modules: true,
    },
  },
  extends: ["eslint:recommended", "prettier"],
  plugins: ["simple-import-sort"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      plugins: ["@typescript-eslint", "import"],
      settings: {
        "import/parsers": {
          "@typescript-eslint/parser": [".ts", ".tsx"],
        },
        "import/resolver": {
          typescript: {
            alwaysTryTypes: true,
            project: "**/tsconfig.json",
          },
        },
      },
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/typescript",
      ],
      rules: {
        "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-namespace": [
          "error",
          {
            allowDeclarations: true,
            allowDefinitionFiles: true,
          },
        ],
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            args: "all",
            argsIgnorePattern: "^_",
            caughtErrors: "all",
          },
        ],
        "@typescript-eslint/no-explicit-any": "error",
      },
    },
  ],
  rules: {
    "no-unused-vars": [
      "error",
      {
        varsIgnorePattern: "^_",
        args: "all",
        argsIgnorePattern: "^_",
        caughtErrors: "all",
      },
    ],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "eol-last": ["error", "always"],
  },
};
