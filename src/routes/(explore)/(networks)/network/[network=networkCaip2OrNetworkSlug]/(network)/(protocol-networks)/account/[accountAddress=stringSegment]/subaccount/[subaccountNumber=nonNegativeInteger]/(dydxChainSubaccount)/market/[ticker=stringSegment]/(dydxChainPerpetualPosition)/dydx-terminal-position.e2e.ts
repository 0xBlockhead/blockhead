import { expect, test } from '@playwright/test'


const address = `dydx1${'q'.repeat(38)}`
const positionPath = `/network/cosmos:dydx-mainnet-1/account/${address}/subaccount/0/market/SOL-USD`


test('terminal dYdX positions stay reachable with their source-owned closure observation', async ({ page }, testInfo) => {
	testInfo.setTimeout(180_000)
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `dydx-terminal-position-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await page.route('**/*', async (route) => {
		const url = decodeURIComponent(route.request().url())
		if (!url.includes('indexer.dydx.trade/v4/')) {
			await route.fallback()
			return
		}

		if (url.includes('/v4/addresses/')) {
			await route.fulfill({
				json: {
					address,
					subaccountNumber: 0,
					equity: '10',
					freeCollateral: '8',
					openPerpetualPositions: {},
					assetPositions: {},
					marginEnabled: true,
					updatedAtHeight: '100',
					latestProcessedBlockHeight: '100',
				},
			})
			return
		}
		if (url.includes('/v4/perpetualPositions?')) {
			await route.fulfill({
				json: {
					positions: [{
						market: 'SOL-USD',
						status: 'CLOSED',
						side: 'LONG',
						size: '0',
						maxSize: '0.25',
						entryPrice: '64000',
						realizedPnl: '3.5',
						createdAt: '2026-06-01T00:00:00.000Z',
						createdAtHeight: '90',
						closedAt: '2026-06-02T00:00:00.000Z',
						sumOpen: '0.25',
						sumClose: '0.25',
						netFunding: '-0.02',
						unrealizedPnl: '0',
						subaccountNumber: 0,
					}],
				},
			})
			return
		}
		if (url.includes('/v4/perpetualMarkets')) {
			await route.fulfill({
				json: {
					markets: {
						'SOL-USD': {
							atomicResolution: -9,
							baseOpenInterest: '0',
							clobPairId: '1',
							initialMarginFraction: '0.05',
							maintenanceMarginFraction: '0.03',
							marketType: 'CROSS',
							nextFundingRate: '0',
							openInterest: '0',
							oraclePrice: '100',
							priceChange24H: '0',
							quantumConversionExponent: -9,
							status: 'ACTIVE',
							stepBaseQuantums: 1,
							stepSize: '0.001',
							subticksPerTick: 1,
							ticker: 'SOL-USD',
							tickSize: '0.01',
							trades24H: 0,
							volume24H: '0',
						},
					},
				},
			})
			return
		}

		await route.fallback()
	})

	await page.goto(positionPath, {
		waitUntil: 'load',
	})
	const main = page.locator('#main')
	await expect(main).toBeVisible({
		timeout: 120_000,
	})
	await expect(main).toContainText('SOL-USD', {
		timeout: 120_000,
	})
	await expect(main).toContainText('3.5', {
		timeout: 120_000,
	})
	await expect(main.locator('[data-error], [role="alert"]')).toHaveCount(0)
})
