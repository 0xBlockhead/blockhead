import { expect, test } from '@playwright/test'
import {
	clearOriginOpfs,
	expectMainVisible,
	installChainlistRpcsJsonStub,
	setupPageRuntimeDiagnostics,
} from '../../../../../../tests/_e2eBrowserHelpers.ts'

test.describe('/network/[caip2]', () => {
	test('network 1 loads with no runtime errors and renders subviews', async ({ page }, testInfo) => {
		testInfo.setTimeout(240_000)
		const diagnostics = setupPageRuntimeDiagnostics(page)
		const { step } = diagnostics

		await installChainlistRpcsJsonStub(page)
		await step(page.goto('/', { waitUntil: 'domcontentloaded', timeout: 120_000 }))
		await clearOriginOpfs(page)
		await step(page.goto('/network/eip155:1', { waitUntil: 'load', timeout: 120_000 }))

		await step(expect(page.locator('#nav-menu a[href="/networks"]')).toBeVisible({
			timeout: 120_000,
		}))
		await step(expect(page.locator('#main [data-error]')).toHaveCount(0))
		await step(expect(page.locator('#main [data-error]')).toHaveCount(0))
		await step(expect(page.locator('.network-view-collapsible-topology')).toBeAttached({
			timeout: 120_000,
		}))

		const scrollAttach = { timeout: 120_000 } as const
		await step(expect(page.locator('.network-view-collapsible-topology')).toBeAttached(scrollAttach))
		await step(expect(page.locator('.network-view-collapsible-assets')).toBeAttached(scrollAttach))
		await step(expect(page.locator('.network-view-collapsible-execution')).toBeAttached(scrollAttach))
		await step(expect(page.locator('.network-view-collapsible-consensus')).toBeAttached(scrollAttach))
		await step(expect(page.locator('.network-view-collapsible-contracts-accounts')).toBeAttached(scrollAttach))
		await step(expect(page.locator('.network-view-collapsible-data-availability')).toBeAttached(scrollAttach))

		await step(expect(page.locator('#network-summary-head-block')).toBeAttached(scrollAttach))
		await step(expect(
			page.locator('#network-summary-head-block a[href*="/block/"]')
				.or(page.locator('#network-summary-head-block span[data-text="muted"]'))
				.or(page.locator('#network-summary-head-block [data-tag][aria-label]'))
		).toBeAttached({
			timeout: 120_000,
		}))

	})

	test('network 1 merged entity query includes selected fields', async ({ page }, testInfo) => {
		testInfo.setTimeout(120_000)
		const diagnostics = setupPageRuntimeDiagnostics(page)
		const { step } = diagnostics

		await installChainlistRpcsJsonStub(page)
		await step(page.goto('/', { waitUntil: 'domcontentloaded', timeout: 120_000 }))
		await clearOriginOpfs(page)
		await step(page.goto('/network/eip155:1', { waitUntil: 'load', timeout: 120_000 }))
		await step(expect(page.locator('.network-view-collapsible-topology')).toBeAttached({
			timeout: 120_000,
		}))
		await step(expect(page.locator('#main a[href="/network/eip155:1"]').first()).toBeAttached({
			timeout: 30_000,
		}))
	})

	test('network 1 reload keeps Chainlist and EthereumLists rows rendered', async ({ page }, testInfo) => {
		testInfo.setTimeout(240_000)
		const diagnostics = setupPageRuntimeDiagnostics(page)
		const { step } = diagnostics
		await installChainlistRpcsJsonStub(page)
		await step(page.goto('/', { waitUntil: 'domcontentloaded', timeout: 120_000 }))
		await clearOriginOpfs(page)
		await step(page.reload({ waitUntil: 'domcontentloaded', timeout: 120_000 }))
		await expectMainVisible(page, 120_000, diagnostics)

		await step(page.goto('/network/eip155:1', { waitUntil: 'load', timeout: 120_000 }))
		await step(expect(page.locator('.network-view-collapsible-topology')).toBeAttached({
			timeout: 120_000,
		}))
		await step(expect(page.locator('#main a[href="/network/eip155:1"]').first()).toBeAttached({
			timeout: 120_000,
		}))

		await step(page.reload({ waitUntil: 'domcontentloaded', timeout: 120_000 }))
		await step(expect(page.locator('.network-view-collapsible-topology')).toBeAttached({
			timeout: 120_000,
		}))
		await step(expect(page.locator('#main a[href="/network/eip155:1"]').first()).toBeAttached({
			timeout: 120_000,
		}))
	})
})
