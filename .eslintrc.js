// /* eslint-env node */
// require('@rushstack/eslint-patch/modern-module-resolution')

// module.exports = {
//   root: true,
//   'extends': [
//     'plugin:vue/vue3-essential',
//     'eslint:recommended',
//     '@vue/eslint-config-typescript',
//     '@vue/eslint-config-prettier/skip-formatting'
//   ],
//   parserOptions: {
//     ecmaVersion: 'latest'
//   }
// }

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: ['@antfu', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'none'
      }
    ],
    'antfu/if-newline': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    'eslint-comments/no-unlimited-disable': 'off',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    'no-console': 'off',
    'vue/component-tags-order': 'off',
    // 取消导出可变绑定时使用 const 而不是 let
    'import/no-mutable-exports': 'off',
    // 空格缩进
    indent: ['error', 2, { SwitchCase: 1 }]
    // 'prettier/prettier': [2, { tabWidth: 4, endOfLine: 'auto' }]
  }
};
