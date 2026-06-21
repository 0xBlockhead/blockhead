import { expect, test } from '@playwright/test'

import {
	expectMainVisible,
	setupPageRuntimeDiagnostics,
} from '../../../../../../../../../../tests/_e2eBrowserHelpers.ts'

test.describe('network contract detail', () => {
	test('mainnet ecrecover precompile resolves', async ({ page }, testInfo) => {
		testInfo.setTimeout(240_000)
		const diagnostics = setupPageRuntimeDiagnostics(page)
		const { step } = diagnostics

		await step(page.goto(
			'/network/eip155:1/contract/0x0000000000000000000000000000000000000001',
			{ waitUntil: 'load', timeout: 120_000 }
		))

		await expectMainVisible(page, 120_000, diagnostics)
		await step(expect(page.locator('#main [data-error]')).toHaveCount(0))
		await step(expect(page.locator('#main a[href*="/contract/0x0000000000000000000000000000000000000001"]').first()).toBeAttached({
			timeout: 120_000,
		}))
	})
})
