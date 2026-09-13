import { expect, test, type Page } from '@playwright/test'

import {
	assertMainSettled,
	expectMainVisible,
	installChainlistRpcsJsonStub,
	setupPageRuntimeDiagnostics,
} from '../_e2eBrowserHelpers.ts'
import { messariStandardizedSubgraphRouteFixtures } from './_messariStandardizedSubgraphFixtures.ts'
import { messariGraphFixtureResponse } from './_messariGraphFixtureServer.ts'
import { installRouteViewSqliteIsolation } from './_routeViewFixtures.ts'

const installMessariGraphFixtures = async (page: Page) => {
	await page.route('**/api-proxy/**', async route => {
		if (route.request().method() !== 'POST') {
			await route.continue()
			return
		}
		let request: { query?: string; variables?: { protocolId?: string; block?: { hash?: string } } }
		try {
			request = route.request().postDataJSON()
		} catch {
			await route.continue()
			return
		}
		if (!request.query?.includes('MessariAmmFinancialsAtBlockHash')
			&& !request.query?.includes('MessariAmmFinancialsLatest')
			&& !request.query?.includes('MessariEvmBlockAtHash')) {
			await route.continue()
			return
		}
		const fixture = messariGraphFixtureResponse(request)
		if (fixture == null) {
			await route.fulfill({ status: 404, body: 'missing Messari fixture' })
			return
		}
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(fixture),
		})
	})
}

test.describe('Messari standardized subgraph native routes', () => {
	for (const route of messariStandardizedSubgraphRouteFixtures) {
		test(`${route.name} exact observation visibly resolves`, async ({ page }, testInfo) => {
			testInfo.setTimeout(180_000)
			await installRouteViewSqliteIsolation(page, `blockhead-messari-${route.name}-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`)
			await installChainlistRpcsJsonStub(page)
			await installMessariGraphFixtures(page)
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
