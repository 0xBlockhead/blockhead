import { expect, test } from '@playwright/test'

import { e2eEvmExplorerRoutePaths } from '$/routes/api/e2e/assert-loaded-resolvers/_fixtures.ts'

import {
	assertMainSettled,
	expectMainVisible,
	setupPageRuntimeDiagnostics,
} from '../_e2eBrowserHelpers.ts'


test.describe('Evm calldata decoder', () => {
	test('decoder page: heading and calldata form', async ({ page }) => {
		test.setTimeout(300_000)
		const diagnostics = setupPageRuntimeDiagnostics(page)
		await page.goto(e2eEvmExplorerRoutePaths.calldataDecoder, { waitUntil: 'domcontentloaded' })
		await expectMainVisible(page, 120_000, diagnostics)
		await assertMainSettled(page, 120_000, diagnostics)
		await expect(page.locator('form.calldata-decoder-form')).toBeAttached()
		await expect(page.locator('form.calldata-decoder-form textarea')).toBeAttached()
		expect(diagnostics.issues).toEqual([])
	})
})
