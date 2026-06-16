import { defineConfig } from '@playwright/test'

import {
	e2eBrowserNewContextOptions,
	playwrightHeadless,
} from './playwright.env.ts'

const skipWebServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER === '1'
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:5173'

export default defineConfig({
	fullyParallel: false,
	workers: 1,
	expect: { timeout: 15_000 },
	use: {
		baseURL,
		actionTimeout: 15_000,
		navigationTimeout: 120_000,
		...e2eBrowserNewContextOptions(),
		headless: playwrightHeadless(),
	},
	...(skipWebServer ?
		{}
		:
			{
				webServer: {
					command: './node_modules/.bin/dotenvx run -f .env.local -- ./node_modules/.bin/vite dev --host 127.0.0.1',
					url: baseURL,
					timeout: 240_000,
					/** Opt-in reuse only: stale Vite/SvelteKit generated route state makes route-settlement failures non-deterministic. */
					reuseExistingServer: process.env.PLAYWRIGHT_REUSE_EXISTING_SERVER === '1',
				},
			}),
	testMatch: '**/*.e2e.{ts,js}',
})
