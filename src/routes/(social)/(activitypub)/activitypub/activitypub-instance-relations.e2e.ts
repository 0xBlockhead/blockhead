import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	clearOriginOpfs,
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../tests/_e2eBrowserHelpers.ts'
import {
	routeViewSmokeTimeoutsMs,
	setupRouteViewSmokePage,
} from '../../../../../tests/e2e/_routeViewDiagnostics.ts'


test('ActivityPub hub renders instance peer and moderation choices', async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test)
	page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
	const {
		diagnostics,
		flushArtifacts,
		step,
	} = setupRouteViewSmokePage(page)

	try {
		await page.goto('/')
		await clearOriginOpfs(page)
		await installChainlistRpcsJsonStub(page)
		await step(page.goto('/activitypub', {
			waitUntil: 'load',
			timeout: routeViewSmokeTimeoutsMs.goto,
		}))
		await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics)
		await step(expect(page.locator('#main [data-error]')).toHaveCount(0, {
			timeout: routeViewSmokeTimeoutsMs.mainSelector,
		}))
		await step(assertMainSettled(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics))

		const peers = page.locator('[id="ActivityPubInstancePeersView-$$instancePeers"]')
		const moderatedDomains = page.locator('[id="ActivityPubInstanceModeratedDomainsView-$$instanceModeratedDomains"]')
		await step(expect(peers).toBeVisible())
		await step(expect(moderatedDomains).toBeVisible())
		await step(expect(peers.getByText('mastodon.social https://mastodon.social', { exact: true })).toBeVisible())
		await step(expect(peers.getByText('fosstodon.org https://mastodon.social', { exact: true })).toBeVisible())
		await step(expect(peers.getByText('mastodon.social https://fosstodon.org', { exact: true })).toBeVisible())
		await step(expect(peers.getByText('fosstodon.org https://fosstodon.org', { exact: true })).toBeVisible())
		await step(expect(moderatedDomains.getByText('blocked.example suspend E2E moderated domain https://mastodon.social', { exact: true })).toBeVisible())
		await step(expect(moderatedDomains.getByText('blocked.example suspend E2E moderated domain https://fosstodon.org', { exact: true })).toBeVisible())
	}
	catch (e) {
		await flushArtifacts(testInfo)
		throw e
	}
})
