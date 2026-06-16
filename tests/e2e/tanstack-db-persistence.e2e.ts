import { expect, test, type Page } from '@playwright/test'
import type { BlockheadPersistenceProbeEvent } from '../_e2eBrowserHelpers.ts'

import {
	catalogWire,
	clearOriginOpfs,
	clearPersistenceProbe,
	countRequestsMatching,
	e2eBrowserNewContextOptions,
	getPersistenceProbeEvents,
	installChainlistRpcsJsonStub,
	installPersistenceProbe,
} from '../_e2eBrowserHelpers.ts'


const gotoLoadTimeoutMs = 120_000

type ProductCollectionSyncEvent = {
	collection:
		| {
			kind: 'Entity'
			entityType: string
			id: string
		}
		| {
			kind: 'Field' | 'Count'
			entityType: string
			fieldName: string
			id: string
		}
	key: string
}

type ProductCollectionSizes = {
	loadedSubsets: number
	entities: Record<string, number>
	fields: Record<string, Record<string, number>>
	counts: Record<string, Record<string, number>>
}

type ProductSubscribeError = {
	selectorAddress: readonly string[]
	dimension: string
	entityType: string
	fieldName?: string
	message: string
}

type ClientProbeResource<_Result> = Promise<_Result> & {
	readonly current: _Result | undefined
	readonly error: readonly ProductSubscribeError[] | undefined
	readonly loading: boolean
	readonly ready: boolean
	subscribe: (listener: () => void) => () => void
}

type ProductProbePayload = {
	fields: {
		name?: string
		$$rpcUrls?: {
			values: readonly object[]
			totalCount?: number
		}
	}
}

type ClientProbe = {
	events: {
		collectionSync: ProductCollectionSyncEvent[]
	}
	collectionSizes: () => ProductCollectionSizes
	read: (
		entityType: string,
		entitySelector: object,
		selection: object
	) => ClientProbeResource<ProductProbePayload>
}

type ProductProbeResult = {
	name?: string
	rpcUrlCount: number
	totalCount?: number
	events: ProductCollectionSyncEvent[]
	persistenceEvents: readonly BlockheadPersistenceProbeEvent[]
	sizes: ProductCollectionSizes
}

type ProductProbeReadState = {
	current?: ProductProbePayload
	error?: readonly ProductSubscribeError[]
	loading: boolean
	ready: boolean
}

const productCollectionSyncEvents = (
	events: ProductCollectionSyncEvent[]
) => (
	events.filter((event) => (
		event.collection.entityType === 'EvmNetwork'
		&& (
			event.collection.kind === 'Entity'
			|| event.collection.fieldName === '$$rpcUrls'
		)
	))
)

const productCollectionIds = [
	'Entity:EvmNetwork',
	'Field:EvmNetwork:$$rpcUrls',
	'Count:EvmNetwork:$$rpcUrls',
] as const

const readProductProbe = async (
	page: Page,
	timeoutMs = 60_000
): Promise<ProductProbeResult> => {
	await page.waitForFunction(() => window.__blockheadClientProbe != null, undefined, {
		timeout: timeoutMs,
	})
	return page.evaluate(async (timeout) => {
		const browserWindow: Window & {
			__blockheadClientProbe?: ClientProbe
		} = window
		const probe = browserWindow.__blockheadClientProbe
		if (probe == null)
			throw new Error('missing blockhead client probe')

		const resource = probe.read(
			'EvmNetwork',
			{
				caip2: {
					namespace: 'eip155',
					reference: '1',
				},
			},
			{
				sources: [
					'Chainlist_Rest',
				],
				fields: {
					name: {
						sources: [
							'Chainlist_Rest',
						],
					},
					$$rpcUrls: {
						sources: [
							'Chainlist_Rest',
						],
						count: true,
					},
				},
			}
		)
		const unsubscribe = resource.subscribe(() => {})
		const settled = await Promise.race([
			resource.then((result) => ({
				kind: 'ready' as const,
				result,
			}), (errors: readonly ProductSubscribeError[]) => ({
				kind: 'error' as const,
				errors,
			})),
			new Promise<{
				kind: 'timeout'
				state: ProductProbeReadState
				events: ProductCollectionSyncEvent[]
				sizes: ProductCollectionSizes
				persistenceEvents: readonly BlockheadPersistenceProbeEvent[]
			}>((resolve) => {
				setTimeout(() => resolve({
					kind: 'timeout',
					state: {
						current: resource.current,
						error: resource.error,
						loading: resource.loading,
						ready: resource.ready,
					},
					events: [...probe.events.collectionSync],
					sizes: probe.collectionSizes(),
					persistenceEvents: window.__blockheadPersistenceProbe ?? [],
				}), timeout)
			}),
		])
		unsubscribe()
		if (settled.kind === 'error')
			throw new Error(JSON.stringify(settled.errors))
		if (settled.kind === 'timeout')
			throw new Error(JSON.stringify(settled))

		const result = settled.result
		return {
			name: result.fields.name,
			rpcUrlCount: result.fields.$$rpcUrls?.values.length ?? 0,
			totalCount: result.fields.$$rpcUrls?.totalCount,
			events: [...probe.events.collectionSync],
			persistenceEvents: window.__blockheadPersistenceProbe ?? [],
			sizes: probe.collectionSizes(),
		}
	}, timeoutMs)
}


test.describe.configure({ mode: 'serial' })

test.describe('TanStack DB persistence', () => {
	test('hydrates completed product entity, field, and count subsets from OPFS without replaying them', async ({
		browser,
	}) => {
		test.setTimeout(600_000)

		const context = await browser.newContext(e2eBrowserNewContextOptions())
		const wipePage = await context.newPage()
		await wipePage.goto('/', {
			waitUntil: 'domcontentloaded',
			timeout: gotoLoadTimeoutMs,
		})
		await clearOriginOpfs(wipePage)
		await wipePage.close()

		const page = await context.newPage()
		page.setDefaultNavigationTimeout(gotoLoadTimeoutMs)
		await installPersistenceProbe(page)
		await installChainlistRpcsJsonStub(page)
		await page.goto('/', {
			waitUntil: 'domcontentloaded',
			timeout: gotoLoadTimeoutMs,
		})
		await clearPersistenceProbe(page)

		const coldCatalogRequests = countRequestsMatching(page, catalogWire)
		const cold = await readProductProbe(page)
		const coldProductEvents = productCollectionSyncEvents(cold.events)

		expect(cold.name, JSON.stringify({
			events: productCollectionSyncEvents(cold.events),
			persistenceEvents: cold.persistenceEvents,
			sizes: cold.sizes,
		})).toBe('Ethereum Mainnet')
		expect(cold.rpcUrlCount).toBeGreaterThan(0)
		expect(cold.totalCount).toBe(cold.rpcUrlCount)
		expect(cold.sizes.loadedSubsets).toBeGreaterThan(0)
		expect(cold.sizes.entities.EvmNetwork).toBeGreaterThan(0)
		expect(cold.sizes.fields.EvmNetwork.$$rpcUrls).toBeGreaterThan(0)
		expect(cold.sizes.counts.EvmNetwork.$$rpcUrls).toBeGreaterThan(0)
		expect(coldProductEvents.map((event) => event.collection.kind)).toEqual(expect.arrayContaining([
			'Entity',
			'Field',
			'Count',
		]))
		expect(coldCatalogRequests.get()).toBeGreaterThan(0)
		coldCatalogRequests.detach()
		await page.waitForLoadState('networkidle', { timeout: 120_000 })
		await page.waitForTimeout(2_000)
		const coldPersistenceEvents = await getPersistenceProbeEvents(page)

		await clearPersistenceProbe(page)
		const warmCatalogRequests = countRequestsMatching(page, catalogWire)
		await page.reload({
			waitUntil: 'load',
			timeout: gotoLoadTimeoutMs,
		})
		await expect(page.locator('#main')).toBeVisible({ timeout: 120_000 })

		const warm = await readProductProbe(page)
		const warmProductEvents = productCollectionSyncEvents(warm.events)
		const warmPersistenceEvents = await getPersistenceProbeEvents(page)
		const warmProductPersistenceLoadEvents = warmPersistenceEvents.flatMap((event) => (
			event.kind === 'loadSubset'
			&& productCollectionIds.some((collectionId) => collectionId === event.collectionId) ?
				[event]
			:
				[]
		))
		const warmRemoteLoads = warmPersistenceEvents.flatMap((event) => (
			event.kind === 'loadSubset'
			&& event.decision === 'remote' ?
				[event]
			:
				[]
		))
		const warmProductRemoteLoads = warmRemoteLoads.filter((event) => (
			productCollectionIds.some((collectionId) => collectionId === event.collectionId)
		))
		const coldMarkLoadedKeys = new Set(coldPersistenceEvents.flatMap((event) => (
			event.kind === 'markLoaded' ?
				[`${event.collectionId}:${event.loadedKey}`]
			:
				[]
		)))
		const warmRepeatedRemoteLoads = warmRemoteLoads.filter((event) => (
			coldMarkLoadedKeys.has(`${event.collectionId}:${event.loadedKey}`)
		))

		expect(warm.name).toBe(cold.name)
		expect(warm.rpcUrlCount).toBe(cold.rpcUrlCount)
		expect(warm.totalCount).toBe(cold.totalCount)
		expect(warm.sizes.loadedSubsets).toBeGreaterThan(0)
		expect(warm.sizes.entities.EvmNetwork).toBeGreaterThan(0)
		expect(warm.sizes.fields.EvmNetwork.$$rpcUrls).toBeGreaterThan(0)
		expect(warm.sizes.counts.EvmNetwork.$$rpcUrls).toBeGreaterThan(0)
		expect(warmProductEvents.map((event) => event.collection.kind)).toEqual(expect.arrayContaining([
			'Entity',
			'Field',
			'Count',
		]))
		expect(
			warmProductPersistenceLoadEvents.map((event) => `${event.collectionId}:${event.decision}`)
			).toEqual(expect.arrayContaining([
				'Entity:EvmNetwork:hydrated-rows',
				'Field:EvmNetwork:$$rpcUrls:hydrated-rows',
				'Count:EvmNetwork:$$rpcUrls:hydrated-rows',
			]))
		expect(warmProductPersistenceLoadEvents.every((event) => event.decision === 'hydrated-rows')).toBe(true)
		expect(warmProductRemoteLoads.map((event) => `${event.collectionId}:${event.loadedKey}`)).toEqual([])
		expect(warmPersistenceEvents.length).toBeLessThanOrEqual(500)
		expect(warmRepeatedRemoteLoads.map((event) => `${event.collectionId}:${event.loadedKey}`)).toEqual([])
		expect(warmRemoteLoads.every((event) => !coldMarkLoadedKeys.has(`${event.collectionId}:${event.loadedKey}`)), [
			...warmRemoteLoads.slice(0, 30).map((event) => (
				`${event.collectionId}:${coldMarkLoadedKeys.has(`${event.collectionId}:${event.loadedKey}`) ? 'cold-marked' : 'cold-unmarked'}:${event.loadedKey}`
			)),
			...warmCatalogRequests.urls.slice(0, 30),
		].join('\n')).toBe(true)
		warmCatalogRequests.detach()

		await context.close()
	})

	test('schema version bumps invalidate persisted product subsets before warm hydration', async ({
		browser,
	}) => {
		test.setTimeout(600_000)

		const context = await browser.newContext(e2eBrowserNewContextOptions())
		const wipePage = await context.newPage()
		await wipePage.goto('/', {
			waitUntil: 'domcontentloaded',
			timeout: gotoLoadTimeoutMs,
		})
		await clearOriginOpfs(wipePage)
		await wipePage.close()

		const coldPage = await context.newPage()
		coldPage.setDefaultNavigationTimeout(gotoLoadTimeoutMs)
		await coldPage.addInitScript((schemaVersion) => {
			window.__blockheadProductDataSchemaVersionOverride = schemaVersion
		}, 101)
		await installPersistenceProbe(coldPage)
		await installChainlistRpcsJsonStub(coldPage)
		await coldPage.goto('/', {
			waitUntil: 'load',
			timeout: gotoLoadTimeoutMs,
		})
		await expect(coldPage.locator('#main')).toBeVisible({ timeout: 120_000 })
		const cold = await readProductProbe(coldPage)
		await coldPage.waitForLoadState('networkidle', { timeout: 120_000 })
		await coldPage.waitForTimeout(2_000)
		const coldPersistenceEvents = await getPersistenceProbeEvents(coldPage)
		const coldProductMarkLoadedKeys = new Set(coldPersistenceEvents.flatMap((event) => (
			event.kind === 'markLoaded'
			&& productCollectionIds.some((collectionId) => collectionId === event.collectionId) ?
				[`${event.collectionId}:${event.loadedKey}`]
			:
				[]
		)))
		expect(cold.name).toBe('Ethereum Mainnet')
		expect(coldProductMarkLoadedKeys.size).toBeGreaterThan(0)
		await coldPage.close()

		const sameVersionPage = await context.newPage()
		sameVersionPage.setDefaultNavigationTimeout(gotoLoadTimeoutMs)
		await sameVersionPage.addInitScript((schemaVersion) => {
			window.__blockheadProductDataSchemaVersionOverride = schemaVersion
		}, 101)
		await installPersistenceProbe(sameVersionPage)
		await installChainlistRpcsJsonStub(sameVersionPage)
		await sameVersionPage.goto('/', {
			waitUntil: 'load',
			timeout: gotoLoadTimeoutMs,
		})
		await expect(sameVersionPage.locator('#main')).toBeVisible({ timeout: 120_000 })
		const sameVersion = await readProductProbe(sameVersionPage)
		const sameVersionPersistenceEvents = await getPersistenceProbeEvents(sameVersionPage)
		const sameVersionProductPersistenceLoadEvents = sameVersionPersistenceEvents.flatMap((event) => (
			event.kind === 'loadSubset'
			&& productCollectionIds.some((collectionId) => collectionId === event.collectionId) ?
				[event]
			:
				[]
		))
		const sameVersionProductRemoteLoads = sameVersionProductPersistenceLoadEvents.filter((event) => (
			event.decision === 'remote'
		))
		expect(sameVersion.name).toBe(cold.name)
		expect(sameVersion.rpcUrlCount).toBe(cold.rpcUrlCount)
		expect(
			sameVersionProductPersistenceLoadEvents.map((event) => `${event.collectionId}:${event.decision}`)
			).toEqual(expect.arrayContaining([
				'Entity:EvmNetwork:hydrated-rows',
				'Field:EvmNetwork:$$rpcUrls:hydrated-rows',
				'Count:EvmNetwork:$$rpcUrls:hydrated-rows',
			]))
		expect(sameVersionProductRemoteLoads.filter((event) => (
			coldProductMarkLoadedKeys.has(`${event.collectionId}:${event.loadedKey}`)
		))).toEqual([])
		await sameVersionPage.close()

		const bumpedVersionPage = await context.newPage()
		bumpedVersionPage.setDefaultNavigationTimeout(gotoLoadTimeoutMs)
		await bumpedVersionPage.addInitScript((schemaVersion) => {
			window.__blockheadProductDataSchemaVersionOverride = schemaVersion
		}, 102)
		await installPersistenceProbe(bumpedVersionPage)
		await installChainlistRpcsJsonStub(bumpedVersionPage)
		await bumpedVersionPage.goto('/', {
			waitUntil: 'load',
			timeout: gotoLoadTimeoutMs,
		})
		await expect(bumpedVersionPage.locator('#main')).toBeVisible({ timeout: 120_000 })
		const bumpedVersion = await readProductProbe(bumpedVersionPage)
		const bumpedVersionPersistenceEvents = await getPersistenceProbeEvents(bumpedVersionPage)
		const bumpedVersionProductRemoteLoads = bumpedVersionPersistenceEvents.flatMap((event) => (
			event.kind === 'loadSubset'
			&& event.decision === 'remote'
			&& productCollectionIds.some((collectionId) => collectionId === event.collectionId) ?
				[event]
			:
				[]
		))
		const bumpedVersionProductMarkLoadedKeys = new Set(bumpedVersionPersistenceEvents.flatMap((event) => (
			event.kind === 'markLoaded'
			&& productCollectionIds.some((collectionId) => collectionId === event.collectionId) ?
				[`${event.collectionId}:${event.loadedKey}`]
			:
				[]
		)))
		const bumpedVersionProductRemoteLoadKeys = new Set(bumpedVersionProductRemoteLoads.map((event) => (
			`${event.collectionId}:${event.loadedKey}`
		)))
		expect(bumpedVersion.name).toBe(cold.name)
		expect(bumpedVersion.rpcUrlCount).toBe(cold.rpcUrlCount)
		expect(bumpedVersionProductRemoteLoads.map((event) => event.collectionId)).toEqual(expect.arrayContaining([
			'Entity:EvmNetwork',
			'Field:EvmNetwork:$$rpcUrls',
			'Count:EvmNetwork:$$rpcUrls',
		]))
		expect([...coldProductMarkLoadedKeys].some((loadedKey) => (
			bumpedVersionProductRemoteLoadKeys.has(loadedKey)
		))).toBe(true)
		expect([...coldProductMarkLoadedKeys].some((loadedKey) => (
			bumpedVersionProductMarkLoadedKeys.has(loadedKey)
		))).toBe(true)
		await bumpedVersionPage.close()

		await context.close()
	})
})
