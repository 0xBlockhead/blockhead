import { expect, test } from '@playwright/test'

import {
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../../../../tests/_e2eBrowserHelpers.ts'
import aaveBindings from '$/sources/Aave/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'


const poolAddress = '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2'
const underlyingTokenAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
const marketPath = `/network/eip155:1/aave-market/${poolAddress}`
const reservePath = `${marketPath}/reserve/${underlyingTokenAddress}`
const aaveProxyRoute = new RegExp(`/api-proxy/${encodeURIComponent(sourceBindingId(aaveBindings[Source.Aave_Rest][0]))}/0/`)

const market = {
	name: 'AaveV3Ethereum',
	address: poolAddress,
	icon: 'https://statics.aave.com/ethereum.svg',
	totalMarketSize: '20169737076.235233639488619539',
	totalAvailableLiquidity: '10938067474.915557948999849733',
	chain: {
		chainId: 1,
		name: 'Ethereum',
	},
	reserves: [
		{
			underlyingToken: {
				address: underlyingTokenAddress,
				name: 'USD Coin',
				symbol: 'USDC',
				decimals: 6,
				imageUrl: 'https://statics.aave.com/icons/tokens/usdc.svg',
				chainId: 1,
			},
			isFrozen: false,
			isPaused: false,
			size: {
				amount: {
					value: '1000',
				},
			},
			supplyInfo: {
				apy: {
					value: '0.03',
				},
			},
			borrowInfo: {
				apy: {
					value: '0.05',
				},
				availableLiquidity: {
					amount: {
						value: '750',
					},
				},
			},
		},
	],
}


test('market reserve list links to its canonical reserve detail', async ({ page }, testInfo) => {
	testInfo.setTimeout(180_000)
	const pageErrors: string[] = []
	page.on('pageerror', (error) => pageErrors.push(error.message))

	await page.addInitScript(({ databaseName, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = databaseName
		window.__blockheadWaSqliteVfsNameOverride = databaseName.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		databaseName: `aave-reserve-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await installChainlistRpcsJsonStub(page)
	await page.route(aaveProxyRoute, async (route) => {
		await route.fulfill({
			contentType: 'application/json',
			json: {
				data: {
					market,
				},
			},
		})
	})

	await page.goto(marketPath, {
		waitUntil: 'domcontentloaded',
	})
	await expectMainVisible(page, 120_000)

	const reserveLink = page.getByRole('link', {
		name: 'USDC',
	})
	await expect(reserveLink).toBeVisible({
		timeout: 120_000,
	})
	await expect(reserveLink).toHaveAttribute('href', reservePath)
	await reserveLink.click()

	await expect(page).toHaveURL((url) => url.pathname === reservePath)
	await expect(page.getByRole('heading', {
		name: 'USDC',
	})).toBeVisible({
		timeout: 120_000,
	})
	await expect(page.getByText('USD Coin', {
		exact: true,
	})).toBeVisible()
	await expect(page.getByText('750', {
		exact: true,
	})).toBeVisible()
	await expect(page.locator('#main [data-error], #main [role="alert"]')).toHaveCount(0)
	expect(pageErrors).toEqual([])
})
