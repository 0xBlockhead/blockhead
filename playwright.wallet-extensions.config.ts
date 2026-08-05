import { defineConfig } from '@playwright/test'


const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:5173'
const webServerUrl = new URL(baseURL)

export default defineConfig({
	fullyParallel: false,
	workers: 1,
	testDir: './tests/e2e/wallet-extensions',
	testMatch: '**/*.e2e.ts',
	expect: {
		timeout: 15_000,
	},
	use: {
		baseURL,
	},
	...(process.env.PLAYWRIGHT_SKIP_WEBSERVER === '1' ?
		{}
	:
		{
			webServer: {
				command: `VITE_BLOCKHEAD_E2E_PROBE=1 PUBLIC_ALLIUM_API_KEY=e2e PUBLIC_YOUTUBE_API_KEY=e2e PUBLIC_LND_MACAROON_HEX=e2e ./node_modules/.bin/dotenvx run -f .env.local -- ./node_modules/.bin/vite dev --host ${webServerUrl.hostname} --port ${webServerUrl.port}`,
				url: baseURL,
				timeout: 240_000,
				reuseExistingServer: process.env.PLAYWRIGHT_REUSE_EXISTING_SERVER === '1',
			},
		}),
})
