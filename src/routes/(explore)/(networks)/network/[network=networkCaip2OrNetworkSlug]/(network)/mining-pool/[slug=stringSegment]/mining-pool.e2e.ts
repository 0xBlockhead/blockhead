import { expect, test } from '@playwright/test'


const poolPath = '/network/bitcoin/mining-pool/f2pool'
const miningPool = {
	pool: {
		id: 37,
		name: 'F2Pool',
		link: 'https://www.f2pool.com',
		addresses: [
			'1KFHE7w8BhaENAswwryaoccDb6qcT6DbYY',
			'bc1qf274x7penhcd8hsv3jcmwa5xxzjl2a6pa9pxwm',
		],
		regexes: [
			'F2Pool',
			'🐟',
		],
		slug: 'f2pool',
		unique_id: 36,
	},
	blockCount: {
		all: 97_479,
		'24h': 18,
		'1w': 167,
	},
	blockShare: {
		all: 0.10126509954166373,
		'24h': 0.1232876712328767,
		'1w': 0.16851664984863773,
	},
	estimatedHashrate: 113_185_830_253_682_540_000,
	reportedHashrate: null,
	avgBlockHealth: 99.15,
	totalReward: '128416697905845',
}


const decodeProxyUrl = (url: string) => {
	try {
		const once = decodeURIComponent(url)
		try {
			return decodeURIComponent(once)
		} catch {
			return once
		}
	} catch {
		return url
	}
}


test.beforeEach(async ({ page }, testInfo) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-mining-pool-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
})


test('renders native Bitcoin mining-pool catalog identity for f2pool', async ({ page }) => {
	test.setTimeout(180_000)
	await page.route('**/api-proxy/**', async (route) => {
		const requestUrl = decodeProxyUrl(route.request().url())
		if (requestUrl.includes('/api/v1/mining/pool/f2pool')) {
			await route.fulfill({
				json: miningPool,
			})
			return
		}

		await route.fulfill({
			json: {},
		})
	})
	await page.route('https://mempool.space/api/**', async (route) => {
		const pathname = new URL(route.request().url()).pathname
		if (pathname === '/api/v1/mining/pool/f2pool') {
			await route.fulfill({
				json: miningPool,
			})
			return
		}

		throw new Error(`Unexpected mempool.space request ${pathname}`)
	})

	await page.goto(poolPath, {
		waitUntil: 'domcontentloaded',
	})
	const main = page.locator('#main')
	await expect(main.getByRole('heading', {
		name: 'F2Pool',
		exact: true,
	})).toBeAttached({
		timeout: 120_000,
	})
	await expect(main.locator('dt', {
		hasText: 'Catalog id',
	}).locator('+ dd')).toContainText('36', {
		timeout: 120_000,
	})
	await expect(main.locator('a[href="https://www.f2pool.com"]')).toBeAttached()
})
