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
const postPath = `/atproto/post/${encodeURIComponent(postUri)}`


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


test('AT Protocol post renders fixture content, identity, and stable author navigation', async ({ page }, testInfo) => {
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
		expect(new URL(decodeURIComponent(new URL(route.request().url()).pathname.split('/').at(-1) ?? '')).searchParams.getAll('uris')).toEqual([postUri])
		await route.fulfill({
			contentType: 'application/json',
			json: {
				posts: [
					{
						author: {
							did: 'did:plc:journeyfixture',
							handle: 'journey.test',
						},
						cid: 'bafyfixturepost',
						indexedAt: '2026-07-15T18:01:00.000Z',
						record: {
							createdAt: '2026-07-15T18:00:00.000Z',
							langs: ['en'],
							text: 'Deterministic social journey content',
						},
						uri: postUri,
					},
				],
			},
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
		const authorLink = main.locator('a[href="/atproto/actor/did:plc:journeyfixture"]')
		await step(expect(authorLink).toBeAttached())
		await step(expect(main.locator('[data-error]')).toHaveCount(0))
		await step(expect(main).not.toContainText('[object Object]'))
		await step(expect(main).not.toContainText('{"posts"'))
		expect(directPublicApiRequests).toEqual([])

		await page.route('**/api-proxy/Atproto_Xrpc-*/0/**', async (route) => {
			expect(route.request().method()).toBe('GET')
			expect(new URL(decodeURIComponent(new URL(route.request().url()).pathname.split('/').at(-1) ?? '')).searchParams.getAll('actor')).toEqual(['did:plc:journeyfixture'])
			await route.fulfill({
				contentType: 'application/json',
				json: {
					did: 'did:plc:journeyfixture',
					displayName: 'Journey Fixture',
					handle: 'journey.test',
				},
			})
		})
		await step(authorLink.click())
		await step(expect(page).toHaveURL((url) => url.pathname === '/atproto/actor/did:plc:journeyfixture'))
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


test('AT Protocol post exposes provider failure instead of hanging or dumping wire data', async ({ page }, testInfo) => {
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
		expect(new URL(decodeURIComponent(new URL(route.request().url()).pathname.split('/').at(-1) ?? '')).searchParams.getAll('uris')).toEqual([postUri])
		await route.fulfill({
			contentType: 'application/json',
			json: { message: 'Fixture appview unavailable' },
			status: 503,
		})
	})

	try {
		await step(page.goto(postPath, {
			waitUntil: 'load',
			timeout: routeViewSmokeTimeoutsMs.goto,
		}))
		await step(expect(page).toHaveURL((url) => url.pathname === postPath))
		await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics)
		const main = page.locator('#main')
		await step(expect(main.locator('[data-error]').first()).toContainText('Fixture appview unavailable', {
			timeout: routeViewSmokeTimeoutsMs.mainSelector,
		}))
		await step(expect(main.getByText(/Loading\b/)).toHaveCount(0))
		await step(expect(main).not.toContainText('[object Object]'))
		await step(expect(main).not.toContainText('{"message"'))
		expect(directPublicApiRequests).toEqual([])
	}
	catch (error) {
		await flushArtifacts(testInfo)
		throw error
	}
})
