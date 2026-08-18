import { expect, test } from '@playwright/test'


const pegTransactionId = 'a'.repeat(64)
const liquidBitcoinAssetId = '6f0279e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d'
const pegPath = `/network/liquid/elements/peg/${pegTransactionId}/PegOut`

const pegTransactionWire = {
	txid: pegTransactionId,
	status: {
		confirmed: true,
		block_height: 3_500_000,
		block_time: 1_800_000_000,
	},
	vin: [],
	vout: [{
		scriptpubkey: '6a',
		scriptpubkey_type: 'op_return',
		value: 125_000,
		pegout: {
			genesis_hash: 'b'.repeat(64),
			scriptpubkey: '0014abcd',
		},
	}],
}


test.beforeEach(async ({ page }, testInfo) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-liquid-elements-peg-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
})


test('renders a native Liquid peg-out from Esplora transaction facts', async ({ page }) => {
	test.setTimeout(180_000)

	await page.route('https://blockstream.info/liquid/api/**', async (route) => {
		const pathname = new URL(route.request().url()).pathname
		if (pathname === `/liquid/api/tx/${pegTransactionId}`) {
			await route.fulfill({
				json: pegTransactionWire,
			})
			return
		}
		if (pathname === `/liquid/api/asset/${liquidBitcoinAssetId}`) {
			await route.fulfill({
				json: {
					asset_id: liquidBitcoinAssetId,
					name: 'Liquid Bitcoin',
					ticker: 'LBTC',
					precision: 8,
					chain_stats: {
						tx_count: 1,
					},
					mempool_stats: {
						tx_count: 0,
					},
				},
			})
			return
		}
		if (pathname === '/liquid/api/assets/registry') {
			await route.fulfill({
				json: [],
			})
			return
		}

		throw new Error(`Unexpected blockstream.info liquid request ${pathname}`)
	})

	await page.route('**/api-proxy/**', async (route) => {
		throw new Error(`Unexpected api-proxy request ${route.request().url()}`)
	})

	await page.goto(pegPath, { waitUntil: 'domcontentloaded' })
	const main = page.locator('#main')
	await expect(main).toContainText('125,000', {
		timeout: 120_000,
	})
	await expect(main).toContainText('0014abcd', {
		timeout: 120_000,
	})
	await expect(main.locator('[data-error], [role="alert"]')).toHaveCount(0)
})
