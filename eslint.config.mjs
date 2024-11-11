import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        languageOptions: {
            globals: globals.browser,
            ecmaVersion: 2021,
            sourceType: 'module',
        },
        rules: {
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
        },
    },
    pluginJs.configs.recommended,
];
