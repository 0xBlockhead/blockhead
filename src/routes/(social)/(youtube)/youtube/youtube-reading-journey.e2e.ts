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
import { installRouteViewSqliteIsolation } from '../../../../../tests/e2e/_routeViewFixtures.ts'


const channelId = 'UC_x5XG1OV2P6uZZ5FSM9Ttw'
const videoId = 'jNQXAC9IVRw'
const youtubeCommentId = 'UgzuC3zzpRZkjc5Qzsd4AaABAg'
const videoPath = `/youtube/video/${videoId}`


test.beforeEach(async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test)
	page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
	await installRouteViewSqliteIsolation(page, testInfo, 'youtube-reading')
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
	await page.route('**/api-proxy/**', async (route) => {
		const providerUrl = new URL(decodeURIComponent(new URL(route.request().url()).pathname.split('/').at(-1) ?? ''))
		if (providerUrl.pathname.endsWith('/commentThreads')) {
			await route.fulfill({
				contentType: 'application/json',
				json: {
					items: [{
						id: providerUrl.searchParams.get('id'),
						snippet: {
							totalReplyCount: 0,
							videoId,
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
					'Blockhead YouTube E2E',
				],
				minimumLinks: 1,
			}
		))
		const main = page.locator('#main')
		await step(expect(main.locator(`a[href="/youtube/channel/${channelId}"]`)).toBeAttached())
		await step(expect(main.locator(`a[href="/youtube/comment/${videoId}/comment-1"]`)).toContainText('A useful fixture comment.', {
			timeout: routeViewSmokeTimeoutsMs.mainSelector,
		}))
		await step(main.locator(`a[href="/youtube/comment/${videoId}/${youtubeCommentId}"]`).click())
		await step(expect(page).toHaveURL(`/youtube/comment/${videoId}/${youtubeCommentId}`))
		await step(expect(main).toContainText('YouTube comment fixture'))
		await step(expect(main).toContainText('Blockhead commenter'))
		await step(expect(main.locator(`a[href="${videoPath}"]`)).toBeAttached())
		await step(expect(main.locator('[data-error]')).toHaveCount(0))
		await step(expect(main.locator('[role="alert"]')).toHaveCount(0))
		await step(expect(main).not.toContainText('[object Object]'))
		await step(expect(main).not.toContainText('{"items"'))
		expect(directGoogleApiRequests).toEqual([])
		expect(unexpectedProviderRequests).toEqual([])
		expect(pipedRequests).toEqual(expect.arrayContaining([
			`/comments/${videoId}`,
			`/streams/${videoId}`,
		]))
	}
	catch (error) {
		await flushArtifacts(testInfo)
		throw error
	}
})
