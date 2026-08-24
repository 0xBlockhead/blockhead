import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	expectMainVisible,
	installChainlistRpcsJsonStub,
	setupPageRuntimeDiagnostics,
} from '../_e2eBrowserHelpers.ts'


test.describe('Evm block + transactions', () => {
	test('block page: Voltaire $$transactions field + UI list', async ({ page }) => {
		test.setTimeout(300_000)
		await installChainlistRpcsJsonStub(page)
		const diagnostics = setupPageRuntimeDiagnostics(page)
		// Controlled retry defect route: native RPC block identity and transactions must settle.
		await page.goto('/network/eip155:1/block/20000000/transactions', { waitUntil: 'load' })
		await expectMainVisible(page, 120_000, diagnostics)
		await assertMainSettled(page, 120_000, diagnostics)
		await expect(page.locator('#transactions')).toBeVisible()
		await expect(page.locator('#transactions a[href*="/tx/0x"]').first()).toBeAttached()
		expect(
			diagnostics.issues.filter((issue) => (
				!(
					issue.includes('https://eth.blockscout.com/api/v2/blocks/')
					&& (issue.includes('status of 404') || issue.includes('status of 422'))
				)
			)),
			diagnostics.issues.join('\n')
		).toEqual([])
	})
})
