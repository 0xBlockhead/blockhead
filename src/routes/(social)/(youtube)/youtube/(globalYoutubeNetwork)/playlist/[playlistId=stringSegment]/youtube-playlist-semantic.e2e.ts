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
import { installRouteViewSqliteIsolation } from '../../../../../../../../tests/e2e/_routeViewFixtures.ts'


const playlistId = 'PLdeterministicEmpty'
const playlistPath = `/youtube/playlist/${playlistId}`


test.beforeEach(async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test)
	page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
	await installRouteViewSqliteIsolation(page, `blockhead-youtube-playlist-semantic-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`)
	await installChainlistRpcsJsonStub(page)
})


test('valid-empty playlist stays empty without fabricating a video card', async ({ page }, testInfo) => {
	const {
		diagnostics,
		flushArtifacts,
		step,
	} = setupRouteViewSmokePage(page)
	const pipedRequests: string[] = []

	// Prohibited mutation: turning an empty relatedStreams collection into a fallback video.
	await page.route('https://api.piped.private.coffee/**', async (route) => {
		const providerUrl = new URL(route.request().url())
		pipedRequests.push(providerUrl.pathname)
		expect(route.request().method()).toBe('GET')

		if (providerUrl.pathname === `/playlists/${playlistId}`) {
			await route.fulfill({
				contentType: 'application/json',
				json: {
					name: 'Deterministic Empty Playlist',
					relatedStreams: [],
					uploader: 'Empty Playlist Channel',
					uploaderUrl: '/channel/UCemptyPlaylist',
					videos: 0,
				},
			})
			return
		}

		await route.fulfill({
			status: 501,
			contentType: 'application/json',
			json: {
				error: `Unexpected Piped playlist operation: ${providerUrl.pathname}`,
			},
		})
	})

	try {
		await step(page.goto(playlistPath, {
			waitUntil: 'load',
			timeout: routeViewSmokeTimeoutsMs.goto,
		}))
		await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics)
		await step(assertMainSettled(
			page,
			routeViewSmokeTimeoutsMs.mainSelector,
			diagnostics,
			{
				requiredText: ['Deterministic Empty Playlist', playlistId],
				minimumLinks: 0,
			}
		))
		const main = page.locator('#main')
		await step(expect(main.locator('a[href^="/youtube/video/"]')).toHaveCount(0))
		await step(expect(main.locator('a[href$="/videos"]')).toHaveCount(0))
		await step(expect(main.locator('[data-error]')).toHaveCount(0))
		await step(expect(main.locator('[role="alert"]')).toHaveCount(0))
		await step(expect(main).not.toContainText('[object Object]'))
		expect(pipedRequests).toEqual([`/playlists/${playlistId}`])
	}
	catch (error) {
		await flushArtifacts(testInfo)
		throw error
	}
})
