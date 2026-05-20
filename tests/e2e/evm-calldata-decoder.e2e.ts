import { expect, test } from '@playwright/test'

import { e2eEvmExplorerRoutePaths } from '$/routes/api/e2e/assert-loaded-resolvers/_fixtures.ts'

import {
	assertMainSettled,
	collectIssues,
} from '../_e2eBrowserHelpers.ts'


test.describe('Evm calldata decoder', () => {
	test('decoder page: heading and calldata form', async ({ page }) => {
		test.setTimeout(300_000)
		const issues = collectIssues(page)
		await page.goto(e2eEvmExplorerRoutePaths.calldataDecoder, { waitUntil: 'domcontentloaded' })
		await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
		await assertMainSettled(page)
		await expect(page.getByRole('heading', { name: 'Calldata decoder' })).toBeAttached()
		await expect(page.locator('form.calldata-decoder-form')).toBeAttached()
		await expect(page.getByLabel('Calldata (hex)')).toBeAttached()
		expect(issues).toEqual([])
	})
})
