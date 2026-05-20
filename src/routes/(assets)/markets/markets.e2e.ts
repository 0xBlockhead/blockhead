import { expect, test, type Page } from '@playwright/test'
import { stringify } from 'devalue'

const marketKeyEthUsdBinance = encodeURIComponent(
	stringify({
		$base: { kind: 'Coin', $coin: { coinId: 'ETH' } },
		$quote: { kind: 'Currency', $currency: { iso4217: 'USD' } },
		$marketVenue: { marketVenueId: 'Binance' },
		marketKind: 'Spot',
	}),
)

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
		if (message.type() === 'error') {
			failFast(new Error(`console.error: ${message.text()}`))
		}
	})

	return { step }
}

const attach = { timeout: 120_000 }

test.describe('Markets routes', () => {
	test('markets list renders with market links', async ({ page }, testInfo) => {
		testInfo.setTimeout(180_000)
		const { step } = setupFailFast(page)

		await step(page.goto('/markets', { waitUntil: 'load', timeout: 120_000 }))

		await step(expect(page.getByRole('heading', { name: 'Markets' })).toBeVisible({ timeout: 120_000 }))
		await step(expect(page.getByText('Not found')).toHaveCount(0))
		await step(expect(page.locator('#main a[href*="/market/"]').first()).toBeAttached(attach))
	})

	test('market detail renders asset and pricing carousels with data', async ({ page }, testInfo) => {
		testInfo.setTimeout(180_000)
		const { step } = setupFailFast(page)

		await step(page.goto(`/market/${marketKeyEthUsdBinance}`, {
			waitUntil: 'load',
			timeout: 120_000,
		}))

		await step(expect(page.getByText('Not found')).toHaveCount(0))
		await step(expect(page.getByRole('heading', { name: '500' })).toHaveCount(0))

		await step(expect(page.locator('.market-view-carousel-groups')).toBeAttached(attach))
		await step(expect(page.locator('.market-view-collapsible-assets')).toBeAttached(attach))
		await step(expect(page.locator('.market-view-collapsible-pricing')).toBeAttached(attach))
		await step(expect(page.locator('#main').getByRole('heading', { name: 'Assets' })).toBeAttached(attach))
		await step(expect(page.locator('.market-view-collapsible-pricing').getByRole('heading', { name: 'Pricing' })).toBeAttached(attach))
		await step(expect(page.locator('.market-view-collapsible-pricing [data-scroll-marker-label="Spot"]')).toBeAttached(attach))
		await step(expect(page.locator('.market-view-collapsible-pricing [data-scroll-marker-label="OHLC"]')).toBeAttached(attach))
		await step(expect(page.locator('.market-view-collapsible-pricing a[href="/coin/ETH"]').first()).toBeAttached(attach))
		await step(expect(page.locator('.market-view-collapsible-pricing').getByText('OHLC', { exact: false }).first()).toBeAttached(attach))
	})

	test('navigation lists markets at assets level', async ({ page }, testInfo) => {
		testInfo.setTimeout(60_000)
		const { step } = setupFailFast(page)

		await step(page.goto('/markets', { waitUntil: 'load', timeout: 60_000 }))

		const nav = page.locator('#nav-menu')
		await step(expect(nav.getByRole('link', { name: 'Markets' })).toBeAttached())
		await step(expect(nav.getByRole('link', { name: 'Coins' })).toBeAttached())
	})
})
