import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	collectBrowserCorsPolicyViolations,
	setupPageRuntimeDiagnostics,
} from '../_e2eBrowserHelpers.ts'


type AppGeneratedRouteCheck = {
	label: string
	path: string
	expectEntityRows?: boolean
	expectNotFound?: boolean
	skipSettle?: boolean
}

const attach = { timeout: 120_000 }

const YOUTUBE_PROBE_CHANNEL_ID = 'UC_x5XG1OV2P6uZZ5FSM9Ttw'
const MARKET_VENUE_ID = 'Binance'
const REDDIT_SUBREDDIT_NAME = 'ethereum'
const REDDIT_LINK_FULLNAME = 't3_1u8x2f8'
const YOUTUBE_PROBE_VIDEO_ID = 'jNQXAC9IVRw'
const YOUTUBE_PROBE_PLAYLIST_ID = 'UU_x5XG1OV2P6uZZ5FSM9Ttw'
const YOUTUBE_PROBE_COMMENT_ID = 'UgwV0D4jk9iI3P3J3dp4AaABAg'
const PROPOSAL_REF = 'eip-1559'

const appGeneratedRoutes: AppGeneratedRouteCheck[] = [
	{ label: 'market-venues list', path: '/market-venues', expectEntityRows: true },
	{ label: 'markets list', path: '/markets', expectEntityRows: false },
	{ label: 'market venue detail', path: `/market-venue/${MARKET_VENUE_ID}`, expectEntityRows: false },
	{
		label: 'market detail (venue route)',
		path: '/venue/Binance/market/coin/ETH/currency/USD/Spot',
		expectEntityRows: false,
	},
	{ label: 'evm-networks list', path: '/evm-networks', expectEntityRows: false, skipSettle: true },
	{ label: 'networks list', path: '/networks', expectEntityRows: false },
	{ label: 'network detail', path: '/network/ethereum', expectEntityRows: false },
	{ label: 'reddit hub', path: '/reddit', expectEntityRows: false, skipSettle: true },
	{ label: 'reddit subreddits list', path: '/reddit/subreddits', expectEntityRows: true },
	{ label: 'reddit links list', path: '/reddit/links', expectEntityRows: true },
	{ label: 'reddit subreddit detail', path: `/reddit/r/${REDDIT_SUBREDDIT_NAME}`, expectEntityRows: false },
	{ label: 'reddit subreddit links', path: `/reddit/r/${REDDIT_SUBREDDIT_NAME}/links`, expectEntityRows: true },
	{ label: 'reddit link detail', path: `/reddit/link/${REDDIT_LINK_FULLNAME}`, expectEntityRows: false },
	{ label: 'reddit link comments', path: `/reddit/link/${REDDIT_LINK_FULLNAME}/comments`, expectEntityRows: true },
	{ label: 'reddit comment detail', path: '/reddit/comment/t1_osbo75d', expectEntityRows: false },
	{ label: 'youtube hub', path: '/youtube', expectEntityRows: false },
	{ label: 'youtube videos list', path: '/youtube/videos', expectEntityRows: true },
	{ label: 'youtube playlists list', path: '/youtube/playlists', expectEntityRows: true },
	{ label: 'youtube video detail', path: `/youtube/video/${YOUTUBE_PROBE_VIDEO_ID}`, expectEntityRows: false },
	{ label: 'youtube playlist detail', path: `/youtube/playlist/${YOUTUBE_PROBE_PLAYLIST_ID}`, expectEntityRows: false },
	{ label: 'youtube playlist videos', path: `/youtube/playlist/${YOUTUBE_PROBE_PLAYLIST_ID}/videos`, expectEntityRows: true },
	{ label: 'youtube channels list', path: '/youtube/channels', expectEntityRows: true },
	{ label: 'youtube channel detail', path: `/youtube/channel/${YOUTUBE_PROBE_CHANNEL_ID}`, expectEntityRows: false },
	{ label: 'youtube channel videos', path: `/youtube/channel/${YOUTUBE_PROBE_CHANNEL_ID}/videos`, expectEntityRows: false, skipSettle: true },
	{ label: 'youtube channel playlists', path: `/youtube/channel/${YOUTUBE_PROBE_CHANNEL_ID}/playlists`, expectEntityRows: false, skipSettle: true },
	{ label: 'youtube video comments', path: `/youtube/video/${YOUTUBE_PROBE_VIDEO_ID}/comments`, expectEntityRows: false, skipSettle: true },
	{ label: 'youtube comment detail', path: `/youtube/comment/${YOUTUBE_PROBE_VIDEO_ID}/${YOUTUBE_PROBE_COMMENT_ID}`, expectEntityRows: false, skipSettle: true },
	{ label: 'proposals hub', path: '/proposals', expectEntityRows: false },
	{ label: 'proposals realm', path: '/proposals/ethereum', expectEntityRows: false },
	{ label: 'proposals kind', path: '/proposals/ethereum/eip', expectEntityRows: false },
	{ label: 'proposals document', path: `/proposals/ethereum/eip/${PROPOSAL_REF}`, expectEntityRows: false, skipSettle: true },
]

const slopPatterns = [
	/\bEntityType\.Unknown\b/,
	/<title>\{'Entity'\}<\/title>/,
	/\bNo rows\b/,
	/\/venues\b/,
	/\$base.*\$quote.*\$marketVenue/,
	/devalue|EntityView-\{/,
]

const checkPageSlop = async (page: import('@playwright/test').Page) => (
	page.evaluate(() => ({
		html: document.documentElement.outerHTML.slice(0, 50_000),
		title: document.title,
		bodyText: document.body.textContent.replace(/\s+/g, ' ').trim().slice(0, 2_000),
		entityViewCount: document.querySelectorAll('.entity-view-summary, [class*="entity-view"]').length,
		plainLinkListCount: document.querySelectorAll('#main ul:not(:has(.entity-view-summary)) > li > a:only-child').length,
		notFoundCount: document.querySelectorAll('#main [id$="not-found"]').length,
		errorCount: document.querySelectorAll('#main [data-error]').length,
	}))
)

test.describe('APP-generated routes spot check', () => {
	test.describe.configure({ mode: 'serial' })

	for (const route of appGeneratedRoutes) {
		test(`${route.label}: ${route.path}`, async ({ page }, testInfo) => {
			testInfo.setTimeout(180_000)
			const corsViolations = collectBrowserCorsPolicyViolations(page)
			const diagnostics = setupPageRuntimeDiagnostics(page, {
				failFast: false,
				ignoreTransientDevLoad: true,
			})
			const { step } = diagnostics

			await step(page.goto(route.path, {
				waitUntil: 'load',
				timeout: 120_000,
			}))

			await step(expect(page.locator('#main')).toBeVisible(attach))

			if (!route.skipSettle)
				await step(assertMainSettled(page, 120_000, diagnostics))

			await step(page.waitForTimeout(2_000))

			const slop = await checkPageSlop(page)
			const slopHits = slopPatterns.filter((pattern) => (
				pattern.test(slop.html)
				|| pattern.test(slop.title)
				|| pattern.test(slop.bodyText)
			))

			if (route.expectNotFound !== true) {
				await step(expect(page.locator('#main [id$="not-found"]')).toHaveCount(0))
				await step(expect(page.locator('#main [data-error]')).toHaveCount(0))
			}

			if (route.expectEntityRows)
				await step(expect(page.locator('#main .entity-view-summary').first()).toBeAttached(attach))

			expect(
				slopHits.map((pattern) => pattern.toString()),
				`${route.path} slop markers in DOM/title`
			).toEqual([])

			expect(
				corsViolations,
				`${route.path} CORS console violations`
			).toEqual([])

			const issues = diagnostics.issues.filter((issue) => (
				!issue.includes('Failed to load resource')
				&& !issue.includes('404')
				&& !issue.includes('failed every requested source')
			))
			expect(
				issues,
				`${route.path} runtime issues:\n${diagnostics.summary()}`
			).toEqual([])

			await testInfo.attach(`${route.label}-snapshot`, {
				body: JSON.stringify({
					path: route.path,
					finalUrl: page.url(),
					title: slop.title,
					entityViewCount: slop.entityViewCount,
					bodyTextPreview: slop.bodyText.slice(0, 500),
					consoleIssues: issues,
					corsViolations,
				}, null, 2),
				contentType: 'application/json',
			})
		})
	}
})
