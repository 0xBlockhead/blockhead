import { expect, test } from '@playwright/test'

import {
	e2eEvmExplorerRoutePaths,
	SAMPLE_TX_HASH,
} from '$/routes/api/e2e/assert-loaded-resolvers/_fixtures.ts'

import {
	collectIssues,
	installChainlistRpcsJsonStub,
} from '../_e2eBrowserHelpers.ts'


test.describe('Evm transaction logs', () => {
	test('transaction page: logs carousel heading', async ({ page }) => {
		test.setTimeout(300_000)
		await installChainlistRpcsJsonStub(page)
		const issues = collectIssues(page)
		await page.goto(e2eEvmExplorerRoutePaths.networkTransaction, { waitUntil: 'domcontentloaded' })
		await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
		const logsCarousel = page.locator(`[id="${SAMPLE_TX_HASH}:carousel-logs"]`)
		await expect(logsCarousel).toBeAttached({ timeout: 120_000 })
		await expect(logsCarousel.getByText('Logs', { exact: true })).toBeAttached()
		await expect(page.locator(`[id="${SAMPLE_TX_HASH}:logs"]`)).toBeAttached({ timeout: 120_000 })
		expect(
			issues.filter((issue) => (
				!(
					issue.includes('https://eth.blockscout.com/api/v2/transactions/')
					&& (issue.includes('status of 404') || issue.includes('status of 422'))
				)
			)),
			issues.join('\n'),
		).toEqual([])
	})
})
