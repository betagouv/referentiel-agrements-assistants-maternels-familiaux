import js from '@eslint/js';
import json from '@eslint/json';
import commentsPlugin from '@eslint-community/eslint-plugin-eslint-comments/configs';
import { defineConfig, globalIgnores } from 'eslint/config';
import chaiExpectPlugin from 'eslint-plugin-chai-expect';
import mochaPlugin from 'eslint-plugin-mocha';
import nodeSecurityPlugin from 'eslint-plugin-node-security';
import simpleImportPlugin from 'eslint-plugin-simple-import-sort';
import ymlPlugin from 'eslint-plugin-yml';

export default defineConfig([
  { linterOptions: { reportUnusedDisableDirectives: 'error' } },
  commentsPlugin.recommended,
  {
    files: ['**/*.{js,mjs}'],
    plugins: { js, 'simple-import-sort': simpleImportPlugin },
    extends: ['js/recommended'],
    languageOptions: { ecmaVersion: 2026, sourceType: 'module' },
    rules: {
      'no-console': 'error',
      'no-empty-function': 'error',
      'no-var': ['error'],
      'prefer-const': ['error'],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  { files: ['**/*.json'], plugins: { json }, language: 'json/json', extends: ['json/recommended'] },
  ...ymlPlugin.configs.recommended,
  {
    ...mochaPlugin.configs.recommended,
    files: ['tests/**/*.js'],
    rules: {
      ...mochaPlugin.configs.recommended.rules,
      'mocha/no-exclusive-tests': 'error',
      'mocha/no-pending-tests': 'error',
    },
  },
  chaiExpectPlugin.configs['recommended-flat'],
  nodeSecurityPlugin.configs.strict,
  globalIgnores(['package-lock.json']),
]);
