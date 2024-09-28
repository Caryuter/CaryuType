import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import spellChecker from "eslint-plugin-spellcheck";

export default [
	{
		languageOptions: { globals: globals.browser },
	},
	pluginJs.configs.recommended,

	{
		plugins: {
			spellChecker,
		},
		rules: {
			"no-unused-vars": "warn",
			"spellChecker/spell-checker": [
				1,
				{
					comments: false,
					strings: false,
					identifiers: true,
					templates: false,
					lang: "en_US",
					minLength: 3,
					skipWords: [
						"rect",
						"pos",
						"resize",
						"lang",
						"globals",
						"letter",
						"tooltip",
					],
				},
			],
		},
	},
	{
		ignores: ["*.cjs", ".dist/*"],
	},
	eslintConfigPrettier,
];
