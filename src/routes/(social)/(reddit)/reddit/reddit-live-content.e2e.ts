import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../tests/_e2eBrowserHelpers.ts'
import {
	routeViewSmokeTimeoutsMs,
	setupRouteViewSmokePage,
} from '../../../../../tests/e2e/_routeViewDiagnostics.ts'
import { installRouteViewSqliteIsolation } from '../../../../../tests/e2e/_routeViewFixtures.ts'


test('Reddit popular submissions open meaningful live detail content', async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test * 2)
	page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
	const {
		diagnostics,
		flushArtifacts,
		step,
	} = setupRouteViewSmokePage(page)

	try {
		await installRouteViewSqliteIsolation(page, `blockhead-reddit-live-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`)
		await installChainlistRpcsJsonStub(page)
		await step(page.goto('/reddit/links', {
			waitUntil: 'load',
			timeout: routeViewSmokeTimeoutsMs.goto,
		}))
		await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics)
		await step(assertMainSettled(
			page,
			routeViewSmokeTimeoutsMs.mainSelector,
			diagnostics,
			{
				requiredText: ['Popular submissions'],
				minimumEntityRows: 1,
				minimumLinks: 1,
			}
		))

		const submissionLink = page.locator('#main a[href^="/reddit/link/"]').first()
		await step(expect(submissionLink).toBeVisible())
		await step(submissionLink.click())
		await step(expect(page).toHaveURL(/\/reddit\/link\/t3_[a-z0-9]+\/?$/i))
		await step(assertMainSettled(
			page,
			routeViewSmokeTimeoutsMs.mainSelector,
			diagnostics,
			{
				requiredDt: [
					'Submission ID',
					'Title',
				],
				minimumDt: 3,
				minimumLinks: 1,
			}
		))
		await step(expect(page.locator('#main [data-error]')).toHaveCount(0))
		await step(expect(page.locator('#main')).not.toContainText('[object Object]'))
	}
	catch (error) {
		await flushArtifacts(testInfo)
		throw error
	}
})
