module.exports = {
  root: true,
  env: {
    es2020: true,
    browser: true,
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'simple-import-sort',
    'import',
  ],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-namespace': 'off',
    'react/self-closing-comp': 'error',
    'simple-import-sort/imports': 'error', // simple-import-sort
    'simple-import-sort/exports': 'error', // simple-import-sort
    'import/first': 'error', // simple-import-sort
    'import/newline-after-import': 'error', // simple-import-sort
    'import/no-duplicates': 'error', // simple-import-sort
  },
};
