import { expect, test, type Page } from '@playwright/test'
import { stringify } from 'devalue'

const marketKeyEthUsdBinance = encodeURIComponent(
	stringify({
		$base: { kind: 'Coin', $coin: { coinId: 'ETH' } },
		$quote: { kind: 'Currency', $currency: { iso4217: 'USD' } },
		$marketVenue: { marketVenueId: 'Binance' },
		marketKind: 'Spot',
	})
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
		if (
			message.type() === 'error'
			&& !message.text().includes('Failed to load resource: the server responded with a status of 404')
			&& !message.text().includes('Failed to load resource: the server responded with a status of 422')
			&& !message.text().includes('Failed to load resource: the server responded with a status of 429')
			&& !message.text().includes('Failed to load resource: the server responded with a status of 500')
			&& !message.text().includes('Failed to load resource: the server responded with a status of 502')
			&& !message.text().includes('[vite] Failed to reload')
			&& !message.text().includes('Failed to fetch dynamically imported module')
			&& !message.text().includes('Failed to load resource: net::ERR_FAILED')
			&& !message.text().includes('has been blocked by CORS policy')
			&& !(
				message.text().includes('[QueryCollection]')
				&& (
					/resolver\(s\) failed/.test(message.text())
					|| /Fetch failed \(\d{3}/.test(message.text())
				)
			)
		) failFast(new Error(`console.error: ${message.text()}`))
	})

	return { step }
}

const attach = { timeout: 120_000 }

test.describe('Markets routes', () => {
	test('markets list renders with market links', async ({ page }, testInfo) => {
		testInfo.setTimeout(180_000)
		const { step } = setupFailFast(page)

		await step(page.goto('/markets', { waitUntil: 'load', timeout: 120_000 }))

		await step(expect(page.locator('#main')).toBeVisible({ timeout: 120_000 }))
		await step(expect(page.locator('#main [id$="not-found"]')).toHaveCount(0))
		await step(expect(page.locator('#main a[href*="/market/"]').first()).toBeAttached(attach))
	})

	test('market detail renders asset and pricing carousels with data', async ({ page }, testInfo) => {
		testInfo.setTimeout(180_000)
		const { step } = setupFailFast(page)

		await step(page.goto(`/market/${marketKeyEthUsdBinance}`, {
			waitUntil: 'load',
			timeout: 120_000,
		}))

		await step(expect(page.locator('#main [id$="not-found"]')).toHaveCount(0))
		await step(expect(page.locator('#main [data-error]')).toHaveCount(0))

		await step(expect(page.locator('#main a[href="/coin/ETH"]').first()).toBeAttached(attach))
		await step(expect(page.locator('#main [data-column]').first()).toBeAttached(attach))
	})

	test('navigation lists markets at assets level', async ({ page }, testInfo) => {
		testInfo.setTimeout(60_000)
		const { step } = setupFailFast(page)

		await step(page.goto('/markets', { waitUntil: 'load', timeout: 60_000 }))

		const nav = page.locator('#nav-menu')
		await step(expect(nav.locator('a[href="/markets"]')).toBeAttached())
		await step(expect(nav.locator('a[href="/coins"]')).toBeAttached())
	})
})
