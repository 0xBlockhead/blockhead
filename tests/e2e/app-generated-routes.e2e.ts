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
	skipSettle?: boolean
}

const attach = { timeout: 120_000 }
const fullMatrix = process.env.E2E_FULL_MATRIX === '1'
const networkPathPattern = (
	process.env.E2E_NETWORK_PATH_PATTERN ?
		new RegExp(process.env.E2E_NETWORK_PATH_PATTERN)
		:
		undefined
)
const networkPathnames = process.env.E2E_NETWORK_PATHS?.split(',').filter(Boolean)
const inapplicableCarouselFacetIdsByPathname = new Map([
	[
		'/network/bitcoin',
		[
			'cardano',
			'cosmos',
			'evm',
			'polkadot',
		],
	],
	[
		'/network/cardano',
		[
			'cosmos',
			'evm',
			'polkadot',
			'solana',
		],
	],
	[
		'/network/eip155:1',
		[
			'cardano',
			'cosmos',
			'polkadot',
			'solana',
			'utxo',
		],
	],
	[
		'/network/bittensor',
		[
			'cardano',
			'cosmos',
			'evm',
			'polkadot',
			'solana',
			'utxo',
		],
	],
] as const)

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
	{ label: 'networks list', path: '/networks', expectEntityRows: true },
	{
		label: 'Ethereum network detail',
		path: '/network/eip155:1',
		expectEntityRows: false,
	},
	{
		label: 'Bitcoin network detail',
		path: '/network/bitcoin',
		expectEntityRows: false,
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
		await step(expect(page.locator('#main li[data-list-item] [data-card] .entity-view-summary').first()).toBeAttached(attach))

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

const networkDetailPathnamesFromCatalog = async (page: import('@playwright/test').Page) => {
	if (networkPathnames != null)
		return networkPathnames

	await page.goto('/networks', {
		waitUntil: 'load',
		timeout: 120_000,
	})
	await expect(page.locator('#main')).toBeVisible(attach)
	await assertMainSettled(page, 120_000)

	const pathnames = [...new Set((await page.locator('#main a[href]').evaluateAll((anchors) => (
		anchors
			.map((anchor) => new URL(anchor.getAttribute('href') ?? '', location.href).pathname)
			.filter((pathname) => /^\/network\/[^/]+$/.test(pathname))
	))).map(decodeURIComponent))].sort()
	if (pathnames.length === 0)
		throw new Error('/networks rendered no canonical Network detail links')

	return (
		networkPathPattern == null ?
			pathnames
			:
			pathnames.filter((pathname) => networkPathPattern.test(pathname))
	)
}

const exerciseNetworkCarouselSections = async (
	page: import('@playwright/test').Page,
	pathname: string
) => {
	await page.goto(pathname, {
		waitUntil: 'load',
		timeout: 120_000,
	})
	await expect(page.locator('#main')).toBeVisible(attach)

	const carousels = page.locator('#main details[id*="-carousel-"]')
	await expect(
		carousels.first(),
		`${pathname} must render its applicable Network facet carousels`
	).toBeAttached(attach)
	const carouselIds = await carousels.evaluateAll((elements) => elements.map((element) => element.id))
	expect(new Set(carouselIds).size, `${pathname} must have unique carousel ids`).toBe(carouselIds.length)
	for (const facetId of inapplicableCarouselFacetIdsByPathname.get(pathname) ?? [])
		expect(
			carouselIds.filter((carouselId) => carouselId.includes(`-carousel-${facetId}-`)),
			`${pathname} must not render markers or panes owned by its inapplicable ${facetId} facet`
		).toEqual([])

	const violations = await carousels.evaluateAll((elements) => elements.flatMap((carousel) => {
		const violation = (condition: boolean, message: string) => condition ? [] : [message]
		const hosts = carousel.querySelectorAll(':scope > [data-collapsible-tabs-pane-host]')
		const markers = Array.from(carousel.querySelectorAll(':scope > summary [href^="#"][data-scroll-marker-label]'))
		const sections = hosts.length === 1 ? Array.from(hosts[0].children) : []
		const markerTargets = markers.map((marker) => decodeURIComponent(marker.getAttribute('href')?.slice(1) ?? ''))
		const sectionIds = sections.map((section) => section.id)

		return [
			...violation(hosts.length === 1, `${carousel.id}: expected one pane host, found ${hosts.length}`),
			...violation(markers.length > 0, `${carousel.id}: no section markers`),
			...violation(new Set(markerTargets).size === markerTargets.length, `${carousel.id}: duplicate marker targets`),
			...violation(markerTargets.length === sections.length, `${carousel.id}: ${markerTargets.length} markers for ${sections.length} sections`),
			...violation(
				markerTargets.every((target) => sectionIds.includes(target))
				&& sectionIds.every((sectionId) => markerTargets.includes(sectionId)),
				`${carousel.id}: markers and sections are not bijective`
			),
			...sections.flatMap((section) => {
				const articles = Array.from(section.querySelectorAll(':scope > article, :scope > * > article'))
				const directChildrenAreCards = Array.from(section.children).every((child) => (
					child.tagName === 'ARTICLE'
					|| child.querySelector(':scope > article') != null
					|| child.matches('[data-resource-state], [data-section-state]')
					|| child.textContent?.includes('Loading') === true
				))

				return [
					...violation(
						section.tagName === 'SECTION'
						&& section.id !== ''
						&& section.hasAttribute('data-scroll-marker-label')
						&& section.hasAttribute('data-column')
						&& section.getAttribute('data-column-item') === 'flexible',
						`${carousel.id}/${section.id || '(missing id)'}: invalid section structure`
					),
					...violation(
						(section.children.length > 0 && directChildrenAreCards),
						`${carousel.id}/${section.id}: every section child must expose an article card`
					),
					...articles.flatMap((article) => violation(
						article.id !== ''
						&& article.hasAttribute('data-card')
						&& article.hasAttribute('data-scroll-container')
						&& article.getAttribute('data-column-item') === 'flexible',
						`${carousel.id}/${section.id}/${article.id || '(missing id)'}: invalid article structure`
					)),
					...articles.flatMap((article) => {
						const state = article.querySelector<HTMLElement>(
							'[data-resource-state], [data-section-state]'
						)
						const hasExplicitState = (
							state?.dataset.resourceState === 'pending'
							|| state?.dataset.resourceState === 'failed'
							|| state?.dataset.sectionState === 'resolved-empty'
							|| state?.dataset.sectionState === 'resolved-nonempty'
							|| state?.dataset.sectionState === 'projection-blocked'
							|| state?.dataset.sectionState === 'projection-unsupported'
						)
						const hasDomainContent = (
							(article.textContent?.trim().length ?? 0) > 0
							|| article.querySelector('a[href], dl, form, img, ol, table, ul, video') != null
						)

						return violation(
							hasExplicitState || hasDomainContent,
							`${carousel.id}/${section.id}/${article.id}: blank article without content or explicit state`
						)
					}),
					...Array.from(section.querySelectorAll('.tooltip-trigger [data-text="annotation"]')).flatMap((annotation) => violation(
						annotation.closest('header') != null,
						`${carousel.id}/${section.id}: annotation tooltip is outside a header`
					)),
				]
			}),
		]
	}))
	expect(violations, `${pathname} carousel structure`).toEqual([])

	return carouselIds.length
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

test.describe('NetworkView carousel completeness', () => {
	test.describe.configure({ mode: 'serial' })

	test('selected Network routes exercise every applicable carousel section', async ({ page }, testInfo) => {
		test.skip(fullMatrix, 'E2E_FULL_MATRIX uses discovered +page crawl')
		testInfo.setTimeout(3_600_000)
		await installRouteProbeDatabase(
			page,
			`blockhead-network-view-carousels-${testInfo.workerIndex}-${Date.now()}.sqlite`
		)
		await installChainlistRpcsJsonStub(page)

		const pathnames = await networkDetailPathnamesFromCatalog(page)
		let carouselCount = 0
		for (const pathname of pathnames)
			carouselCount += await exerciseNetworkCarouselSections(page, pathname)

		expect(carouselCount, 'the canonical Network catalog must exercise compiled NetworkView carousels').toBeGreaterThan(0)
	})
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
