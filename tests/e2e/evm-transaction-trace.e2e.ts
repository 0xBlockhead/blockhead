import { expect, test } from '@playwright/test'

import {
	e2eEvmExplorerRoutePaths,
	SAMPLE_TX_HASH,
} from '$/routes/api/e2e/assert-loaded-resolvers/_fixtures.ts'

import {
	collectIssues,
	installChainlistRpcsJsonStub,
} from '../_e2eBrowserHelpers.ts'


test.describe('Evm transaction call trace', () => {
	test('transaction page: trace tree or unavailable message', async ({ page }) => {
		test.setTimeout(300_000)
		await installChainlistRpcsJsonStub(page)
		const issues = collectIssues(page)
		await page.goto(e2eEvmExplorerRoutePaths.networkTransaction, { waitUntil: 'domcontentloaded' })
		await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
		const traceCarousel = page.locator(`[id="${SAMPLE_TX_HASH}:carousel-trace"]`)
		await expect(traceCarousel).toBeAttached({ timeout: 120_000 })
		const traceSection = page.locator(`[id="${SAMPLE_TX_HASH}:trace"]`)
		await expect(traceSection).toBeAttached({ timeout: 120_000 })
		await expect(
			traceSection.locator('ul[data-column]')
				.or(traceSection.locator('[data-error]'))
		).toBeAttached({ timeout: 120_000 })
		expect(
			issues.filter((issue) => (
				!(
					issue.includes('https://eth.blockscout.com/api/v2/transactions/')
					&& (issue.includes('status of 404') || issue.includes('status of 422'))
				)
			)),
			issues.join('\n')
		).toEqual([])
	})
})
