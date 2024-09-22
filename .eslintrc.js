module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'eslint:recommended', // Use ESLint's recommended rules
    'plugin:@typescript-eslint/recommended', // Use the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:node/recommended', // Use Node.js-specific linting rules
    'prettier', // Enables eslint-config-prettier to disable ESLint rules that might conflict with Prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays Prettier errors as ESLint errors
  ],
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  env: {
    es2020: true,
    node: true, // Defines Node.js global variables and Node.js scoping
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    // Place to specify ESLint rules - can be used to overwrite rules specified from the extended configs
    'prettier/prettier': 'error', // Prettier-related linting rules
    '@typescript-eslint/no-unused-vars': 'warn', // Warns about unused variables
    'no-console': 'off', // Allows the use of console.log()
    'node/no-unsupported-features/es-syntax': [
      'error',
      { ignores: ['modules'] }, // Allows for ES modules syntax
    ],
  },
};
