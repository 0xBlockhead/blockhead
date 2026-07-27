import { expect, test } from '@playwright/test'

import {
	expectMainVisible,
	installChainlistRpcsJsonStub,
	setupPageRuntimeDiagnostics,
} from '../_e2eBrowserHelpers.ts'


test.describe('Evm transaction call trace', () => {
	test('transaction page: trace tree or unavailable message', async ({ page }) => {
		test.setTimeout(300_000)
		await installChainlistRpcsJsonStub(page)
		const diagnostics = setupPageRuntimeDiagnostics(page)
		await page.goto(
			'/network/eip155:1/tx/0x16e199673891df518e25db2ef5320155da82a3dd71a677e7d84363251885d133',
			{ waitUntil: 'domcontentloaded' }
		)
		await expectMainVisible(page, 120_000, diagnostics)
		const traceCarousel = page.locator('[id$="-carousel-evm-tx-execution"]')
		await expect(traceCarousel).toBeAttached({ timeout: 120_000 })
		const traceSection = traceCarousel.locator('[id$=":evm-tx-traces"]')
		await expect(traceSection).toBeAttached({ timeout: 120_000 })
		await traceCarousel.getByRole('link', { name: 'Traces' }).click()
		await expect(
			traceSection.locator('ul[data-column]')
				.or(traceSection.locator('[data-resource-state="failed"]'))
				.or(traceSection.getByText('No traces.', { exact: true }))
		).toBeAttached({ timeout: 120_000 })
		expect(
			diagnostics.issues.filter((issue) => (
				!(
					issue.includes('https://eth.blockscout.com/api/v2/transactions/')
					&& (issue.includes('status of 404') || issue.includes('status of 422'))
				)
			)),
			diagnostics.issues.join('\n')
		).toEqual([])
	})
})
