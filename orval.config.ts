// orval.config.ts
import { defineConfig } from 'orval';

export default defineConfig({
	api: {
		input: process.env.API_SPEC_URL || 'http://localhost:8080/v3/api-docs',
		output: {
			mode: 'tags-split',
			target: './api/generated.ts',
			client: 'react-query',
			schemas: './api/model',
			override: {
				mutator: {
					path: './api/custom-fetch.ts',
					name: 'customFetch'
				}
			}
		}
	}
});
