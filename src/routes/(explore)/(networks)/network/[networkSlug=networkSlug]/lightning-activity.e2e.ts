import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	installChainlistRpcsJsonStub,
} from '../../../../../tests/_e2eBrowserHelpers.ts'

import {
	routeViewSmokeTimeoutsMs,
	setupRouteViewSmokePage,
} from '../../../../../tests/e2e/_routeViewDiagnostics.ts'


const routes = [
	{
		path: 'nodes',
		title: 'Nodes',
	},
	{
		path: 'channels',
		title: 'Channels',
	},
	{
		path: 'invoices',
		title: 'Invoices',
	},
	{
		path: 'payments',
		title: 'Payments',
	},
] as const


test.describe('/network/lightning activity routes', () => {
	test.describe.configure({ mode: 'serial' })

	for (const route of routes) {
		test(`lightning ${route.path} route renders`, async ({ page }, testInfo) => {
			testInfo.setTimeout(routeViewSmokeTimeoutsMs.test)
			page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
			await installChainlistRpcsJsonStub(page)

			const {
				step,
				flushArtifacts,
			} = setupRouteViewSmokePage(page)

			try {
				await step(page.goto(`/network/lightning/${route.path}`, {
					waitUntil: 'domcontentloaded',
					timeout: routeViewSmokeTimeoutsMs.goto,
				}))
				await step(expect(page.locator('#main')).toBeAttached({
					timeout: routeViewSmokeTimeoutsMs.mainSelector,
				}))
				await step(expect(page.getByRole('heading', { name: route.title }).first()).toBeAttached({
					timeout: routeViewSmokeTimeoutsMs.mainSelector,
				}))
				await step(expect(page.getByText('Internal Error')).toHaveCount(0))
				await step(expect(page.locator('#main').locator('[data-error]')).toHaveCount(0))
				await step(assertMainSettled(page, routeViewSmokeTimeoutsMs.mainSelector))
			}
			catch (error) {
				await flushArtifacts(testInfo)
				throw error
			}
		})
	}
})
