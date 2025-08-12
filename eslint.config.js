import { FlatCompat } from '@eslint/eslintrc';

// Create a compatibility adapter
const compat = new FlatCompat({
  // import.meta.dirname is available in Node.js v20.11.0+.
  // If using an older version, replace this with `__dirname` (CommonJS) or `process.cwd()`
  baseDirectory: import.meta.dirname
});

const eslintConfig = [
  // Convert the old "extends" array into Flat Config format
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'plugin:prettier/recommended' // Runs prettier as an ESLint rule
    ]
  }),

  // Custom rules (optional)
  {
    rules: {
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1, maxBOF: 0 }]
    }
  }
];

export default eslintConfig;
