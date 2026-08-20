import {
	expect,
	test,
} from '@playwright/test'


const originChainId = 8453
const depositId = 42
const sourceTransactionHash = `0x${'1'.repeat(64)}`
const destinationTransactionHash = `0x${'2'.repeat(64)}`
const transferPath = `/~/bridge/transfer/across/${String(originChainId)}/${String(depositId)}`
const observationPath = `${transferPath}/observations/1784909523000/Across_Rest`

const deposit = {
	id: 14_503_095,
	relayHash: `0x${'3'.repeat(64)}`,
	depositId: String(depositId),
	originChainId,
	destinationChainId: 42161,
	depositor: '0xa4d353bbc130cbef1811f27ac70989f9d568ceab',
	recipient: '0xb4d353bbc130cbef1811f27ac70989f9d568ceab',
	inputToken: '0x4200000000000000000000000000000000000006',
	inputAmount: '900719925474099312345',
	outputToken: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
	outputAmount: '900719925474099300000',
	message: '0x',
	messageHash: `0x${'0'.repeat(64)}`,
	exclusiveRelayer: '0xcad97616f91872c02ba3553db315db4015cbe850',
	exclusivityDeadline: null,
	fillDeadline: '2026-07-24T19:26:20.000Z',
	quoteTimestamp: '2026-07-24T16:07:11.000Z',
	depositBlockNumber: 33_292_078,
	depositBlockTimestamp: '2026-07-24T16:11:43.000Z',
	depositTxnRef: sourceTransactionHash,
	status: 'filled',
	depositRefundTxnRef: null,
	bridgeFeeUsd: '0.017884155707075979',
	fillGasFee: '2532354948000',
	fillGasFeeUsd: '0.009488583742324977',
	relayer: '0xcad97616f91872c02ba3553db315db4015cbe850',
	fillBlockNumber: 44_135_258,
	fillBlockTimestamp: '2026-07-24T16:12:03.000Z',
	fillTxnRef: destinationTransactionHash,
	speedups: [],
}


test('Across transfer route exposes only the fill-clocked status transition', async ({ page }, testInfo) => {
	testInfo.setTimeout(180_000)
	const pageErrors: string[] = []
	page.on('pageerror', (error) => pageErrors.push(error.message))

	await page.addInitScript(({ databaseName, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = databaseName
		window.__blockheadWaSqliteVfsNameOverride = databaseName.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		databaseName: `across-transfer-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await page.route('**/api-proxy/**', async (route) => {
		const requestUrl = decodeURIComponent(route.request().url())
		if (requestUrl.includes('/api/v2/addresses/')) {
			await route.fulfill({
				json: {
					token: {
						name: 'Wrapped Ether',
						symbol: 'WETH',
						decimals: '18',
					},
				},
			})
			return
		}
		if (!requestUrl.includes('app.across.to/api/deposit')) {
			await route.fulfill({
				status: 418,
			})
			return
		}

		await route.fulfill({
			contentType: 'application/json',
			json: {
				deposit,
				pagination: {
					currentIndex: 0,
					maxIndex: 0,
				},
			},
		})
	})

	await page.goto(transferPath, {
		waitUntil: 'domcontentloaded',
	})
	const main = page.locator('#main')
	await expect(main).toBeVisible({
		timeout: 120_000,
	})
	await expect(main).toContainText(`${String(originChainId)}/${String(depositId)}`, {
		timeout: 120_000,
	})
	await expect(main).toContainText('source tx')
	await expect(main).toContainText('destination tx')
	await expect(main).toContainText('from network')
	await expect(main).toContainText('to network')
	await expect(main).toContainText('settlement model')
	await expect(main).toContainText('IntentFill')
	await expect(main).toContainText('verification model')
	await expect(main).toContainText('Optimistic')
	await expect(main).toContainText('asset outcome')
	await expect(main).toContainText('SameNative')

	await page.goto(observationPath, {
		waitUntil: 'domcontentloaded',
	})

	await expect(page).toHaveURL((url) => url.pathname === observationPath)
	await expect(main).toContainText('filled', {
		timeout: 120_000,
	})
	await expect(main).toContainText('destination tx hash')
	await expect(main).toContainText('relayer')
	await expect(main).toContainText('fill gas fee')
	expect(pageErrors).toEqual([])
})
