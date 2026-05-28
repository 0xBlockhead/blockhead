import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	collectIssues,
	installChainlistRpcsJsonStub,
} from '../_e2eBrowserHelpers.ts'


test.describe('Evm block + transactions', () => {
	test('block page: Voltaire $$transactions field + UI list', async ({ page }) => {
		test.setTimeout(300_000)
		await installChainlistRpcsJsonStub(page)
		const issues = collectIssues(page)
		// Mainnet block 18_000_000: non-empty; RPC + new Voltaire field resolver populate the field collection.
		await page.goto('/network/eip155:1/block/18000000', { waitUntil: 'load' })
		await expect(page.locator('#main')).toBeVisible()
		await assertMainSettled(page)
		await expect(page.locator('#transactions')).toBeVisible()
		await expect(page.locator('#transactions a[href*="/tx/0x"]').first()).toBeAttached()
		expect(
			issues.filter((issue) => (
				!(
					issue.includes('https://eth.blockscout.com/api/v2/blocks/')
					&& (issue.includes('status of 404') || issue.includes('status of 422'))
				)
			)),
			issues.join('\n'),
		).toEqual([])
	})
})
