import { expect, test, type Page } from '@playwright/test'

const setupFailFast = (page: Page) => {
	let failed = false
	let rejectRuntimeError: ((error: Error) => void) | undefined
	const runtimeError = new Promise<never>((_, reject) => {
		rejectRuntimeError = reject
	})
	const failFast = (error: Error) => {
		if (failed) return
		failed = true
		rejectRuntimeError?.(error)
	}
	const step = async <_Value>(promise: Promise<_Value>) => {
		await Promise.race([promise, runtimeError])
	}

	page.on('pageerror', (error) => {
		failFast(new Error(`pageerror: ${error.message}`))
	})

	page.on('console', (message) => {
		if (
			message.type() === 'error'
			&& !message.text().includes('Failed to load resource: the server responded with a status of 404')
			&& !message.text().includes('Failed to load resource: the server responded with a status of 422')
			&& !message.text().includes('Failed to load resource: the server responded with a status of 429')
			&& !message.text().includes('Failed to load resource: the server responded with a status of 500')
			&& !message.text().includes('Failed to load resource: the server responded with a status of 502')
			&& !message.text().includes('[vite] Failed to reload')
			&& !message.text().includes('Failed to fetch dynamically imported module')
			&& !message.text().includes('Failed to load resource: net::ERR_QUIC_PROTOCOL_ERROR')
			&& !message.text().includes('Failed to load resource: net::ERR_CONNECTION_REFUSED')
			&& !message.text().includes('Failed to load resource: net::ERR_FAILED')
			&& !message.text().includes('has been blocked by CORS policy')
			&& !message.text().includes('net::ERR_NETWORK_CHANGED')
			&& !message.text().includes('net::ERR_NETWORK_IO_SUSPENDED')
			&& !(
				message.text().includes('[QueryCollection]')
				&& (
					/resolver\(s\) failed/.test(message.text())
					|| /Fetch failed \(\d{3}/.test(message.text())
				)
			)
		) failFast(new Error(`console error: ${message.text()}`))
	})

	return {
		step,
	}
}

const attach = { timeout: 120_000 } as const

test.describe('/coins routes', () => {
	test.describe.configure({ timeout: 180_000 })

	test('coins list renders catalog and hub carousels', async ({ page }, testInfo) => {
		testInfo.setTimeout(180_000)
		const { step } = setupFailFast(page)

		await step(page.goto('/coins', { waitUntil: 'load', timeout: 120_000 }))

		await step(expect(page.locator('#coins')).toBeAttached(attach))
		await step(expect(page.locator('#coins-catalog')).toBeVisible())
		await step(expect(page.getByText('Not found')).toHaveCount(0))
		await step(expect(page.getByRole('heading', { name: '500' })).toHaveCount(0))

		await step(expect(page.locator('#coins-catalog a[href^="/coin/"]').first()).toBeAttached(attach))
		await step(expect(page.locator('#coins-catalog a[href*="/coin/BTC"]').first()).toBeAttached(attach))

		await step(expect(page.locator('#coins .coins-view-collapsible-quotes')).toBeAttached(attach))
		await step(expect(page.locator('#coins .coins-view-collapsible-ohlc')).toBeAttached(attach))
		await step(expect(page.locator('#coins .coins-view-collapsible-markets')).toBeAttached(attach))
		await step(expect(page.locator('#coins .coins-view-collapsible-deployments')).toBeAttached(attach))
		await step(expect(page.locator('#coins a[data-scroll-marker-label="Spot quote index"]').first()).toBeAttached(attach))
		await step(expect(page.locator('#coins [id="coins:prices-spot"] a[href*="/market/"]').first()).toBeAttached(attach))
		await step(expect(page.locator('#coins [id="coins:ohlc-candles-preview"]').getByText('OHLC', { exact: false }).first()).toBeAttached(attach))
		await step(expect(
			page.locator('#coins [id="coins:markets-index"] a[href*="/market/"]').first().or(
				page.locator('#coins [id="coins:markets-index"]').getByText('No markets in this context yet.'),
			),
		).toBeAttached(attach))
	})

	test('coin detail ETH renders markets and deployments', async ({ page }, testInfo) => {
		testInfo.setTimeout(180_000)
		const { step } = setupFailFast(page)

		await step(page.goto('/coin/ETH', { waitUntil: 'load', timeout: 120_000 }))

		await step(expect(page.locator('#coin-detail-page')).toBeAttached(attach))
		await step(expect(page.getByText('Not found')).toHaveCount(0))
		await step(expect(page.getByRole('heading', { name: '500' })).toHaveCount(0))

		await step(expect(page.locator('.coin-view-carousel-groups')).toBeAttached(attach))
		await step(expect(page.locator('.coin-view-collapsible-markets')).toBeAttached(attach))
		await step(expect(page.locator('.coin-view-collapsible-topology')).toBeAttached(attach))
		await step(expect(page.locator('.coin-view-collapsible-markets a[data-scroll-marker-label="USD market"]')).toBeAttached(attach))
		await step(expect(page.locator('.coin-view-collapsible-markets').getByRole('link', { name: 'Binance:ETH-USD' })).toBeAttached(attach))
		await step(expect(page.getByText('Topology', { exact: true })).toBeAttached(attach))
		await step(expect(page.locator('.coin-view-collapsible-topology')).toBeAttached(attach))
	})

	test('coin detail BTC renders markets boundary', async ({ page }, testInfo) => {
		testInfo.setTimeout(180_000)
		const { step } = setupFailFast(page)

		await step(page.goto('/coin/BTC', { waitUntil: 'load', timeout: 120_000 }))

		await step(expect(page.locator('#coin-detail-page')).toBeAttached(attach))
		await step(expect(page.locator('.coin-view-collapsible-markets')).toBeAttached(attach))
	})

	test('unknown coin shows not found', async ({ page }, testInfo) => {
		testInfo.setTimeout(60_000)
		const { step } = setupFailFast(page)

		await step(page.goto('/coin/UNKNOWN_COIN_XYZ', { waitUntil: 'load', timeout: 60_000 }))

		await step(expect(page.locator('#coin-not-found')).toBeVisible())
		await step(expect(page.getByRole('heading', { name: 'Not found' })).toBeVisible())
	})

	test('spot quotes index renders with market links', async ({ page }, testInfo) => {
		testInfo.setTimeout(180_000)
		const { step } = setupFailFast(page)

		await step(page.goto('/coins/prices', { waitUntil: 'load', timeout: 120_000 }))

		await step(expect(page.locator('#coin-prices-page')).toBeAttached(attach))
		await step(expect(page.getByText('Not found')).toHaveCount(0))
		await step(expect(page.locator('#coin-prices-page a[href*="/market/"]').first()).toBeAttached(attach))
	})

	test('ohlc candles index renders candle rows', async ({ page }, testInfo) => {
		testInfo.setTimeout(180_000)
		const { step } = setupFailFast(page)

		await step(page.goto('/coins/candles', { waitUntil: 'load', timeout: 120_000 }))

		await step(expect(page.locator('#coin-ohlc-candles-page')).toBeAttached(attach))
		await step(expect(page.getByText('Not found')).toHaveCount(0))
		await step(expect(page.locator('#coin-ohlc-candles-page').getByText('OHLC', { exact: false }).first()).toBeAttached(attach))
	})

	test('assets hub coins section exposes hub carousels', async ({ page }, testInfo) => {
		testInfo.setTimeout(180_000)
		const { step } = setupFailFast(page)

		await step(page.goto('/assets', { waitUntil: 'load', timeout: 120_000 }))

		await step(expect(page.locator('#coins')).toBeAttached(attach))
		await step(expect(page.locator('#coins .coins-view-collapsible-quotes')).toBeAttached(attach))
		await step(expect(page.locator('#coins .coins-view-collapsible-ohlc')).toBeAttached(attach))
		await step(expect(page.locator('#coins .coins-view-collapsible-markets')).toBeAttached(attach))
		await step(expect(page.locator('#coins .coins-view-collapsible-deployments')).toBeAttached(attach))
		await step(expect(page.locator('#coins a[data-scroll-marker-label="Spot quote index"]').first()).toBeAttached(attach))
	})

	test('navigation lists coin facet routes', async ({ page }, testInfo) => {
		testInfo.setTimeout(60_000)
		const { step } = setupFailFast(page)

		await step(page.goto('/coins', { waitUntil: 'load', timeout: 60_000 }))

		const nav = page.locator('#nav-menu')
		await step(expect(nav.getByRole('link', { name: 'Coins' })).toBeAttached())
		await step(expect(nav.getByRole('link', { name: 'Spot quotes' })).toBeAttached())
		await step(expect(nav.getByRole('link', { name: 'Candles' })).toBeAttached())
	})
})
