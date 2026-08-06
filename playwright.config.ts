import { defineConfig } from '@playwright/test'

import {
	e2eBrowserNewContextOptions,
	playwrightHeadless,
} from './playwright.env.ts'

const skipWebServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER === '1'
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:5173'
const webServerUrl = new URL(baseURL)

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
					command: `VITE_BLOCKHEAD_E2E_PROBE=1 PUBLIC_ALLIUM_API_KEY=e2e PUBLIC_YOUTUBE_API_KEY=e2e PUBLIC_LND_MACAROON_HEX=e2e ./node_modules/.bin/dotenvx run -f .env.local -- ./node_modules/.bin/vite dev --host ${webServerUrl.hostname} --port ${webServerUrl.port}`,
					url: baseURL,
					timeout: 240_000,
					/** Opt-in reuse only: stale Vite/SvelteKit generated route state makes route-settlement failures non-deterministic. */
					reuseExistingServer: process.env.PLAYWRIGHT_REUSE_EXISTING_SERVER === '1',
				},
	}),
	testMatch: '**/*.e2e.{ts,js}',
	testIgnore: [
		'**/src/schema_/**',
		'**/src/routes_/**',
		'**/src/sources_/**',
		'**/src/resolvers_/**',
		'**/.worktrees/**',
		// Real-wallet shards stay on playwright.wallet-extensions.config.ts (opt-in WALLET_EXTENSIONS_E2E=1).
		// Keep wallet-page-selectors.e2e.ts discoverable here — synthetic DOM only, no extensions.
		'**/tests/e2e/wallet-extensions/*/*.e2e.ts',
		'**/tests/e2e/wallet-extensions/extension-loaded-smoke.e2e.ts',
		'**/tests/e2e/wallet-extensions/provider-discovery.e2e.ts',
		'**/tests/e2e/wallet-extensions/real-wallets-required.e2e.ts',
	],
})
