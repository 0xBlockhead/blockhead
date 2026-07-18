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


const notePath = '/activitypub/note/https%3A%2F%2Fmastodon.social/116539053870420123'


test('ActivityPub note renders syndication HTML as safe rich content', async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test)
	page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
	const {
		diagnostics,
		flushArtifacts,
		step,
	} = setupRouteViewSmokePage(page)

	try {
		await installChainlistRpcsJsonStub(page)
		await step(page.goto(notePath, {
			waitUntil: 'load',
			timeout: routeViewSmokeTimeoutsMs.goto,
		}))
		await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics)
		await step(assertMainSettled(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics))

		const main = page.locator('#main')
		await step(expect(main.locator('.markdown').first()).toBeVisible())
		await step(expect(main.locator('.markdown script, .markdown [onclick], .markdown [onerror], .markdown [href^="javascript:"], .markdown [src^="javascript:"], .markdown [href^="data:"], .markdown [src^="data:"]')).toHaveCount(0))
		await step(expect(main).not.toContainText('Internal Error'))
		await step(expect(main).not.toContainText('[object Object]'))
	}
	catch (error) {
		await flushArtifacts(testInfo)
		throw error
	}
})
