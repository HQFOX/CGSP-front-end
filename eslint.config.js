import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
	...nextCoreWebVitals,

	// Custom rules (optional)
	{
		rules: {
			'react-hooks/set-state-in-effect': 'off',
			'react-hooks/set-state-in-render': 'off',
			'react-hooks/static-components': 'off',
			'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1, maxBOF: 0 }]
		}
	}
];

export default eslintConfig;
