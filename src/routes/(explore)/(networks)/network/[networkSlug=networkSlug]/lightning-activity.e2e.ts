import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../../tests/_e2eBrowserHelpers.ts'

import {
	routeViewSmokeTimeoutsMs,
	setupRouteViewSmokePage,
} from '../../../../../../tests/e2e/_routeViewDiagnostics.ts'


const routes = [
	'nodes',
	'channels',
	'invoices',
	'payments',
] as const


test.describe('/network/lightning activity routes', () => {
	test.describe.configure({ mode: 'serial' })

	for (const path of routes) {
		test(`lightning ${path} route renders`, async ({ page }, testInfo) => {
			testInfo.setTimeout(routeViewSmokeTimeoutsMs.test)
			page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
			await installChainlistRpcsJsonStub(page)

			const {
				diagnostics,
				step,
				flushArtifacts,
			} = setupRouteViewSmokePage(page)

			try {
				await step(page.goto(`/network/lightning/${path}`, {
					waitUntil: 'domcontentloaded',
					timeout: routeViewSmokeTimeoutsMs.goto,
				}))
				await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics)
				await step(expect(page.locator('#main [data-error]')).toHaveCount(0))
				await step(assertMainSettled(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics))
			}
			catch (error) {
				await flushArtifacts(testInfo)
				throw error
			}
		})
	}
})
