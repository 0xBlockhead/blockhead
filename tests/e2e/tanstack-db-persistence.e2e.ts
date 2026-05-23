import { expect, test, type Page } from '@playwright/test'

import {
	catalogWire,
	clearOriginOpfs,
	clearPersistenceProbe,
	countRequestsMatching,
	e2eBrowserNewContextOptions,
	getPersistenceProbeEvents,
	installChainlistRpcsJsonStub,
	installPersistenceProbe,
	networksCatalogFieldCollectionId,
	waitForNetworksListRendered,
	waitForPersistenceMarkLoaded,
} from '../_e2eBrowserHelpers.ts'


const gotoLoadTimeoutMs = 120_000

const pathnamesForRun = () => {
	const includeRaw = process.env.E2E_REAL_PERSISTENCE_PATHS ?? '/networks,/network/1'
	return includeRaw.split(',').map((path) => path.trim()).filter(Boolean)
}

const probeEventsAfter = (
	events: Awaited<ReturnType<typeof getPersistenceProbeEvents>>,
	startIndex: number,
) => (
	events.slice(startIndex)
)

const assertWarmPersistenceProbe = (
	events: Awaited<ReturnType<typeof getPersistenceProbeEvents>>,
	startIndex: number,
	collectionIds: string[],
) => {
	const fresh = probeEventsAfter(events, startIndex)
	const freshQueryFns = fresh.filter((event) => (
		event.kind === 'queryFn'
		&& collectionIds.includes(event.collectionId)
	))
	const freshRemoteLoadSubsets = fresh.filter((event) => (
		event.kind === 'loadSubset'
		&& collectionIds.includes(event.collectionId)
		&& event.decision === 'remote'
	))
	const freshShortCircuits = fresh.filter((event) => (
		event.kind === 'loadSubset'
		&& collectionIds.includes(event.collectionId)
		&& (
			event.decision === 'hydrated-rows'
			|| event.decision === 'loaded-marker'
			|| event.decision === 'snapshot'
		)
	))

	expect(
		freshQueryFns,
		`warm reload must not re-run queryFn for persisted collections: ${JSON.stringify(freshQueryFns)}`,
	).toEqual([])
	expect(
		freshRemoteLoadSubsets,
		`warm reload must short-circuit loadSubset without remote fetch: ${JSON.stringify(freshRemoteLoadSubsets)}`,
	).toEqual([])
	expect(
		freshShortCircuits.length,
		`warm reload must record at least one short-circuited loadSubset for ${collectionIds.join(', ')}`,
	).toBeGreaterThan(0)
}

const exerciseNetworksCatalogPersistence = async (page: Page) => {
	const catalogRequests = countRequestsMatching(page, catalogWire)
	const coldChainlist = page.waitForResponse(
		(response) => catalogWire(response.url(), response.request().method()),
		{ timeout: 120_000 },
	)

	await page.goto('/networks', { waitUntil: 'load', timeout: gotoLoadTimeoutMs })
	await coldChainlist
	await waitForNetworksListRendered(page)
	await waitForPersistenceMarkLoaded(page, networksCatalogFieldCollectionId)

	const coldEvents = await getPersistenceProbeEvents(page)
	expect(
		coldEvents.some((event) => (
			event.kind === 'queryFn'
			&& event.collectionId === networksCatalogFieldCollectionId
		)),
		'cold load must run catalog field queryFn',
	).toBe(true)
	expect(
		coldEvents.some((event) => (
			event.kind === 'markLoaded'
			&& event.collectionId === networksCatalogFieldCollectionId
		)),
		'cold load must persist loaded-subset metadata marker',
	).toBe(true)
	expect(catalogRequests.get(), 'cold load must fetch catalog HTTP').toBeGreaterThan(0)
	catalogRequests.detach()

	const probeIndexBeforeReload = coldEvents.length
	const warmCatalogRequests = countRequestsMatching(page, catalogWire)

	await page.reload({ waitUntil: 'load', timeout: gotoLoadTimeoutMs })
	await expect(page.locator('#main')).toBeVisible({ timeout: 120_000 })
	await waitForNetworksListRendered(page)

	warmCatalogRequests.detach()
	expect(
		warmCatalogRequests.get(),
		'warm reload must not repeat Chainlist / ethereum-lists HTTP',
	).toBe(0)

	const warmEvents = await getPersistenceProbeEvents(page)
	assertWarmPersistenceProbe(
		warmEvents,
		probeIndexBeforeReload,
		[networksCatalogFieldCollectionId],
	)
}

const exerciseNetworkDetailWhenConfigured = async (page: Page, url: string) => {
	const catalogRequests = countRequestsMatching(page, catalogWire)

	await page.goto(url, { waitUntil: 'load', timeout: gotoLoadTimeoutMs })
	await expect(page.locator('#main')).toBeVisible({ timeout: 120_000 })
	await expect(page.locator('.network-view-carousel-groups')).toBeAttached({
		timeout: 120_000,
	})

	const coldCount = catalogRequests.get()
	catalogRequests.detach()

	if (coldCount === 0)
		return

	const probeBefore = await getPersistenceProbeEvents(page)
	const warmCatalogRequests = countRequestsMatching(page, catalogWire)

	await page.reload({ waitUntil: 'load', timeout: gotoLoadTimeoutMs })
	await expect(page.locator('#main')).toBeVisible({ timeout: 120_000 })
	await expect(page.locator('.network-view-carousel-groups')).toBeAttached({
		timeout: 120_000,
	})

	warmCatalogRequests.detach()
	expect(
		warmCatalogRequests.get(),
		`${url} warm reload must not repeat catalog HTTP after cold count ${coldCount}`,
	).toBe(0)

	const probeAfter = await getPersistenceProbeEvents(page)
	const catalogCollectionIds = [
		...new Set(
			probeBefore
				.filter((event) => (
					(event.kind === 'queryFn' || event.kind === 'markLoaded')
					&& event.loadedKey.includes('Chainlist_Rest')
				))
				.map((event) => event.collectionId),
		),
	]

	if (catalogCollectionIds.length > 0)
		assertWarmPersistenceProbe(probeAfter, probeBefore.length, catalogCollectionIds)
}


test.describe.configure({ mode: 'serial' })

test.describe('TanStack DB persistence', () => {
	test('catalog subsets hydrate from OPFS after reload without remote resolver or HTTP', async ({
		browser,
	}) => {
		test.setTimeout(600_000)

		const context = await browser.newContext(e2eBrowserNewContextOptions())
		const wipePage = await context.newPage()
		await wipePage.goto('/', { waitUntil: 'domcontentloaded', timeout: gotoLoadTimeoutMs })
		await clearOriginOpfs(wipePage)
		await wipePage.close()

		const page = await context.newPage()
		page.setDefaultNavigationTimeout(gotoLoadTimeoutMs)
		await installPersistenceProbe(page)
		await installChainlistRpcsJsonStub(page)
		await page.goto('/', { waitUntil: 'domcontentloaded', timeout: gotoLoadTimeoutMs })
		await clearPersistenceProbe(page)

		await exerciseNetworksCatalogPersistence(page)

		for (const url of pathnamesForRun()) {
			if (url === '/networks')
				continue

			await test.step(url, async () => {
				await exerciseNetworkDetailWhenConfigured(page, url)
			})
		}

		await context.close()
	})
})
