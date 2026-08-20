import { expect, test } from '@playwright/test'

import bindings from '$/sources/Osmosis/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'


const poolId = '1066'
const poolPath = `/network/cosmos:osmosis-1/osmosis-pool/${poolId}`
const osmosisProxyRoute = new RegExp(
	`/api-proxy/${encodeURIComponent(sourceBindingId(bindings[Source.Osmosis_LCD_Rest][0]))}/0/`
)


test.setTimeout(180_000)

test.beforeEach(async ({ context }, testInfo) => {
	await context.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-osmosis-pool-observations-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
})

test('pool materializes spot observations whose detail uses the stored observation', async ({ page }) => {
	const requests: string[] = []
	const unexpectedRequests: string[] = []
	await page.route(osmosisProxyRoute, async (route) => {
		const providerUrl = new URL(decodeURIComponent(
			new URL(route.request().url()).pathname.split('/').at(-1) ?? ''
		))
		requests.push(`${providerUrl.pathname}${providerUrl.search}`)

		if (providerUrl.pathname === `/osmosis/poolmanager/v1beta1/pools/${poolId}`) {
			await route.fulfill({
				json: {
					pool: {
						id: poolId,
						'@type': '/osmosis.concentratedliquidity.v1beta1.Pool',
						token0: 'uosmo',
						token1: 'uion',
						current_sqrt_price: '1.224744871391589049',
						current_tick: '42',
						current_tick_liquidity: '1000000',
						tick_spacing: '100',
						exponent_at_price_one: '-6',
						spread_factor: '0.002',
						last_liquidity_update: '2026-08-20T00:00:00Z',
					},
				},
			})
			return
		}

		if (providerUrl.pathname === `/osmosis/poolmanager/v2/pools/${poolId}/prices`) {
			const baseAssetDenom = providerUrl.searchParams.get('base_asset_denom')
			const quoteAssetDenom = providerUrl.searchParams.get('quote_asset_denom')
			if (baseAssetDenom === 'uosmo' && quoteAssetDenom === 'uion') {
				await route.fulfill({
					json: {
						spot_price: '1.500000000000000000000000000000000000',
					},
				})
				return
			}

			if (baseAssetDenom === 'uion' && quoteAssetDenom === 'uosmo') {
				await route.fulfill({
					json: {
						spot_price: '0.666666666666666666666666666666666667',
					},
				})
				return
			}
		}

		if (providerUrl.pathname === `/osmosis/concentratedliquidity/v1beta1/num_pool_positions/${poolId}`) {
			await route.fulfill({
				json: {
					position_count: '3',
				},
			})
			return
		}

		unexpectedRequests.push(`${providerUrl.pathname}${providerUrl.search}`)
		await route.fulfill({
			status: 418,
			body: 'Unexpected Osmosis fixture request',
		})
	})
	await page.route('https://lcd.osmosis.zone/**', async (route) => {
		unexpectedRequests.push(route.request().url())
		await route.fulfill({
			status: 418,
			body: 'Direct Osmosis access is not allowed by this fixture',
		})
	})

	await page.goto(poolPath, {
		waitUntil: 'domcontentloaded',
	})
	await expect.poll(
		() => requests.filter((request) => request.includes('/prices?')).length,
		{
			timeout: 120_000,
		}
	).toBe(2)
	const observationLink = page.locator(
		`#main a[href^='${poolPath}/observations/'][href$='/uosmo/uion']`
	)
	await expect(observationLink).toBeAttached({
		timeout: 120_000,
	})
	const observationPath = await observationLink.getAttribute('href')
	if (observationPath == null)
		throw new Error('missing materialized Osmosis observation link')

	const priceRequestCount = requests.filter((request) => request.includes('/prices?')).length
	await observationLink.click()
	await expect(page).toHaveURL(observationPath)
	await expect(page.locator('#main')).toContainText('Spot price')
	await expect(page.locator('#main')).toContainText('1.500000000000000000000000000000000000')
	await expect(page.locator('#main')).toContainText(Source.Osmosis_LCD_Rest)
	await expect.poll(() => requests.filter((request) => request.includes('/prices?')).length).toBe(priceRequestCount)
	expect(unexpectedRequests).toEqual([])
})
