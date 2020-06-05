module.exports = {
  env: {
    browser: false,
    es6: false,
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 1,
    'react/display-name': 1,
  },
  overrides: [
    {
      files: ['*.tsx'],
      rules: {
        'react/prop-types': 0,
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
