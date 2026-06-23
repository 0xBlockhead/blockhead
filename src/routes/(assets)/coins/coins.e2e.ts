import { expect, test } from '@playwright/test'

import {
	expectMainVisible,
	setupPageRuntimeDiagnostics,
} from '../../../../tests/_e2eBrowserHelpers.ts'

const attach = { timeout: 120_000 } as const

test.describe('/coins routes', () => {
	test.describe.configure({ timeout: 180_000 })

	test('coins list renders catalog with closed heavy hubs', async ({ page }, testInfo) => {
		testInfo.setTimeout(180_000)
		const diagnostics = setupPageRuntimeDiagnostics(page)
		const { step } = diagnostics

		await step(page.goto('/coins', { waitUntil: 'load', timeout: 120_000 }))

		await expectMainVisible(page, 120_000, diagnostics)
		await step(expect(page.locator('#coins')).toBeAttached(attach))
		await step(expect(page.locator('#main [id$="not-found"]')).toHaveCount(0))
		await step(expect(page.locator('#main [data-error]')).toHaveCount(0))

		await step(expect(page.locator('#coins article').first()).toBeAttached(attach))
	})

	test('coin detail ETH renders markets and deployments', async ({ page }, testInfo) => {
		testInfo.setTimeout(180_000)
		const diagnostics = setupPageRuntimeDiagnostics(page)
		const { step } = diagnostics

		await step(page.goto('/coin/ETH', { waitUntil: 'load', timeout: 120_000 }))

		await expectMainVisible(page, 120_000, diagnostics)
		await step(expect(page.locator('#coin-detail-page')).toBeAttached(attach))
		await step(expect(page.locator('#main [id$="not-found"]')).toHaveCount(0))
		await step(expect(page.locator('#main [data-error]')).toHaveCount(0))
	})

	test('coin detail BTC renders markets boundary', async ({ page }, testInfo) => {
		testInfo.setTimeout(180_000)
		const diagnostics = setupPageRuntimeDiagnostics(page)
		const { step } = diagnostics

		await step(page.goto('/coin/BTC', { waitUntil: 'load', timeout: 120_000 }))

		await expectMainVisible(page, 120_000, diagnostics)
		await step(expect(page.locator('#coin-detail-page')).toBeAttached(attach))
		await step(expect(page.locator('#main [id$="not-found"]')).toHaveCount(0))
		await step(expect(page.locator('#main [data-error]')).toHaveCount(0))
	})

	test('unknown coin shows not found', async ({ page }, testInfo) => {
		testInfo.setTimeout(60_000)
		const diagnostics = setupPageRuntimeDiagnostics(page)
		const { step } = diagnostics

		await step(page.goto('/coin/UNKNOWN_COIN_XYZ', { waitUntil: 'load', timeout: 60_000 }))

		await expectMainVisible(page, 60_000, diagnostics)
		await step(expect(page.locator('#coin-not-found')).toBeVisible())
	})

	test('spot quotes index renders with market links', async ({ page }, testInfo) => {
		testInfo.setTimeout(180_000)
		const diagnostics = setupPageRuntimeDiagnostics(page)
		const { step } = diagnostics

		await step(page.goto('/coins/prices', { waitUntil: 'load', timeout: 120_000 }))

		await expectMainVisible(page, 120_000, diagnostics)
		await step(expect(page.locator('#coin-prices-page')).toBeAttached(attach))
		await step(expect(page.locator('#main [id$="not-found"]')).toHaveCount(0))
		await step(expect(page.locator('#main [data-error]')).toHaveCount(0))
	})

	test('ohlc candles index renders candle rows', async ({ page }, testInfo) => {
		testInfo.setTimeout(180_000)
		const diagnostics = setupPageRuntimeDiagnostics(page)
		const { step } = diagnostics

		await step(page.goto('/coins/candles', { waitUntil: 'load', timeout: 120_000 }))

		await expectMainVisible(page, 120_000, diagnostics)
		await step(expect(page.locator('#coin-ohlc-candles-page')).toBeAttached(attach))
		await step(expect(page.locator('#main [id$="not-found"]')).toHaveCount(0))
		await step(expect(page.locator('#coin-ohlc-candles-page [data-column]').first()).toBeAttached(attach))
	})

	test('assets hub coins section exposes hub carousels', async ({ page }, testInfo) => {
		testInfo.setTimeout(180_000)
		const diagnostics = setupPageRuntimeDiagnostics(page)
		const { step } = diagnostics

		await step(page.goto('/assets', { waitUntil: 'load', timeout: 120_000 }))

		await expectMainVisible(page, 120_000, diagnostics)
		await step(expect(page.locator('#coins')).toBeAttached(attach))
		await step(expect(page.locator('#main [id$="not-found"]')).toHaveCount(0))
		await step(expect(page.locator('#main [data-error]')).toHaveCount(0))
		await step(expect(page.locator('#coins article').first()).toBeAttached(attach))
	})

	test('navigation lists coin facet routes', async ({ page }, testInfo) => {
		testInfo.setTimeout(60_000)
		const diagnostics = setupPageRuntimeDiagnostics(page)
		const { step } = diagnostics

		await step(page.goto('/coins', { waitUntil: 'load', timeout: 60_000 }))

		await expectMainVisible(page, 60_000, diagnostics)
		const nav = page.locator('#nav-menu')
		await step(expect(nav.locator('a[href="/coins"]')).toBeAttached())
		await step(expect(nav.locator('a[href="/coins/prices"]')).toBeAttached())
		await step(expect(nav.locator('a[href="/coins/candles"]')).toBeAttached())
	})
})
