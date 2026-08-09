import { expect, test } from '@playwright/test'

import {
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../../../../tests/_e2eBrowserHelpers.ts'


const marketId = '0x9103c3b4e834476c9a62ea009ba2c884ee42e94e6e314a26f04d312434191836'
const marketPath = `/network/eip155:1/morpho-market/${marketId}`
const loanAssetAddress = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'
const collateralAssetAddress = '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf'


test('Morpho Blue market route renders protocol-native REST fields', async ({ page }, testInfo) => {
	testInfo.setTimeout(180_000)
	const pageErrors: string[] = []
	let marketConfigRequests = 0
	let marketStateRequests = 0
	page.on('pageerror', (error) => pageErrors.push(error.message))

	await page.addInitScript(({ databaseName, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = databaseName
		window.__blockheadWaSqliteVfsNameOverride = databaseName.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		databaseName: `morpho-market-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await installChainlistRpcsJsonStub(page)
	await page.route('https://api.morpho.org/graphql', async (route) => {
		await route.fulfill({
			contentType: 'application/json',
			json: {
				data: {
					marketById: {
						marketId,
						creationBlockNumber: 19326981,
						listed: true,
						chain: {
							id: 1,
						},
						loanAsset: {
							address: loanAssetAddress,
						},
						collateralAsset: {
							address: collateralAssetAddress,
						},
						lltv: '860000000000000000',
						irmAddress: '0x46415998764c29ab2a25cbea6254146d50d22687',
						oracle: {
							address: '0x663becd10dae6c4a3dcd89f1d76c1174199639b9',
						},
						state: {
							supplyAssets: '111',
							supplyShares: '222',
							borrowAssets: '333',
							borrowShares: '444',
							timestamp: 1785860339,
							blockNumber: '49535496',
							fee: 0.01,
							utilization: 0.89,
							supplyApy: 0.04,
							borrowApy: 0.06,
							liquidityAssets: '555',
						},
					},
				},
			},
		})
	})
	await page.route(`https://api.morpho.org/v0/blue/markets/1:${marketId}`, async (route) => {
		marketConfigRequests += 1
		await route.fulfill({
			contentType: 'application/json',
			json: {
				data: {
					chain_id: 1,
					market_id: marketId,
					loan_token: loanAssetAddress,
					collateral_token: collateralAssetAddress,
					oracle_address: '0x663becd10dae6c4a3dcd89f1d76c1174199639b9',
					irm_address: '0x46415998764c29ab2a25cbea6254146d50d22687',
					lltv_wad: '860000000000000000',
					creation_block_number: '19326981',
				},
			},
		})
	})
	await page.route(`https://api.morpho.org/v0/blue/markets/1:${marketId}/state`, async (route) => {
		marketStateRequests += 1
		await route.fulfill({
			contentType: 'application/json',
			json: {
				data: {
					chain_id: 1,
					market_id: marketId,
					last_indexed_block: '49535496',
					last_accrual_timestamp: 1785860339,
					total_supply_assets: '1469324386999070',
					total_supply_shares: '1335597548670035219493',
					total_borrow_assets: '1309301819369210',
					total_borrow_shares: '1175898795256045502042',
					fee_wad: '0',
				},
			},
		})
	})

	await page.goto(marketPath, {
		waitUntil: 'domcontentloaded',
	})
	await expectMainVisible(page, 120_000)

	await expect(page).toHaveTitle(`${marketId} • Morpho market • Blockhead`, {
		timeout: 120_000,
	})
	await expect(page.getByRole('button', {
		name: loanAssetAddress,
	})).toBeAttached({
		timeout: 120_000,
	})
	await expect(page.getByRole('button', {
		name: collateralAssetAddress,
	})).toBeAttached()
	await expect(
		page
			.getByText('Fee (WAD)', {
				exact: true,
			})
			.locator('..')
			.getByText('0', {
				exact: true,
			})
	).toBeAttached()
	await expect.poll(() => marketConfigRequests).toBeGreaterThan(0)
	await expect.poll(() => marketStateRequests).toBeGreaterThan(0)
	await expect(page.locator('#main [data-error], #main [role="alert"]')).toHaveCount(0)
	expect(pageErrors).toEqual([])
})
