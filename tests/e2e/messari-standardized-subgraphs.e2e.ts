import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	expectMainVisible,
	installChainlistRpcsJsonStub,
	setupPageRuntimeDiagnostics,
} from '../_e2eBrowserHelpers.ts'
import { messariStandardizedSubgraphRouteFixtures } from './_messariStandardizedSubgraphFixtures.ts'

test.describe('Messari standardized subgraph native routes', () => {
	for (const route of messariStandardizedSubgraphRouteFixtures) {
		test(`${route.name} exact observation visibly resolves`, async ({ page }, testInfo) => {
			testInfo.setTimeout(180_000)
			await installChainlistRpcsJsonStub(page)
			const diagnostics = setupPageRuntimeDiagnostics(page)
			await diagnostics.step(page.goto(route.pathname, {
				waitUntil: 'domcontentloaded',
				timeout: 120_000,
			}))
			await expectMainVisible(page, 120_000, diagnostics)
			await diagnostics.step(assertMainSettled(page, 120_000, diagnostics, {
				requiredText: [route.blockNumber, ...route.expected],
			}))
			const main = page.locator('#main')
			for (const expected of [route.blockNumber, ...route.expected])
				await expect(main, `missing resolved ${expected}`).toContainText(expected)
			await expect(main).not.toContainText('Failed to load')
			await expect(main).not.toContainText('Loading…')
			expect(diagnostics.issues, diagnostics.summary()).toEqual([])
			await page.screenshot({
				path: testInfo.outputPath(`${route.name}.png`),
				fullPage: true,
				animations: 'disabled',
			})
		})
	}
})
