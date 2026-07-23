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


const postUri = 'at://did:plc:journeyfixture/app.bsky.feed.post/3fixture'
const parentPostUri = 'at://did:plc:journeyfixture/app.bsky.feed.post/2parent'
const replyPostUri = 'at://did:plc:journeyfixture/app.bsky.feed.post/4reply'
const postPath = `/atproto/post/${encodeURIComponent(postUri)}`
const actorPath = `/atproto/actor/${encodeURIComponent('did:plc:journeyfixture')}`
const postView = {
	author: {
		did: 'did:plc:journeyfixture',
		handle: 'journey.test',
	},
	cid: 'bafyfixturepost',
	indexedAt: '2026-07-15T18:01:00.000Z',
	record: {
		createdAt: '2026-07-15T18:00:00.000Z',
		langs: ['en'],
		reply: {
			parent: {
				uri: parentPostUri,
			},
			root: {
				uri: parentPostUri,
			},
		},
		text: 'Deterministic social journey content',
	},
	uri: postUri,
}
const parentPostView = {
	...postView,
	cid: 'bafyfixtureparent',
	record: {
		createdAt: '2026-07-15T17:59:00.000Z',
		langs: ['en'],
		text: 'Parent thread content',
	},
	uri: parentPostUri,
}
const replyPostView = {
	...postView,
	cid: 'bafyfixturereply',
	record: {
		createdAt: '2026-07-15T18:01:00.000Z',
		langs: ['en'],
		reply: {
			parent: {
				uri: postUri,
			},
			root: {
				uri: parentPostUri,
			},
		},
		text: 'Reply thread content',
	},
	uri: replyPostUri,
}
const providerUrlFromProxyRequest = (url: string) => {
	const proxyUrl = new URL(url)
	return new URL(decodeURIComponent(
		proxyUrl.pathname.split('/').slice(4).join('/') + proxyUrl.search
	))
}
const expectPostIdentity = (providerUrl: URL) => {
	if (providerUrl.pathname.endsWith('/app.bsky.feed.getPosts')) {
		expect(providerUrl.searchParams.getAll('uris')).toEqual([postUri])
		return
	}

	expect(providerUrl.pathname).toBe('/xrpc/app.bsky.feed.getPostThread')
	expect(providerUrl.searchParams.get('uri')).toBe(postUri)
}


test.beforeEach(async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test)
	page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-atproto-post-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await installChainlistRpcsJsonStub(page)
})


test('AT Protocol post renders fixture content, thread ordering, identity, and stable author navigation', async ({ page }, testInfo) => {
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

	await page.route('**/api-proxy/Atproto_Xrpc-*/0/**', async (route) => {
		expect(route.request().method()).toBe('GET')
		const providerUrl = providerUrlFromProxyRequest(route.request().url())
		if (providerUrl.pathname.endsWith('/app.bsky.actor.getProfile')) {
			expect(providerUrl.searchParams.getAll('actor')).toEqual(['did:plc:journeyfixture'])
			await route.fulfill({
				contentType: 'application/json',
				json: {
					did: 'did:plc:journeyfixture',
					displayName: 'Journey Fixture',
					handle: 'journey.test',
				},
			})
			return
		}
		if (providerUrl.pathname.endsWith('/app.bsky.feed.getAuthorFeed')) {
			expect(providerUrl.searchParams.get('actor')).toBe('did:plc:journeyfixture')
			await route.fulfill({
				contentType: 'application/json',
				json: {
					feed: [],
				},
			})
			return
		}
		if (providerUrl.pathname.endsWith('/com.atproto.identity.resolveHandle')) {
			expect(providerUrl.searchParams.get('handle')).toBe('journey.test')
			await route.fulfill({
				contentType: 'application/json',
				json: {
					did: 'did:plc:journeyfixture',
				},
			})
			return
		}

		expectPostIdentity(providerUrl)
		await route.fulfill({
			contentType: 'application/json',
			json: (
				providerUrl.pathname.endsWith('/app.bsky.feed.getPosts') ?
					{ posts: [postView] }
				:
					{
						thread: {
							parent: {
								post: parentPostView,
							},
							post: postView,
							replies: [{
								post: replyPostView,
							}],
						},
					}
			),
		})
	})

	try {
		await step(page.goto(postPath, {
			waitUntil: 'load',
			timeout: routeViewSmokeTimeoutsMs.goto,
		}))
		await step(expect(page).toHaveURL((url) => url.pathname === postPath))
		await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics)
		await step(assertMainSettled(
			page,
			routeViewSmokeTimeoutsMs.mainSelector,
			diagnostics,
			{
				requiredDt: [
					'AT URI',
					'Author',
				],
				requiredText: ['Deterministic social journey content'],
				minimumLinks: 2,
			}
		))
		const main = page.locator('#main')
		const authorLink = main.locator(`a[href="${actorPath}"]`)
		await step(expect(authorLink).toBeAttached())
		const threadRows = main.locator('#AtprotoPostsView-thread li')
		await step(expect(threadRows).toHaveCount(2))
		await step(expect(threadRows.nth(0)).toContainText('Parent thread content'))
		await step(expect(threadRows.nth(1)).toContainText('Reply thread content'))
		await step(expect(main.locator('[data-error]')).toHaveCount(0))
		await step(expect(main).not.toContainText('[object Object]'))
		await step(expect(main).not.toContainText('{"posts"'))
		expect(directPublicApiRequests).toEqual([])

		await step(authorLink.click())
		await step(expect(page).toHaveURL((url) => url.pathname === actorPath))
		await step(assertMainSettled(
			page,
			routeViewSmokeTimeoutsMs.mainSelector,
			diagnostics,
			{
				requiredDt: [
					'Handle',
					'DID',
				],
				requiredText: [
					'Journey Fixture',
					'journey.test',
				],
			}
		))
		expect(directPublicApiRequests).toEqual([])
	}
	catch (error) {
		await flushArtifacts(testInfo)
		throw error
	}
})


test('AT Protocol canonical handle redirect resolves once to the DID actor route', async ({ page }, testInfo) => {
	const {
		diagnostics,
		flushArtifacts,
		step,
	} = setupRouteViewSmokePage(page)
	let handleResolutionCount = 0

	await page.route('**/api-proxy/Atproto_Xrpc-*/0/**', async (route) => {
		const providerUrl = providerUrlFromProxyRequest(route.request().url())
		if (providerUrl.pathname.endsWith('/com.atproto.identity.resolveHandle')) {
			handleResolutionCount++
			expect(providerUrl.searchParams.get('handle')).toBe('journey.test')
			await route.fulfill({
				contentType: 'application/json',
				json: {
					did: 'did:plc:journeyfixture',
				},
			})
			return
		}
		if (providerUrl.pathname.endsWith('/app.bsky.actor.getProfile')) {
			expect(providerUrl.searchParams.get('actor')).toBe('did:plc:journeyfixture')
			await route.fulfill({
				contentType: 'application/json',
				json: {
					did: 'did:plc:journeyfixture',
					displayName: 'Journey Fixture',
					handle: 'journey.test',
				},
			})
			return
		}
		if (providerUrl.pathname.endsWith('/app.bsky.feed.getAuthorFeed')) {
			expect(providerUrl.searchParams.get('actor')).toBe('did:plc:journeyfixture')
			await route.fulfill({
				contentType: 'application/json',
				json: {
					feed: [],
				},
			})
			return
		}

		throw new Error(`Unexpected ATProto request ${providerUrl}`)
	})

	try {
		await step(page.goto('/atproto/actor/handle/journey.test', {
			waitUntil: 'load',
			timeout: routeViewSmokeTimeoutsMs.goto,
		}))
		await step(expect(page).toHaveURL((url) => url.pathname === actorPath))
		await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics)
		await step(assertMainSettled(
			page,
			routeViewSmokeTimeoutsMs.mainSelector,
			diagnostics,
			{
				requiredText: [
					'Journey Fixture',
					'journey.test',
				],
			}
		))
		expect(handleResolutionCount).toBe(1)
	}
	catch (error) {
		await flushArtifacts(testInfo)
		throw error
	}
})


test('AT Protocol post exposes provider failure instead of hanging or dumping wire data', async ({ page }) => {
	const directPublicApiRequests: string[] = []
	page.on('request', (request) => {
		if (request.url().startsWith('https://public.api.bsky.app/'))
			directPublicApiRequests.push(request.url())
	})

	await page.route('**/api-proxy/Atproto_Xrpc-*/0/**', async (route) => {
		expect(route.request().method()).toBe('GET')
		const providerUrl = providerUrlFromProxyRequest(route.request().url())
		expectPostIdentity(providerUrl)
		await route.fulfill({
			contentType: 'application/json',
			json: { message: 'Fixture appview unavailable' },
			status: 503,
		})
	})

	await page.goto(postPath, {
		waitUntil: 'load',
		timeout: routeViewSmokeTimeoutsMs.goto,
	})
	await expect(page).toHaveURL((url) => url.pathname === postPath)
	const main = page.locator('#main')
	await expect(main).toBeVisible({ timeout: routeViewSmokeTimeoutsMs.mainSelector })
	await expect(main.locator('[data-error]').first()).toContainText('Fixture appview unavailable', {
		timeout: routeViewSmokeTimeoutsMs.mainSelector,
	})
	await expect(main.getByText(/Loading\b/)).toHaveCount(0)
	await expect(main).not.toContainText('[object Object]')
	await expect(main).not.toContainText('{"message"')
	expect(directPublicApiRequests).toEqual([])
})
