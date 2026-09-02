const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'react/jsx-no-leaked-render': 'error',
    },
  },
];
