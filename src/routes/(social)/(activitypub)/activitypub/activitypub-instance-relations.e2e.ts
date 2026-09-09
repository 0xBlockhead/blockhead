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
import bindings from '$/sources/Mastodon/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceTargetKind,
	sourceBindingId,
} from '$/sources/SourceBinding.ts'
import { installRouteViewSqliteIsolation } from '../../../../../tests/e2e/_routeViewFixtures.ts'


const mastodonPublicTimelineBinding = bindings[Source.Mastodon_Rest].find(({ target }) => (
	target.kind === SourceTargetKind.Feed
))
if (mastodonPublicTimelineBinding == null)
	throw new Error('ActivityPub hub fixture requires the Mastodon public timeline binding')

const mastodonSocialBinding = bindings[Source.Mastodon_Rest].find(({ target }) => (
	target.kind === SourceTargetKind.Global
	&& target.key === 'mastodon-instance:https://mastodon.social'
))
if (mastodonSocialBinding == null)
	throw new Error('ActivityPub hub fixture requires the mastodon.social instance binding')

const mastodonPublicTimelineProxyRoute = new RegExp(
	`/api-proxy/${encodeURIComponent(sourceBindingId(mastodonPublicTimelineBinding))}/0/`
)
const mastodonSocialProxyRoute = new RegExp(
	`/api-proxy/${encodeURIComponent(sourceBindingId(mastodonSocialBinding))}/0/`
)


test('ActivityPub hub renders settled directory and observation-owned instances', async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test)
	page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
	const {
		diagnostics,
		flushArtifacts,
		step,
	} = setupRouteViewSmokePage(page)

	try {
		await installRouteViewSqliteIsolation(page, `blockhead-activitypub-hub-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`)
		await installChainlistRpcsJsonStub(page)
		await page.route(mastodonPublicTimelineProxyRoute, async (route) => {
			const providerUrl = new URL(decodeURIComponent(
				new URL(route.request().url()).pathname.split('/').at(-1) ?? ''
			))
			expect(providerUrl.pathname).toBe('/api/v1/timelines/public')
			await route.fulfill({
				contentType: 'application/json',
				json: [],
			})
		})
		await page.route(mastodonSocialProxyRoute, async (route) => {
			const providerUrl = new URL(decodeURIComponent(
				new URL(route.request().url()).pathname.split('/').at(-1) ?? ''
			))
			expect(providerUrl.pathname).toBe('/api/v1/instance')
			await route.fulfill({
				contentType: 'application/json',
				json: {
					description: 'Deterministic ActivityPub hub fixture',
					title: 'Fixture Mastodon',
					version: '4.4.0',
				},
			})
		})
		await step(page.goto('/activitypub', {
			waitUntil: 'load',
			timeout: routeViewSmokeTimeoutsMs.goto,
		}))
		await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics)
		await step(expect(page.locator('#main [data-error]')).toHaveCount(0, {
			timeout: routeViewSmokeTimeoutsMs.mainSelector,
		}))
		await step(assertMainSettled(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics))
		const main = page.locator('#main')
		await step(expect(main).toContainText('global ActivityPub network'))
		await step(expect(main).toContainText('Directory'))
		await step(expect(main).toContainText('Observations'))
		await step(expect(main.locator('a[href="/activitypub/actors"]')).toHaveText('Accounts'))
		await step(expect(main).toContainText('No ActivityPub actors yet.'))
		await step(main.locator('a[data-scroll-marker-label="Notes"]').click())
		await step(expect(main.locator('a[href="/activitypub/notes"]')).toHaveText('Notes'))
		await step(expect(main).toContainText('No ActivityPub notes yet.'))
		await step(main.locator('a[data-scroll-marker-label="Instances"]').click())
		await step(expect(main.locator('a[href="/activitypub/instance/https%3A%2F%2Fmastodon.social"]')).toBeAttached())
		await step(expect(main.locator('a[href="/activitypub/instance/https%3A%2F%2Ffosstodon.org"]')).toBeAttached())
		await step(main.locator('a[data-scroll-marker-label="Observations"]').click())
		await step(expect(main).toContainText('Fixture Mastodon'))
		await step(expect(main).not.toContainText('No ActivityPub hub observations yet.'))
		await step(expect(main).not.toContainText('Internal Error'))
		await step(expect(main).not.toContainText('[object Object]'))
		await step(expect(main.getByText(/Loading\b/)).toHaveCount(0))
	}
	catch (e) {
		await flushArtifacts(testInfo)
		throw e
	}
})
