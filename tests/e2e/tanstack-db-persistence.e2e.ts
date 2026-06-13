import { expect, test, type Page } from '@playwright/test'

import {
	assertMainSettled,
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

type ClientProbe = {
	events: {
		collectionSync: ProductCollectionSyncEvent[]
	}
	collectionSizes: () => ProductCollectionSizes
	read: (
		entityType: string,
		entityId: object,
		selection: object,
	) => Promise<{
		fields: {
			name?: string
			$$rpcUrls?: {
				values: readonly object[]
				totalCount?: number
			}
		}
	}>
}

const pathnamesForRun = () => {
	const includeRaw = process.env.E2E_REAL_PERSISTENCE_PATHS ?? '/network/eip155:1'
	return includeRaw.split(',').map((path) => path.trim()).filter(Boolean)
}

const productCollectionSyncEvents = (
	events: ProductCollectionSyncEvent[],
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

const readProductProbe = (
	page: Page,
) => page.evaluate(async () => {
	const browserWindow: Window & {
		__blockheadClientProbe?: ClientProbe
	} = window
	const probe = browserWindow.__blockheadClientProbe
	if (probe == null)
		throw new Error('missing blockhead client probe')

	const result = await probe
		.read(
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
					name: true,
					$$rpcUrls: {
						sources: [
							'Chainlist_Rest',
						],
						count: true,
					},
				},
			},
		)
		.catch((errors: ProductSubscribeError[]) => {
			throw new Error(JSON.stringify(errors))
		})
	return {
		name: result.fields.name,
		rpcUrlCount: result.fields.$$rpcUrls?.values.length ?? 0,
		totalCount: result.fields.$$rpcUrls?.totalCount,
		events: [...probe.events.collectionSync],
		sizes: probe.collectionSizes(),
	}
})


test.describe.configure({ mode: 'serial' })

test.describe('TanStack DB persistence', () => {
	test('product entity, field, and count subsets hydrate from OPFS after reload while TanStack refreshes upstream', async ({
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

		for (const url of pathnamesForRun()) {
			await test.step(url, async () => {
				await page.goto(url, { waitUntil: 'load', timeout: gotoLoadTimeoutMs })
				await expect(page.locator('#main')).toBeVisible({ timeout: 120_000 })
				await assertMainSettled(page, 120_000)
			})
		}

		const cold = await readProductProbe(page)
		const coldProductEvents = productCollectionSyncEvents(cold.events)

		expect(cold.name).toBe('Ethereum Mainnet')
		expect(cold.rpcUrlCount).toBeGreaterThan(0)
		expect(cold.totalCount).toBe(cold.rpcUrlCount)
		expect(cold.sizes.entities.EvmNetwork).toBeGreaterThan(0)
		expect(cold.sizes.fields.EvmNetwork.$$rpcUrls).toBeGreaterThan(0)
		expect(cold.sizes.counts.EvmNetwork.$$rpcUrls).toBeGreaterThan(0)
		expect(coldProductEvents.map((event) => event.collection.kind)).toEqual(expect.arrayContaining([
			'Entity',
			'Field',
			'Count',
		]))
		await page.waitForTimeout(2_000)

		const warmCatalogRequests = countRequestsMatching(page, catalogWire)
		await page.route('**/*', async (route) => {
			if (catalogWire(route.request().url(), route.request().method())) {
				await route.abort('failed')
				return
			}

			await route.fallback()
		})
		await clearPersistenceProbe(page)
		await page.reload({ waitUntil: 'load', timeout: gotoLoadTimeoutMs })
		await expect(page.locator('#main')).toBeVisible({ timeout: 120_000 })
		await assertMainSettled(page, 120_000)

		const warm = await readProductProbe(page)
		const warmProductEvents = productCollectionSyncEvents(warm.events)
		const warmPersistenceEvents = await getPersistenceProbeEvents(page)
		const warmProductPersistenceLoadEvents = warmPersistenceEvents.filter((event) => (
			event.kind === 'loadSubset'
			&& productCollectionIds.some((collectionId) => collectionId === event.collectionId)
		))

		expect(warm.name).toBe(cold.name)
		expect(warm.rpcUrlCount).toBe(cold.rpcUrlCount)
		expect(warm.totalCount).toBe(cold.totalCount)
		expect(warm.sizes.entities.EvmNetwork).toBeGreaterThan(0)
		expect(warm.sizes.fields.EvmNetwork.$$rpcUrls).toBeGreaterThan(0)
		expect(warm.sizes.counts.EvmNetwork.$$rpcUrls).toBeGreaterThan(0)
		expect(warmProductEvents.map((event) => event.collection.kind)).toEqual(expect.arrayContaining([
			'Entity',
			'Field',
			'Count',
		]))
		expect(
			warmProductPersistenceLoadEvents.map((event) => `${event.collectionId}:${event.decision}`),
		).toEqual(expect.arrayContaining([
			...productCollectionIds.map((collectionId) => `${collectionId}:hydrated-rows`),
		]))
		expect(warmProductPersistenceLoadEvents.every((event) => event.decision === 'hydrated-rows')).toBe(true)
		expect(warmPersistenceEvents.length).toBeLessThanOrEqual(500)
		expect(warmCatalogRequests.get()).toBeGreaterThan(0)
		warmCatalogRequests.detach()

		await context.close()
	})
})
