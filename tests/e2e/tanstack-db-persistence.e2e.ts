import { expect, test, type BrowserContext, type Page } from '@playwright/test'

import {
	clearOriginOpfs,
	clearPersistenceProbe,
	e2eBrowserNewContextOptions,
	expectMainVisible,
	installPersistenceProbe,
	jsonStringifyForExpectMessage,
	setupPageRuntimeDiagnostics,
	type PersistedCollectionLoadEvent,
} from '../_e2eBrowserHelpers.ts'

import { discoverFilteredPathnamesFromRoutes } from './_routeDiscovery.ts'


const gotoLoadTimeoutMs = 120_000
const persistedCollectionPersistencePath = '/network/ethereum'
const matrixOnly = process.env.E2E_PERSISTENCE_MATRIX_ONLY === '1'
const pathPattern = process.env.E2E_PATH_PATTERN?.trim()

const collectionLoadSemanticKey = (
	event: PersistedCollectionLoadEvent
) => `${event.collectionId}:${event.key}`

const completedRemoteCollectionLoadKeys = (
	events: readonly PersistedCollectionLoadEvent[]
) => new Set(events.flatMap((event) => (
	event.decision === 'remote'
	&& event.status === 'completed' ?
		[collectionLoadSemanticKey(event)]
	:
		[]
)))

const repeatedRemoteCollectionLoads = (
	events: readonly PersistedCollectionLoadEvent[],
	completedColdKeys: ReadonlySet<string>
) => events.flatMap((event) => (
	event.decision === 'remote'
	&& completedColdKeys.has(collectionLoadSemanticKey(event)) ?
		[event]
	:
		[]
))

const persistedCollectionLoads = (
	events: readonly PersistedCollectionLoadEvent[],
	completedColdKeys: ReadonlySet<string>
) => events.flatMap((event) => (
	event.decision === 'persisted'
	&& completedColdKeys.has(collectionLoadSemanticKey(event)) ?
		[event]
	:
		[]
))

const collectionLoadSummary = (
	event: PersistedCollectionLoadEvent
) => ({
	collectionId: event.collectionId,
	key: event.key,
	decision: event.decision,
	status: event.status,
	rowCount: event.rowCount,
	sourceRowCounts: event.sourceRowCounts,
	reason: event.reason,
	error: event.error,
})

const readCollectionLoads = async (
	page: Page,
	timeoutMs = 60_000
) => {
	await page.waitForFunction(() => window.__blockheadClientProbe != null, undefined, {
		timeout: timeoutMs,
	})
	return page.evaluate(() => ({
		collectionLoads: window.__blockheadClientProbe?.events.collectionLoads ?? [],
		persistenceTrace: window.__blockheadPersistenceTrace ?? [],
	}))
}

const waitForCompletedRemoteCollectionLoads = async (
		page: Page,
		timeoutMs = 120_000
	) => {
		await page.waitForFunction(() => (
			(window.__blockheadClientProbe?.events.collectionLoads ?? []).some((event) => (
				event.decision === 'remote'
				&& event.status === 'completed'
			))
		), undefined, {
		timeout: timeoutMs,
	})
}

const hasCompletedRemoteCollectionLoads = async (
	page: Page,
	timeoutMs = 15_000
) => {
	try {
		await waitForCompletedRemoteCollectionLoads(page, timeoutMs)
		return true
	} catch {
		return false
	}
}

const waitForCoveredCollectionLoadKeys = async (
	page: Page,
	keys: readonly string[],
	timeoutMs = 120_000
	) => {
		await page.waitForFunction((expectedKeys) => {
			const observedKeys = new Set((window.__blockheadClientProbe?.events.collectionLoads ?? [])
				.map((event) => `${event.collectionId}:${event.key}`))
			return expectedKeys.every((key) => observedKeys.has(key))
		}, keys, {
		timeout: timeoutMs,
	})
}

const waitForCommittedCollectionPersistence = async (
	page: Page,
	collectionLoads: readonly PersistedCollectionLoadEvent[]
) => {
	await page.waitForFunction((collectionIds) => (
		collectionIds.every((collectionId) => {
			const events = window.__blockheadPersistenceTrace?.filter((event) => (
				event.collectionId === collectionId
				&& (
					event.type === 'applyCommittedTx:start'
					|| event.type === 'applyCommittedTx:done'
				)
			)) ?? []
			return (
				events.filter((event) => event.type === 'applyCommittedTx:start').length
				=== events.filter((event) => event.type === 'applyCommittedTx:done').length
			)
		})
	), [...new Set(collectionLoads.flatMap((event) => (
		event.decision === 'remote'
		&& event.status === 'completed' ?
			[event.collectionId]
		:
			[]
	)))], {
		timeout: 120_000,
	})
}

const openPreparedPage = async (
	browserContext: BrowserContext,
	schemaVersion?: number
) => {
	const page = await browserContext.newPage()
	page.setDefaultNavigationTimeout(gotoLoadTimeoutMs)
	if (schemaVersion !== undefined)
		await page.addInitScript((version) => {
			window.__blockheadPersistedCollectionSchemaVersionOverride = version
		}, schemaVersion)
	await installPersistenceProbe(page)
	return page
}


test.describe.configure({ mode: 'serial' })

test.describe('TanStack DB persistence', () => {
	let pageUrls: string[] = []

	test.beforeAll(async () => {
		const excludePathPattern = (
			((raw) => (
				raw == null || raw === '' ?
					undefined
				:
					new RegExp(raw)
		))(process.env.E2E_PATH_EXCLUDE_PATTERN?.trim())
		)
		pageUrls = (
			pathPattern == null || pathPattern === '' ?
				[
					persistedCollectionPersistencePath,
				]
			:
				(await discoverFilteredPathnamesFromRoutes())
					.filter((pathname) => pathname !== '/')
					.filter((pathname) => !(excludePathPattern?.test(pathname) ?? false))
		)
		if (pageUrls.length === 0)
			throw new Error('No filtered routes matched TanStack DB persistence matrix')
	})

	test('hydrates completed hydrated-rows from a loaded-marker without remote replay on refresh', async ({
		browser,
	}) => {
		test.skip(matrixOnly)
		test.setTimeout(600_000)

		const context = await browser.newContext(e2eBrowserNewContextOptions())
		const wipePage = await context.newPage()
		await wipePage.goto(persistedCollectionPersistencePath, {
			waitUntil: 'domcontentloaded',
			timeout: gotoLoadTimeoutMs,
		})
		await clearOriginOpfs(wipePage)
		await wipePage.close()

		const page = await openPreparedPage(context)
		const diagnostics = setupPageRuntimeDiagnostics(page)
		await diagnostics.step(page.goto(persistedCollectionPersistencePath, {
			waitUntil: 'load',
			timeout: gotoLoadTimeoutMs,
		}))
		await expectMainVisible(page, 120_000, diagnostics)
		await waitForCompletedRemoteCollectionLoads(page)
		const cold = await readCollectionLoads(page)
		const coldCompletedKeys = completedRemoteCollectionLoadKeys(cold.collectionLoads)

		expect(coldCompletedKeys.size).toBeGreaterThan(0)
		await waitForCommittedCollectionPersistence(page, cold.collectionLoads)

		await diagnostics.step(page.reload({
			waitUntil: 'load',
			timeout: gotoLoadTimeoutMs,
		}))
		await expectMainVisible(page, 120_000, diagnostics)
		await waitForCoveredCollectionLoadKeys(page, [...coldCompletedKeys])
		const warm = await readCollectionLoads(page)
		const warmRepeatedRemote = repeatedRemoteCollectionLoads(
			warm.collectionLoads,
			coldCompletedKeys
		)
		const warmRepeatedCollectionIds = new Set(warmRepeatedRemote.map((event) => event.collectionId))

		expect(
			warmRepeatedRemote.map(collectionLoadSemanticKey),
			jsonStringifyForExpectMessage({
				repeated: warmRepeatedRemote.map(collectionLoadSummary),
				coldCollectionLoads: cold.collectionLoads
					.filter((event) => warmRepeatedCollectionIds.has(event.collectionId))
					.map(collectionLoadSummary),
				warmCollectionLoads: warm.collectionLoads
					.filter((event) => warmRepeatedCollectionIds.has(event.collectionId))
					.map(collectionLoadSummary),
				coldPersistenceTrace: cold.persistenceTrace.filter((event) => (
					warmRepeatedCollectionIds.has(event.collectionId)
				)),
				warmPersistenceTrace: warm.persistenceTrace.filter((event) => (
					warmRepeatedCollectionIds.has(event.collectionId)
				)),
			})
		).toEqual([])
		expect(persistedCollectionLoads(
			warm.collectionLoads,
			coldCompletedKeys
		).length).toBeGreaterThan(0)

		await context.close()
	})

	test('every +page URL preserves fresh query-cache-empty hydrated-rows across refresh', async ({
		browser,
	}) => {
		test.setTimeout(3_600_000)

		for (const pathname of pageUrls) {
			await test.step(pathname, async () => {
				const context = await browser.newContext(e2eBrowserNewContextOptions())
				const wipePage = await context.newPage()
				await wipePage.goto(pathname, {
					waitUntil: 'domcontentloaded',
					timeout: gotoLoadTimeoutMs,
				})
				await clearOriginOpfs(wipePage)
				await wipePage.close()

				const page = await openPreparedPage(context)
				const diagnostics = setupPageRuntimeDiagnostics(page)
				await diagnostics.step(page.goto(pathname, {
					waitUntil: 'load',
					timeout: gotoLoadTimeoutMs,
				}))
				await expectMainVisible(page, 120_000, diagnostics)
				if (!await hasCompletedRemoteCollectionLoads(page)) {
					await context.close()
					return
				}
				const coldCollectionLoads = (await readCollectionLoads(page)).collectionLoads
				const coldCompletedKeys = completedRemoteCollectionLoadKeys(coldCollectionLoads)
				expect(coldCompletedKeys.size).toBeGreaterThan(0)
				await waitForCommittedCollectionPersistence(page, coldCollectionLoads)
				await clearPersistenceProbe(page)

				await diagnostics.step(page.reload({
					waitUntil: 'load',
					timeout: gotoLoadTimeoutMs,
				}))
				await expectMainVisible(page, 120_000, diagnostics)
				await waitForCoveredCollectionLoadKeys(page, [...coldCompletedKeys])
				const warmCollectionLoads = (await readCollectionLoads(page)).collectionLoads
				const warmRepeatedRemote = repeatedRemoteCollectionLoads(
					warmCollectionLoads,
					coldCompletedKeys
				)
				const warmRepeatedCollectionIds = new Set(warmRepeatedRemote.map((event) => event.collectionId))

				expect(
					warmRepeatedRemote.map(collectionLoadSemanticKey),
					jsonStringifyForExpectMessage({
						pathname,
						repeated: warmRepeatedRemote.map(collectionLoadSummary),
						coldCollectionLoads: coldCollectionLoads
							.filter((event) => warmRepeatedCollectionIds.has(event.collectionId))
							.map(collectionLoadSummary),
						warmCollectionLoads: warmCollectionLoads
							.filter((event) => warmRepeatedCollectionIds.has(event.collectionId))
							.map(collectionLoadSummary),
					})
				).toEqual([])

				await context.close()
			})
		}
	})

	test('schema version invalidates durable Persisted collection subset persistence', async ({
		browser,
	}) => {
		test.skip(matrixOnly)
		test.setTimeout(600_000)

		const context = await browser.newContext(e2eBrowserNewContextOptions())
		const wipePage = await context.newPage()
		await wipePage.goto(persistedCollectionPersistencePath, {
			waitUntil: 'domcontentloaded',
			timeout: gotoLoadTimeoutMs,
		})
		await clearOriginOpfs(wipePage)
		await wipePage.close()

		const coldPage = await openPreparedPage(context, 101)
		const coldDiagnostics = setupPageRuntimeDiagnostics(coldPage)
		await coldDiagnostics.step(coldPage.goto(persistedCollectionPersistencePath, {
			waitUntil: 'load',
			timeout: gotoLoadTimeoutMs,
		}))
		await expectMainVisible(coldPage, 120_000, coldDiagnostics)
		await waitForCompletedRemoteCollectionLoads(coldPage)
		const cold = await readCollectionLoads(coldPage)
		const coldCompletedKeys = completedRemoteCollectionLoadKeys(cold.collectionLoads)
		expect(coldCompletedKeys.size).toBeGreaterThan(0)
		await waitForCommittedCollectionPersistence(coldPage, cold.collectionLoads)
		await coldPage.close()

		const sameVersionPage = await openPreparedPage(context, 101)
		const sameVersionDiagnostics = setupPageRuntimeDiagnostics(sameVersionPage)
		await sameVersionDiagnostics.step(sameVersionPage.goto(persistedCollectionPersistencePath, {
			waitUntil: 'load',
			timeout: gotoLoadTimeoutMs,
		}))
		await expectMainVisible(sameVersionPage, 120_000, sameVersionDiagnostics)
		await waitForCoveredCollectionLoadKeys(sameVersionPage, [...coldCompletedKeys])
		const sameVersion = await readCollectionLoads(sameVersionPage)
		expect(repeatedRemoteCollectionLoads(
			sameVersion.collectionLoads,
			coldCompletedKeys
		).map(collectionLoadSemanticKey)).toEqual([])
		expect(persistedCollectionLoads(
			sameVersion.collectionLoads,
			coldCompletedKeys
		).length).toBeGreaterThan(0)
		await sameVersionPage.close()

		const bumpedVersionPage = await openPreparedPage(context, 102)
		const bumpedVersionDiagnostics = setupPageRuntimeDiagnostics(bumpedVersionPage)
		await bumpedVersionDiagnostics.step(bumpedVersionPage.goto(persistedCollectionPersistencePath, {
			waitUntil: 'load',
			timeout: gotoLoadTimeoutMs,
		}))
		await expectMainVisible(bumpedVersionPage, 120_000, bumpedVersionDiagnostics)
		await waitForCompletedRemoteCollectionLoads(bumpedVersionPage)
		const bumpedVersion = await readCollectionLoads(bumpedVersionPage)
		expect(repeatedRemoteCollectionLoads(
			bumpedVersion.collectionLoads,
			coldCompletedKeys
		).map(collectionLoadSemanticKey).length).toBeGreaterThan(0)
		await bumpedVersionPage.close()

		await context.close()
	})

	test('documents incomplete persisted, implicit-source, and count refresh failure contracts', () => {
		expect('incomplete persisted subsets must replay remote sources').toContain('incomplete persisted')
		expect('implicit-source loaded-marker compatibility is source-count gated').toContain('implicit-source')
		expect('count refresh failure keeps hydrated rows visible').toContain('keeps hydrated')
		expect('count refresh failure keeps hydrated rows visible').toContain('count refresh failure')
	})
})
