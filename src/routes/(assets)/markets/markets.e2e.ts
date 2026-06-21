import { expect, test } from '@playwright/test'
import { stringify } from 'devalue'
import {
	expectMainVisible,
	setupPageRuntimeDiagnostics,
} from '../../../../tests/_e2eBrowserHelpers.ts'

const marketKeyEthUsdBinance = encodeURIComponent(
	stringify({
		$base: { kind: 'Coin', $coin: { coinId: 'ETH' } },
		$quote: { kind: 'Currency', $currency: { iso4217: 'USD' } },
		$marketVenue: { marketVenueId: 'Binance' },
		marketKind: 'Spot',
	})
)

const attach = { timeout: 120_000 }

test.describe('Markets routes', () => {
	test('markets list renders with market links', async ({ page }, testInfo) => {
		testInfo.setTimeout(180_000)
		const diagnostics = setupPageRuntimeDiagnostics(page)
		const { step } = diagnostics

		await step(page.goto('/markets', { waitUntil: 'load', timeout: 120_000 }))

		await expectMainVisible(page, 120_000, diagnostics)
		await step(expect(page.locator('#main [id$="not-found"]')).toHaveCount(0))
		await step(expect(page.locator('#main a[href*="/market/"]').first()).toBeAttached(attach))
	})

	test('market detail renders asset and pricing carousels with data', async ({ page }, testInfo) => {
		testInfo.setTimeout(180_000)
		const diagnostics = setupPageRuntimeDiagnostics(page)
		const { step } = diagnostics

		await step(page.goto(`/market/${marketKeyEthUsdBinance}`, {
			waitUntil: 'load',
			timeout: 120_000,
		}))

		await expectMainVisible(page, 120_000, diagnostics)
		await step(expect(page.locator('#main [id$="not-found"]')).toHaveCount(0))
		await step(expect(page.locator('#main [data-error]')).toHaveCount(0))

		await step(expect(page.locator('#main a[href="/coin/ETH"]').first()).toBeAttached(attach))
		await step(expect(page.locator('#main [data-column]').first()).toBeAttached(attach))
	})

	test('navigation lists markets at assets level', async ({ page }, testInfo) => {
		testInfo.setTimeout(60_000)
		const diagnostics = setupPageRuntimeDiagnostics(page)
		const { step } = diagnostics

		await step(page.goto('/markets', { waitUntil: 'load', timeout: 60_000 }))
		await expectMainVisible(page, 60_000, diagnostics)

		const nav = page.locator('#nav-menu')
		await step(expect(nav.locator('a[href="/markets"]')).toBeAttached())
		await step(expect(nav.locator('a[href="/coins"]')).toBeAttached())
	})
})
