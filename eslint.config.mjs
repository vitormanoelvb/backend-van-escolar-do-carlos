import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  { ignores: ['dist', 'node_modules'] },

  {
    files: ['eslint.config.mjs'],
    languageOptions: { parserOptions: { ecmaVersion: 'latest', sourceType: 'module' } },
  },

  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked, // precisa de type-info

  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { prettier: prettierPlugin },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: { ...globals.node, ...globals.jest },
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    },
  },
];
