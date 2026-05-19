import { defineConfig } from '@playwright/test'

import {
	e2eBrowserNewContextOptions,
	playwrightHeadless,
} from './playwright.env.ts'

const skipWebServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER === '1'
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173'

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
	: {
		webServer: {
			command: 'pnpm run dev',
			url: baseURL,
			timeout: 120_000,
			/** Dedicated server (`PLAYWRIGHT_DEDICATED_SERVER=1`): avoids stale reused Vite client chunks when another dev PID left `.svelte-kit/generated` mid-HMR (stop `pnpm run dev` first if port 5173 is taken). */
			reuseExistingServer: process.env.PLAYWRIGHT_DEDICATED_SERVER !== '1',
		},
	}),
	testMatch: '**/*.e2e.{ts,js}',
})
