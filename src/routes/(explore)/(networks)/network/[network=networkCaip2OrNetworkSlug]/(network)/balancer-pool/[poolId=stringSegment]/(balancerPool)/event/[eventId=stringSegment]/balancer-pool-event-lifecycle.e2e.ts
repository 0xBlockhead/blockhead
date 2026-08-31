import { expect, test } from '@playwright/test'

import {
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../../../../../../../../tests/_e2eBrowserHelpers.ts'


const poolId = '0x3de27efa2f1aa663ae5d458857e731c129069f29000200000000000000000588'
const eventId = '0xd80ee5aeb80511d3a4a96503b44ccfa3f2af0c113daa42691bfc0f1baf43961dd4000000'
const transactionHash = '0xd80ee5aeb80511d3a4a96503b44ccfa3f2af0c113daa42691bfc0f1baf43961d'
const userAddress = '0xa99b2d5cc6847849f9b9c051474964acf1cac543'


test.beforeEach(async ({ page }, testInfo) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-balancer-event-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await installChainlistRpcsJsonStub(page)
})


test('Balancer pool event route renders the source-owned lifecycle hierarchy', async ({ page }) => {
	test.setTimeout(180_000)

	const operations: string[] = []
	await page.route('https://api-v3.balancer.fi/**', async (route) => {
		const body: {
			query: string
		} = route.request().postDataJSON()
		if (body.query.includes('query PoolEvents')) {
			operations.push('PoolEvents')
			await route.fulfill({
				json: {
					data: {
						poolEvents: [{
							id: eventId,
							type: 'SWAP',
							chain: 'MAINNET',
							poolId,
							valueUSD: 6.26,
							blockNumber: 25698468,
							blockTimestamp: 1786050083,
							tx: transactionHash,
							userAddress,
						}],
					},
				},
			})
			return
		}
		if (body.query.includes('query PoolGetPool')) {
			operations.push('PoolGetPool')
			await route.fulfill({
				json: {
					data: {
						poolGetPool: {
							id: poolId,
							address: '0x3de27efa2f1aa663ae5d458857e731c129069f29',
							name: '20wstETH-80AAVE',
							type: 'WEIGHTED',
							version: 4,
							protocolVersion: 2,
							chain: 'MAINNET',
							poolTokens: [{
								address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
								symbol: 'wstETH',
								balance: '981.9501443290337',
								decimals: 18,
								weight: '1',
							}],
							dynamicData: {
								totalLiquidity: '11356688.22',
								totalShares: '78351.308448723247365152',
								swapFee: '0.00292',
							},
						},
					},
				},
			})
			return
		}

		throw new Error('Unexpected Balancer GraphQL operation')
	})

	await page.goto(`/network/eip155:1/balancer-pool/${poolId}/event/${eventId}`, { waitUntil: 'load' })
	await expectMainVisible(page)
	const main = page.locator('#main')
	await expect(main).toContainText('SWAP', { timeout: 120_000 })
	await expect(main).toContainText('6.26')
	await expect(main.locator('time[datetime="2026-08-06T21:01:23.000Z"]')).toBeAttached()
	await expect(main.locator(`a[href="/network/eip155:1/tx/${transactionHash}"]`)).toBeAttached()
	await expect(main.locator(`a[href="/network/eip155:1/account/${userAddress}"]`)).toBeAttached()
	await expect(main.locator('a[href="/network/eip155:1/block/25698468"]')).toBeAttached()
	await expect(main.locator('[data-error], [role="alert"]')).toHaveCount(0)
	await expect.poll(() => [...new Set(operations)].sort()).toEqual([
		'PoolEvents',
		'PoolGetPool',
	])
})
