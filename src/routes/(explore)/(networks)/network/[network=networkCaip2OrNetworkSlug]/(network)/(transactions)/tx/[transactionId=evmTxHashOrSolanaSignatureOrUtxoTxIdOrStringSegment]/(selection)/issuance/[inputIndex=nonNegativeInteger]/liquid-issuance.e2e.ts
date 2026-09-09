import { expect, test } from '@playwright/test'

import { expectMainVisible } from '../../../../../../../../../../../../../tests/_e2eBrowserHelpers.ts'
import { installRouteViewSqliteIsolation } from '../../../../../../../../../../../../../tests/e2e/_routeViewFixtures.ts'


const transactionId = 'c'.repeat(64)
const assetId = 'a'.repeat(64)
const tokenId = 'b'.repeat(64)
const issuancePath = `/network/liquid/tx/${transactionId}/issuance/0`


test.setTimeout(180_000)

test.beforeEach(async ({ page }, testInfo) => {
	await installRouteViewSqliteIsolation(page, testInfo, 'liquid-issuance')
})


test('Liquid issuance renders native asset and reissuance-token relationships', async ({ page }) => {
	await page.route(`**/liquid/api/tx/${transactionId}`, async (route) => {
		await route.fulfill({
			json: {
				txid: transactionId,
				version: 2,
				locktime: 0,
				size: 300,
				weight: 900,
				fee: 200,
				status: {
					confirmed: true,
				},
				vin: [{
					is_coinbase: false,
					sequence: 0xfffffffe,
					issuance: {
						asset_id: assetId,
						is_reissuance: false,
						asset_blinding_nonce: '0'.repeat(64),
						asset_entropy: 'e'.repeat(64),
						assetamount: 125_000,
						token: tokenId,
						tokenamount: 1,
					},
				}],
				vout: [],
			},
		})
	})
	await page.route('**/liquid/api/asset/*', async (route) => {
		const requestedAssetId = new URL(route.request().url()).pathname.split('/').at(-1)
		await route.fulfill({
			json: {
				asset_id: requestedAssetId,
				name: requestedAssetId === assetId ? 'Issued Test Asset' : 'Reissuance Token',
				ticker: requestedAssetId === assetId ? 'ITA' : 'ITR',
				precision: 8,
				chain_stats: {
					tx_count: 1,
				},
				mempool_stats: {
					tx_count: 0,
				},
			},
		})
	})

	await page.goto(issuancePath, { waitUntil: 'load' })
	await expectMainVisible(page)
	const main = page.locator('#main')
	await expect(main).toContainText('ITA', { timeout: 120_000 })
	await expect(main).toContainText('ITR')
	await expect(main).toContainText('125,000')
	await expect(main).toContainText('Reissuance')
	await expect(main).toContainText('No')
	await expect(main).toContainText('eeeeeeee')
})
