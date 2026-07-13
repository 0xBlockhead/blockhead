/**
 * Raw machine-payload / generated-route artifact gate.
 *
 * Curated spot checks (default): repair slices via E2E_APP_ROUTE_PATTERN / E2E_APP_ROUTE_LABEL_PATTERN.
 * Full matrix (E2E_FULL_MATRIX=1): every discovered `+page` from `_routeDiscovery.ts`.
 *
 * ```
 * PLAYWRIGHT_SKIP_WEBSERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:5173 pnpm exec playwright test tests/e2e/app-generated-routes.e2e.ts
 * E2E_FULL_MATRIX=1 PLAYWRIGHT_SKIP_WEBSERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:5173 pnpm exec playwright test tests/e2e/app-generated-routes.e2e.ts
 * E2E_APP_ROUTE_PATTERN='^/youtube' pnpm exec playwright test tests/e2e/app-generated-routes.e2e.ts
 * ```
 */
import { expect, test } from '@playwright/test'

import {
	assertNoGeneratedRouteArtifacts,
	assertCanonicalRouteUrl,
	assertMainSettled,
	e2eBrowserNewContextOptions,
	installChainlistRpcsJsonStub,
	snapshotGeneratedRouteArtifacts,
	collectBrowserCorsPolicyViolations,
	setupPageRuntimeDiagnostics,
} from '../_e2eBrowserHelpers.ts'

import { discoverFilteredPathnamesFromRoutes } from './_routeDiscovery.ts'


type AppGeneratedRouteCheck = {
	label: string
	path: string
	expectEntityRows?: boolean
	expectNotFound?: boolean
	expectedSectionLabels?: readonly string[]
	skipSettle?: boolean
}

const attach = { timeout: 120_000 }
const fullMatrix = process.env.E2E_FULL_MATRIX === '1'

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
	{ label: 'networks list', path: '/networks', expectEntityRows: false },
	{
		label: 'Ethereum network detail',
		path: '/network/eip155:1',
		expectEntityRows: false,
		expectedSectionLabels: [
			'Transactions',
			'Finality',
			'Blobs',
			'Precompiles',
			'Native assets',
			'Block explorers',
			'Settled rollups',
		],
	},
	{
		label: 'Bitcoin network detail',
		path: '/network/bitcoin',
		expectEntityRows: false,
		expectedSectionLabels: [
			'Blocks',
			'Transactions',
			'Mempool',
			'Native assets',
		],
	},
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

const appGeneratedRoutePattern = process.env.E2E_APP_ROUTE_PATTERN ?
	new RegExp(process.env.E2E_APP_ROUTE_PATTERN)
: undefined
const appGeneratedRouteLabelPattern = process.env.E2E_APP_ROUTE_LABEL_PATTERN ?
	new RegExp(process.env.E2E_APP_ROUTE_LABEL_PATTERN)
: undefined
const filteredAppGeneratedRoutes = appGeneratedRoutes.filter((route) => (
	(!appGeneratedRoutePattern || appGeneratedRoutePattern.test(route.path))
	&& (!appGeneratedRouteLabelPattern || appGeneratedRouteLabelPattern.test(route.label))
))

if (
	!fullMatrix
	&& (appGeneratedRoutePattern || appGeneratedRouteLabelPattern)
	&& filteredAppGeneratedRoutes.length === 0
)
	throw new Error('E2E app-generated route filters matched no routes')

const installRouteProbeDatabase = async (
	page: import('@playwright/test').Page,
	databaseName: string
) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: databaseName,
		schemaVersion: Date.now(),
	})
}

const visitRawDumpRoute = async (
	page: import('@playwright/test').Page,
	testInfo: import('@playwright/test').TestInfo,
	pathname: string,
	options?: {
		expectEntityRows?: boolean
		expectNotFound?: boolean
		expectedSectionLabels?: readonly string[]
		skipSettle?: boolean
		label?: string
	}
) => {
	const corsViolations = collectBrowserCorsPolicyViolations(page)
	const diagnostics = setupPageRuntimeDiagnostics(page, {
		failFast: false,
		ignoreTransientDevLoad: true,
	})
	const { step } = diagnostics

	await step(page.goto(pathname, {
		waitUntil: 'load',
		timeout: 120_000,
	}))

	await step(expect(page.locator('#main')).toBeVisible(attach))
	await step(assertCanonicalRouteUrl(page, pathname))

	if (!options?.skipSettle)
		await step(assertMainSettled(page, 120_000, diagnostics))

	await step(page.waitForTimeout(2_000))

	if (options?.expectNotFound !== true) {
		await step(expect(page.locator('#main [id$="not-found"]')).toHaveCount(0))
		await step(expect(page.locator('#main [data-error]')).toHaveCount(0))
	}

	if (options?.expectEntityRows)
		await step(expect(page.locator('#main .entity-view-summary').first()).toBeAttached(attach))
	for (const sectionLabel of options?.expectedSectionLabels ?? [])
		await step(expect(page.locator(`[data-scroll-marker-label="${sectionLabel}"]`).first()).toBeAttached(attach))

	await step(assertNoGeneratedRouteArtifacts(page, pathname))

	expect(
		corsViolations,
		`${pathname} CORS console violations`
	).toEqual([])

	expect(
		diagnostics.issues,
		`${pathname} runtime issues:\n${diagnostics.summary()}`
	).toEqual([])

	await testInfo.attach(`${options?.label ?? pathname}-snapshot`, {
		body: JSON.stringify({
			path: pathname,
			finalUrl: page.url(),
			...await snapshotGeneratedRouteArtifacts(page),
			consoleIssues: diagnostics.issues,
			corsViolations,
		}, null, 2),
		contentType: 'application/json',
	})
}

test.describe('APP-generated routes spot check', () => {
	test.describe.configure({ mode: 'serial' })

	test.skip(fullMatrix, 'E2E_FULL_MATRIX uses discovered +page crawl')

	for (const route of filteredAppGeneratedRoutes) {
		test(`${route.label}: ${route.path}`, async ({ page }, testInfo) => {
			testInfo.setTimeout(180_000)
			await installRouteProbeDatabase(
				page,
				`blockhead-app-generated-spot-${testInfo.workerIndex}-${Date.now()}.sqlite`
			)
			await installChainlistRpcsJsonStub(page)
			await visitRawDumpRoute(page, testInfo, route.path, route)
		})
	}
})

test.describe('raw dump DOM crawl (every discovered +page)', () => {
	test.describe.configure({ mode: 'serial' })

	test('every discovered +page', async ({ browser }, testInfo) => {
		test.skip(!fullMatrix, 'set E2E_FULL_MATRIX=1 for discovered raw-dump crawl')

		const pageUrls = await discoverFilteredPathnamesFromRoutes()
		const perRouteBudgetMs = 180_000
		testInfo.setTimeout(pageUrls.length * perRouteBudgetMs + 60_000)
		console.log(`[raw-dump-dom-crawl] selected ${pageUrls.length} discovered routes`)

		for (const [index, pathname] of pageUrls.entries()) {
			console.log(`[raw-dump-dom-crawl] ${index + 1}/${pageUrls.length} ${pathname}`)
			await test.step(pathname, async () => {
				const context = await browser.newContext(e2eBrowserNewContextOptions())
				const page = await context.newPage()
				try {
					page.setDefaultNavigationTimeout(120_000)
					await installRouteProbeDatabase(
						page,
						`blockhead-raw-dump-${testInfo.workerIndex}-${index}-${Date.now()}.sqlite`
					)
					await installChainlistRpcsJsonStub(page)
					await visitRawDumpRoute(page, testInfo, pathname)
				} finally {
					await context.close()
				}
			})
		}
	})
})
