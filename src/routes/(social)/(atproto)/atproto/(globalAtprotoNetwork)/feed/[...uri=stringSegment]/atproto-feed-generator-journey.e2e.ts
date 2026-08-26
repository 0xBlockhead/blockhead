import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../../../../tests/_e2eBrowserHelpers.ts'
import {
	routeViewSmokeTimeoutsMs,
	setupRouteViewSmokePage,
} from '../../../../../../../../tests/e2e/_routeViewDiagnostics.ts'
import bindings from '$/sources/AtprotoBsky/bindings.ts'
import socialBindings from '$/sources/AtprotoBskySocial/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'


const creatorDid = 'did:plc:journeyfixture'
const feedUri = `at://${creatorDid}/app.bsky.feed.generator/whats-hot`
const feedPath = `/atproto/feed/${encodeURIComponent(feedUri)}`
const creatorPath = `/atproto/actor/${encodeURIComponent(creatorDid)}`
const atprotoBskyProxyRoute = new RegExp(`/api-proxy/(?:${[
	sourceBindingId(bindings[Source.Atproto_Xrpc][0]),
	sourceBindingId(socialBindings[Source.Atproto_BskySocial_Xrpc][0]),
].map(encodeURIComponent).join('|')})/0/`)
const providerUrlFromProxyRequest = (url: string) => {
	const proxyUrl = new URL(url)
	return new URL(decodeURIComponent(
		proxyUrl.pathname.split('/').slice(4).join('/') + proxyUrl.search
	))
}


test.beforeEach(async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test)
	page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `bh-atproto-feed-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await installChainlistRpcsJsonStub(page)
})

test('AT Protocol feed generator renders exact appview identity and creator navigation', async ({ page }, testInfo) => {
	const {
		diagnostics,
		flushArtifacts,
		step,
	} = setupRouteViewSmokePage(page)
	const directPublicApiRequests: string[] = []
	page.on('request', (request) => {
		if (request.url().startsWith('https://public.api.bsky.app/'))
			directPublicApiRequests.push(request.url())
	})

	await page.route(atprotoBskyProxyRoute, async (route) => {
		expect(route.request().method()).toBe('GET')
		const providerUrl = providerUrlFromProxyRequest(route.request().url())
		if (providerUrl.pathname.endsWith('/app.bsky.feed.getFeedGenerator')) {
			expect(providerUrl.searchParams.getAll('feed')).toEqual([feedUri])
			await route.fulfill({
				contentType: 'application/json',
				json: {
					view: {
						uri: feedUri,
						cid: 'bafyreifeedfixture',
						did: 'did:web:feeds.example.com',
						creator: {
							did: creatorDid,
							handle: 'journey.test',
						},
						displayName: 'Journey What’s Hot',
						description: 'A deterministic feed-generator fixture.',
						likeCount: 12,
						acceptsInteractions: true,
						indexedAt: '2026-08-20T12:00:00.000Z',
					},
					isOnline: true,
					isValid: true,
				},
			})
			return
		}

		if (providerUrl.pathname.endsWith('/app.bsky.actor.getProfile')) {
			expect(providerUrl.searchParams.getAll('actor')).toEqual([creatorDid])
			await route.fulfill({
				contentType: 'application/json',
				json: {
					did: creatorDid,
					displayName: 'Journey Creator',
					handle: 'journey.test',
				},
			})
			return
		}

		throw new Error(`Unexpected ATProto request ${providerUrl}`)
	})

	try {
		await step(page.goto(feedPath, {
			waitUntil: 'load',
			timeout: routeViewSmokeTimeoutsMs.goto,
		}))
		await step(expect(page).toHaveURL((url) => url.pathname === feedPath))
		await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics)
		await step(assertMainSettled(
			page,
			routeViewSmokeTimeoutsMs.mainSelector,
			diagnostics,
			{
				requiredDt: [
					'AT URI',
					'Creator',
					'Service DID',
					'Declaration compatible',
				],
				requiredText: [
					'Journey What’s Hot',
					'A deterministic feed-generator fixture.',
				],
				minimumLinks: 1,
			}
		))
		const main = page.locator('#main')
		await step(expect(main.locator(`a[href="${creatorPath}"]`)).toBeAttached())
		await step(expect(main.locator('[data-error]')).toHaveCount(0))
		await step(expect(main).not.toContainText('[object Object]'))
		expect(directPublicApiRequests).toEqual([])
	}
	catch (error) {
		await flushArtifacts(testInfo)
		throw error
	}
})
