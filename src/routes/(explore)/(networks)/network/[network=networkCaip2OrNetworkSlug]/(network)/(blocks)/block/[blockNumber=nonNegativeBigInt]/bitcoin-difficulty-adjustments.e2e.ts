import { expect, test } from '@playwright/test'


const blockHeight = 961_632
const blockHash = 'a'.repeat(64)
const blockPath = `/network/bitcoin/block/${blockHeight}/${blockHash}`
const difficultyAdjustments = [[
	1_786_217_755,
	blockHeight,
	127_479_855_693_691.4,
	1.00989,
]]
const block = {
	id: blockHash,
	height: blockHeight,
	version: 536_870_912,
	timestamp: 1_786_217_755,
	tx_count: 0,
	size: 1_000,
	weight: 4_000,
	merkle_root: 'b'.repeat(64),
	previousblockhash: 'c'.repeat(64),
	mediantime: 1_786_217_700,
	nonce: 1,
	bits: 386_000_000,
	difficulty: 127_479_855_693_691.4,
}


test.beforeEach(async ({ page }, testInfo) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-bitcoin-difficulty-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
})

test('renders Bitcoin difficulty history with exact retarget block links', async ({ page }) => {
	test.setTimeout(180_000)
	const unexpectedRequests: string[] = []
	await page.route('https://mempool.space/api/**', async (route) => {
		const request = route.request()
		const pathname = new URL(request.url()).pathname
		if (request.method() === 'GET' && pathname === '/api/v1/mining/difficulty-adjustments/3m') {
			await route.fulfill({ json: difficultyAdjustments })
			return
		}
		if (request.method() === 'GET' && pathname === '/api/v1/blocks') {
			await route.fulfill({ json: [block] })
			return
		}
		if (request.method() === 'GET' && pathname === `/api/block-height/${blockHeight}`) {
			await route.fulfill({ json: blockHash })
			return
		}
		if (request.method() === 'GET' && pathname === `/api/block/${blockHash}`) {
			await route.fulfill({ json: block })
			return
		}
		if (request.method() === 'GET' && pathname === '/api/mempool') {
			await route.fulfill({
				json: {
					count: 0,
					vsize: 0,
					total_fee: 0,
				},
			})
			return
		}
		if (request.method() === 'GET' && pathname === '/api/mempool/txids') {
			await route.fulfill({ json: [] })
			return
		}
		if (request.method() === 'GET' && pathname === '/api/v1/mining/hashrate/3d') {
			await route.fulfill({
				json: {
					hashrates: [],
					difficulty: difficultyAdjustments,
					currentHashrate: 1,
					currentDifficulty: block.difficulty,
				},
			})
			return
		}
		if (request.method() === 'GET' && pathname === '/api/v1/fees/recommended') {
			await route.fulfill({
				json: {
					fastestFee: 1,
					halfHourFee: 1,
					hourFee: 1,
					economyFee: 1,
					minimumFee: 1,
				},
			})
			return
		}
		if (request.method() === 'GET' && pathname === '/api/v1/difficulty-adjustment') {
			await route.fulfill({
				json: {
					progressPercent: 50,
					difficultyChange: 1,
					estimatedRetargetDate: 1_786_300_000_000,
					remainingBlocks: 1_008,
					remainingTime: 604_800_000,
					previousRetarget: 1,
					previousTime: 1_786_217_755,
					nextRetargetHeight: 963_648,
					timeAvg: 600_000,
					adjustedTimeAvg: 600_000,
					timeOffset: 0,
					expectedBlocks: 1_008,
				},
			})
			return
		}
		if (request.method() === 'GET' && pathname === '/api/v1/mining/pools') {
			await route.fulfill({ json: [] })
			return
		}

		unexpectedRequests.push(`${request.method()} ${pathname}`)
		await route.fulfill({
			status: 418,
			body: 'Unexpected Mempool fixture request',
		})
	})

	await page.goto('/network/bitcoin', { waitUntil: 'domcontentloaded' })
	await expect(page.locator('#main').getByText('Difficulty adjustments', { exact: true })).toBeAttached({
		timeout: 120_000,
	})
	await expect(page.locator(`#main a[href='${blockPath}']`)).toBeAttached()
	await expect(page.locator('#main [data-error], #main [role="alert"]')).toHaveCount(0)
	expect(unexpectedRequests).toEqual([])
})
