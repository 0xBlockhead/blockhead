import { expect, test } from '@playwright/test'


const observationPath = '/network/bitcoin/observation/300000/MempoolSpace_Rest'


test.beforeEach(async ({ page }, testInfo) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-mempool-hashrate-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
})


test('renders the exact provider-clocked mining hashrate observation', async ({ page }) => {
	test.setTimeout(180_000)
	await page.route('https://mempool.space/api/**', async (route) => {
		const pathname = new URL(route.request().url()).pathname
		if (pathname === '/api/v1/blocks') {
			await route.fulfill({ json: [] })
			return
		}
		if (pathname === '/api/mempool') {
			await route.fulfill({
				json: {
					count: 9,
					vsize: 1800,
					total_fee: 1,
				},
			})
			return
		}
		if (pathname === '/api/v1/mining/hashrate/3d') {
			await route.fulfill({
				json: {
					hashrates: [{
						timestamp: 300,
						avgHashrate: 3000,
					}],
					difficulty: [],
					currentHashrate: 4000,
					currentDifficulty: 1,
				},
			})
			return
		}
		if (pathname === '/api/v1/fees/recommended') {
			await route.fulfill({
				json: {
					fastestFee: 20,
					halfHourFee: 10,
					hourFee: 6,
					economyFee: 2,
					minimumFee: 1,
				},
			})
			return
		}

		throw new Error(`Unexpected mempool.space request ${pathname}`)
	})

	await page.goto(observationPath, { waitUntil: 'domcontentloaded' })
	const main = page.locator('#main')
	await expect(main).toContainText('Estimated network hashes per second', {
		timeout: 120_000,
	})
	await expect(main).toContainText('3000')
	await expect(main.locator('[data-error], [role="alert"]')).toHaveCount(0)
})
