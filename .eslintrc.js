module.exports = {
  root: true,
  parser: 'espree',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['standard', 'prettier'],
  rules: {
    // 'no-unused-vars': 'warn',
    'no-new': 'off',
  },
};
