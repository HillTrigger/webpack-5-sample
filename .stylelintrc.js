module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-prettier/recommended',
    'stylelint-config-recommended-scss',
  ],
  plugins: ['stylelint-scss', 'stylelint-prettier'],
  customSyntax: 'postcss-scss',
  rules: {
    'at-rule-no-unknown': null,
    'no-descending-specificity': null,
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['blockless-after-same-name-blockless', 'first-nested'],
        ignore: ['after-comment'],
        ignoreAtRules: ['else'],
      },
    ],
    'selector-class-pattern':
      '^[a-z0-9]+(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$',

    'scss/dollar-variable-colon-space-after': 'always',
    'scss/dollar-variable-colon-space-before': 'never',
    'scss/dollar-variable-no-missing-interpolation': true,
    'scss/dollar-variable-pattern': /^[a-z-1-9]+$/,
    'scss/double-slash-comment-whitespace-inside': 'always',
    'scss/operator-no-newline-before': true,
    'scss/operator-no-unspaced': true,
    'scss/selector-no-redundant-nesting-selector': true,
    'scss/at-rule-no-unknown': true,
    'length-zero-no-unit': [
      true,
      {
        ignore: ['custom-properties'],
      },
    ],
  },
};
