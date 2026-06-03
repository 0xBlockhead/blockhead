import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	installChainlistRpcsJsonStub,
} from '../../../../../../../tests/_e2eBrowserHelpers.ts'

import {
	routeViewSmokeTimeoutsMs,
	setupRouteViewSmokePage,
} from '../../../../../../../tests/e2e/_routeViewDiagnostics.ts'


test.describe('/network/[networkSlug]/governance', () => {
	test('cosmos renders governance proposals', async ({ page }, testInfo) => {
		testInfo.setTimeout(routeViewSmokeTimeoutsMs.test)
		page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
		await installChainlistRpcsJsonStub(page)

		const {
			step,
			flushArtifacts,
		} = setupRouteViewSmokePage(page)

		try {
			await step(page.goto('/network/cosmos/governance', {
				waitUntil: 'domcontentloaded',
				timeout: routeViewSmokeTimeoutsMs.goto,
			}))
			await step(expect(page.locator('#main')).toBeAttached({
				timeout: routeViewSmokeTimeoutsMs.mainSelector,
			}))
			await step(expect(page.getByRole('heading', { name: 'Governance' }).first()).toBeAttached({
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
})
