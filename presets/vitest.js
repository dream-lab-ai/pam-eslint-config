const vitestPlugin = require('eslint-plugin-vitest');

module.exports = [
  {
    files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    plugins: {
      vitest: vitestPlugin,
    },
    languageOptions: {
      globals: {
        suite: 'readonly',
        test: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        assert: 'readonly',
        vitest: 'readonly',
        vi: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
    rules: {
      ...vitestPlugin.configs.recommended.rules,
      'vitest/expect-expect': 'off',
      'vitest/prefer-expect-assertions': 'off',
      'vitest/prefer-lowercase-title': 'off',
      'vitest/max-expects': 'off',
      'vitest/no-hooks': 'off',
      'vitest/prefer-spy-on': 'off',
      'vitest/consistent-test-it': 'off',
      'vitest/no-conditional-expect': 'error',
      'vitest/no-conditional-in-test': 'error',
      'vitest/no-disabled-tests': 'warn',
      'vitest/no-focused-tests': 'error',
      'vitest/no-identical-title': 'error',
      'vitest/prefer-to-be': 'warn',
      'vitest/prefer-to-contain': 'warn',
      'vitest/prefer-to-have-length': 'warn',
      'vitest/valid-expect': 'error',
      'vitest/valid-title': 'warn',
    },
  },
];
