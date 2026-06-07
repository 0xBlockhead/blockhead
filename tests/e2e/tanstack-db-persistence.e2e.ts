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
	persistenceMarkLoadedEvent,
	persistenceShortCircuitDecisions,
	waitForPersistenceShortCircuit,
} from '../_e2eBrowserHelpers.ts'


const gotoLoadTimeoutMs = 120_000

const pathnamesForRun = () => {
	const includeRaw = process.env.E2E_REAL_PERSISTENCE_PATHS ?? '/networks,/network/eip155:1'
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
	collectionLoadedKeys: Readonly<Record<string, string>>,
) => {
	const collectionIds = Object.keys(collectionLoadedKeys)
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
		&& persistenceShortCircuitDecisions.includes(event.decision)
		&& event.loadedKey === collectionLoadedKeys[event.collectionId]
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
		`warm reload must short-circuit loadSubset with the cold loadedKey for ${collectionIds.join(', ')}: ${JSON.stringify(freshShortCircuits)}`,
	).toBeGreaterThan(0)
}

const exerciseNetworkDetailWhenConfigured = async (page: Page, url: string) => {
	const catalogRequests = countRequestsMatching(page, catalogWire)

	await page.goto(url, { waitUntil: 'load', timeout: gotoLoadTimeoutMs })
	await expect(page.locator('#main')).toBeVisible({ timeout: 120_000 })
	await expect(page.locator('.network-view-collapsible-topology')).toBeAttached({
		timeout: 120_000,
	})

	const coldCount = catalogRequests.get()
	catalogRequests.detach()

	if (coldCount === 0)
		return false

	const probeBefore = await getPersistenceProbeEvents(page)
	const catalogCollectionLoadedKeys = Object.fromEntries(
		[
			...new Set(
				probeBefore
					.filter((event) => (
						event.kind === 'markLoaded'
						&& event.loadedKey.includes('Chainlist_Rest')
					))
					.map((event) => event.collectionId),
			),
		]
			.map((collectionId) => {
				const markLoaded = persistenceMarkLoadedEvent(probeBefore, collectionId)
				return markLoaded != null ?
					[
						collectionId,
						markLoaded.loadedKey,
					]
				:
					undefined
			})
			.filter((entry): entry is [string, string] => entry != null),
	)
	await page.reload({ waitUntil: 'load', timeout: gotoLoadTimeoutMs })
	await expect(page.locator('#main')).toBeVisible({ timeout: 120_000 })
	await expect(page.locator('.network-view-collapsible-topology')).toBeAttached({
		timeout: 120_000,
	})

	for (const [collectionId, loadedKey] of Object.entries(catalogCollectionLoadedKeys))
		await waitForPersistenceShortCircuit(
			page,
			collectionId,
			{
				startIndex: probeBefore.length,
				loadedKey,
			},
		)

	const probeAfter = await getPersistenceProbeEvents(page)
	if (Object.keys(catalogCollectionLoadedKeys).length > 0)
		assertWarmPersistenceProbe(
			probeAfter,
			probeBefore.length,
			catalogCollectionLoadedKeys,
		)

	return Object.keys(catalogCollectionLoadedKeys).length > 0
}


test.describe.configure({ mode: 'serial' })

test.describe('TanStack DB persistence', () => {
	test('catalog field subsets hydrate from OPFS after reload without rerunning loaded collections', async ({
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

		let provedCatalogPersistence = false

		for (const url of pathnamesForRun()) {
			if (url === '/networks')
				continue

			await test.step(url, async () => {
				provedCatalogPersistence = (
					await exerciseNetworkDetailWhenConfigured(page, url)
					|| provedCatalogPersistence
				)
			})
		}

		expect(
			provedCatalogPersistence,
			'at least one configured route must prove catalog collection persistence',
		).toBe(true)

		await context.close()
	})
})
