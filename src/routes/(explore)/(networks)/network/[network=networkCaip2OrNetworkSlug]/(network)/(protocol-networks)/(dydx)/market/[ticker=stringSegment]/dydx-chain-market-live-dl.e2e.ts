import { expect, test } from '@playwright/test'

import {
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../../../../../../../tests/_e2eBrowserHelpers.ts'


const blockHeightTime = '2026-08-05T17:00:00.000Z'
const initialMarketKind = 'CROSS'
const ticker = 'SOL-USD'
const marketPath = `/network/cosmos:dydx-mainnet-1/market/${ticker}`

const solUsdMarket = {
	atomicResolution: -9,
	baseOpenInterest: '782.0931',
	clobPairId: '1',
	initialMarginFraction: '0.05',
	maintenanceMarginFraction: '0.03',
	marketType: initialMarketKind,
	nextFundingRate: '-0.0000000000001',
	openInterest: '308.7674',
	oraclePrice: '65554.247690000000000001',
	priceChange24H: '-746.07211',
	quantumConversionExponent: -9,
	status: 'ACTIVE',
	stepBaseQuantums: 1000000,
	stepSize: '0.001',
	subticksPerTick: 100000,
	ticker,
	tickSize: '0.01',
	trades24H: 6131,
	volume24H: '42428295.3917',
} as const

test.setTimeout(120_000)

const appOrigin = new URL(
	process.env.PLAYWRIGHT_BASE_URL?.trim() || 'http://127.0.0.1:4173'
).origin

const isLocalAppUrl = (url: string) => (
	new URL(url).origin === appOrigin
)

const failClosedRoute = async (
	route: import('@playwright/test').Route
) => {
	await route.fulfill({
		body: 'e2e fail-closed: unstubbed request',
		status: 418,
	})
}

const installDydxRestStubs = async (
	page: import('@playwright/test').Page
) => {
	await page.route('**/api-proxy/**', async (route) => {
		const url = decodeURIComponent(route.request().url())
		if (url.endsWith('/v4/height')) {
			await route.fulfill({
				json: {
					height: '100',
					time: blockHeightTime,
				},
			})
			return
		}
		if (url.includes('/v4/perpetualMarkets')) {
			await route.fulfill({
				json: {
					markets: {
						[ticker]: {
							...solUsdMarket,
						},
					},
				},
			})
			return
		}
		if (url.includes('/v4/historicalFunding/')) {
			await route.fulfill({
				json: {
					historicalFunding: [],
				},
			})
			return
		}

		await failClosedRoute(route)
	})
}

const installFailClosedCatchall = async (
	page: import('@playwright/test').Page
) => {
	await page.route('**/*', async (route) => {
		const url = route.request().url()
		if (isLocalAppUrl(url))
			await route.continue()
		else
			await failClosedRoute(route)
	})
}

const marketKindDd = (page: import('@playwright/test').Page) => (
	page.locator('#main article[id^="dydx-chain-market-"]').first().locator('dl div').filter({
		has: page.locator('dt', {
			hasText: /^market kind$/i,
		}),
	}).locator('dd').first()
)

test.beforeEach(async ({ page }, testInfo) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `bh-dydx-market-dl-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
})

test('generated DydxChainMarketView dl: fail-closed REST snapshot in ResourceBoundary', async ({ page }) => {
	await installFailClosedCatchall(page)
	await installChainlistRpcsJsonStub(page)
	await installDydxRestStubs(page)
	await page.route('**/_app/remote/**', async (route) => {
		const payload = new URL(route.request().url()).searchParams.get('payload')
		const request = payload == null ? '' : Buffer.from(payload, 'base64url').toString()
		if (!request.includes('subscribe'))
			await route.continue()
		else
			await failClosedRoute(route)
	})

	await page.goto(marketPath)
	await expectMainVisible(page)
	await page.locator('body').evaluate((body) => {
		body.dataset.dydxMarketDlRouteInstance = 'open'
	})
	await expect(marketKindDd(page)).toHaveText(initialMarketKind, {
		timeout: 120_000,
	})
	await expect(page.locator('body')).toHaveAttribute('data-dydx-market-dl-route-instance', 'open')
})
