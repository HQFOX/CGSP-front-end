/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';

import { defineConfig, devices } from '@playwright/test';

dotenv.config({ path: path.resolve(__dirname, '.env.development') });

// The e2e suite runs against a local backend container using the dev profile
const BACKEND_URL = 'http://localhost:8080';
const BACKEND_IMAGE = process.env.BACKEND_IMAGE ?? 'hqfox/cgsp-backend:latest';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: './tests',
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: 'html',
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('')`. */
		baseURL: 'http://localhost:3000',

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry'
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		},

		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] }
		},

		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] }
		}

		/* Test against mobile viewports. */
		// {
		//   name: 'Mobile Chrome',
		//   use: { ...devices['Pixel 5'] },
		// },
		// {
		//   name: 'Mobile Safari',
		//   use: { ...devices['iPhone 12'] },
		// },

		/* Test against branded browsers. */
		// {
		//   name: 'Microsoft Edge',
		//   use: { ...devices['Desktop Edge'], channel: 'msedge' },
		// },
		// {
		//   name: 'Google Chrome',
		//   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
		// },
	],

	/* Start the backend container and the local dev server before starting the tests */
	webServer: [
		{
			// The image's entrypoint forces the prod profile, a program argument overrides it
			command: `docker run --rm --pull always -p 8080:8080 ${BACKEND_IMAGE} --spring.profiles.active=dev`,
			url: `${BACKEND_URL}/project/filter-values`,
			reuseExistingServer: !process.env.CI,
			timeout: 180 * 1000, // image pull + spring boot startup
			// SIGTERM lets docker stop and remove the container, the default SIGKILL would leave it running
			gracefulShutdown: { signal: 'SIGTERM', timeout: 15 * 1000 }
		},
		{
			command: 'npm run build && npm run start',
			url: 'http://localhost:3000',
			reuseExistingServer: !process.env.CI,
			timeout: 120 * 1000, // build takes longer, bump the timeout
			// Takes precedence over .env.production during next build
			env: { API_URL: BACKEND_URL, NEXT_PUBLIC_API_URL: BACKEND_URL }
		}
	]
});
