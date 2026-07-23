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


const channelId = 'UC_x5XG1OV2P6uZZ5FSM9Ttw'
const videoId = 'jNQXAC9IVRw'
const youtubeCommentId = 'UgzuC3zzpRZkjc5Qzsd4AaABAg'
const videoPath = `/youtube/video/${videoId}`


test.beforeEach(async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test)
	page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-youtube-reading-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await installChainlistRpcsJsonStub(page)
})


test('YouTube video renders readable metadata and comment navigation through the proxy', async ({ page }, testInfo) => {
	const {
		diagnostics,
		flushArtifacts,
		step,
	} = setupRouteViewSmokePage(page)
	const directGoogleApiRequests: string[] = []
	const pipedRequests: string[] = []
	const unexpectedProviderRequests: string[] = []
	page.on('request', (request) => {
		if (request.url().startsWith('https://www.googleapis.com/youtube/v3/'))
			directGoogleApiRequests.push(request.url())
	})
	await page.route('**/api-proxy/Youtube_Rest-*/0/**', async (route) => {
		const providerUrl = new URL(decodeURIComponent(new URL(route.request().url()).pathname.split('/').at(-1) ?? ''))
		if (providerUrl.pathname.endsWith('/commentThreads')) {
			await route.fulfill({
				contentType: 'application/json',
				json: {
					items: [{
						id: providerUrl.searchParams.get('id'),
						snippet: {
							totalReplyCount: 0,
						},
					}],
				},
			})
			return
		}

		await route.fallback()
	})

	await page.route('https://api.piped.private.coffee/**', async (route) => {
		const providerUrl = new URL(route.request().url())
		expect(route.request().method()).toBe('GET')
		pipedRequests.push(providerUrl.pathname)

		if (providerUrl.pathname === `/streams/${videoId}`) {
			await route.fulfill({
				contentType: 'application/json',
				json: {
					description: 'A deterministic video description.',
					duration: 245,
					likes: 7,
					relatedStreams: [],
					thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
					title: 'Deterministic YouTube Journey',
					uploadDate: '2026-07-16T18:00:00.000Z',
					uploader: 'Journey Channel',
					uploaderUrl: `/channel/${channelId}`,
					views: 42,
				},
			})
			return
		}

		if (providerUrl.pathname === `/comments/${videoId}`) {
			await route.fulfill({
				contentType: 'application/json',
				json: {
					comments: [
						{
							author: 'Readable Commenter',
							commentId: 'comment-1',
							commentText: 'A useful fixture comment.',
							commentedTime: '2026-07-16T18:01:00.000Z',
							commentorUrl: '/channel/comment-author',
							likeCount: 1,
							thumbnail: 'https://yt3.ggpht.com/comment-author=s88-c-k-c0x00ffffff-no-rj',
						},
						{
							author: 'Blockhead commenter',
							commentId: youtubeCommentId,
							commentText: 'YouTube comment fixture',
							commentedTime: '2024-01-01T00:00:00.000Z',
							likeCount: 1,
						},
					],
					disabled: false,
					nextpage: null,
				},
			})
			return
		}

		if (providerUrl.pathname === `/channel/${channelId}`) {
			await route.fulfill({
				contentType: 'application/json',
				json: {
					avatarUrl: 'https://yt3.ggpht.com/journey-channel=s800-c-k-c0x00ffffff-no-rj',
					description: 'A deterministic channel description.',
					id: channelId,
					name: 'Journey Channel',
					nextpage: null,
					relatedStreams: [],
					subscriberCount: 1000,
					tabs: [],
					verified: true,
				},
			})
			return
		}

		unexpectedProviderRequests.push(`Piped_Rest ${providerUrl.pathname}`)
		await route.fulfill({
			status: 501,
			contentType: 'application/json',
			json: {
				error: `Unexpected Piped_Rest operation: ${providerUrl.pathname}`,
			},
		})
	})
	try {
		await step(page.goto(videoPath, {
			waitUntil: 'load',
			timeout: routeViewSmokeTimeoutsMs.goto,
		}))
		await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics)
		await step(assertMainSettled(
			page,
			routeViewSmokeTimeoutsMs.mainSelector,
			diagnostics,
			{
				requiredText: [
					'Me at the zoo',
					'A deterministic video description.',
					'Google for Developers',
				],
				minimumLinks: 1,
			}
		))
		const main = page.locator('#main')
		await step(expect(main.locator(`a[href="/youtube/channel/${channelId}"]`)).toBeAttached())
		await step(expect(main.locator(`a[href="/youtube/comment/${videoId}/comment-1"]`)).toContainText('A useful fixture comment.', {
			timeout: routeViewSmokeTimeoutsMs.mainSelector,
		}))
		await step(expect(main.locator('[data-error]')).toHaveCount(0))
		await step(expect(main).not.toContainText('[object Object]'))
		await step(expect(main).not.toContainText('{"items"'))
		expect(directGoogleApiRequests).toEqual([])
		expect(unexpectedProviderRequests).toEqual([])
		expect(pipedRequests).toEqual(expect.arrayContaining([
			`/channel/${channelId}`,
			`/comments/${videoId}`,
			`/streams/${videoId}`,
		]))
	}
	catch (error) {
		await flushArtifacts(testInfo)
		throw error
	}
})
