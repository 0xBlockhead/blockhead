import { expect, test } from '@playwright/test'
import {
	clearOriginOpfs,
	expectMainVisible,
	installChainlistRpcsJsonStub,
	setupPageRuntimeDiagnostics,
} from '../../../../../../tests/_e2eBrowserHelpers.ts'

test.describe('EVM network selection field boundaries', () => {
	test('network summary and first-layer subviews resolve through field resources', async ({ page }, testInfo) => {
		testInfo.setTimeout(240_000)
		const diagnostics = setupPageRuntimeDiagnostics(page)
		const { step } = diagnostics

		await installChainlistRpcsJsonStub(page)
		await step(page.goto('/', { waitUntil: 'domcontentloaded', timeout: 120_000 }))
		await clearOriginOpfs(page)
		await step(page.goto('/network/eip155:1', { waitUntil: 'load', timeout: 120_000 }))

		await expectMainVisible(page, 120_000, diagnostics)
		await step(expect(page.locator('#main [data-error]')).toHaveCount(0))
		await step(expect(page.locator('#network-summary-head-block')).toBeVisible({
			timeout: 120_000,
		}))
		await step(expect(
			page.locator('#network-summary-head-block a[href*="/block/"]')
				.or(page.locator('#network-summary-head-block span[data-text="muted"]'))
				.or(page.locator('#network-summary-head-block [data-tag][aria-label]'))
		).toBeAttached({
			timeout: 120_000,
		}))

		await step(expect(page.locator('.network-view-collapsible-assets')).toBeAttached({
			timeout: 120_000,
		}))
		await step(expect(page.locator('.network-view-collapsible-topology')).toBeAttached({
			timeout: 120_000,
		}))
		await step(expect(page.locator('.network-view-collapsible-execution')).toBeAttached({
			timeout: 120_000,
		}))
	})
})
