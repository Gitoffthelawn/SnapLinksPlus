'use strict';

const { FlatCompat } = require('@eslint/eslintrc');
const path = require('path');

const compat = new FlatCompat({ baseDirectory: __dirname });

const customGlobals = require('./eslint/globals').globals;
const customRules   = require('./eslint/rules').rules;

module.exports = [
	// Browser + webextension environments (via legacy compat)
	...compat.env({
		browser:       true,
		webextensions: true,
		es6:           true,
	}),

	// jQuery eslint ruleset (legacy compat)
	...compat.extends('jquery'),

	// Override removed ESLint 9+ rules from jquery config and apply custom config
	{
		languageOptions: {
			ecmaVersion: 2020,
			sourceType:  'script',
			globals:     customGlobals,
		},
		rules: {
			// Rules removed in ESLint 9 (were in eslint-config-jquery)
			'no-negated-in-lhs': 'off', // replaced by no-unsafe-negation
			'no-spaced-func':    'off', // replaced by func-call-spacing

			// From original .eslintrc.js top-level rules
			'template-curly-spacing': 'off',

			// Custom project rules
			...customRules,
		},
	},
];
