import {
	describe,
	expect,
	it,
} from 'vitest'
import { QueryClient } from '@tanstack/query-core'
import type { PersistenceAdapter } from '@tanstack/db-sqlite-persistence-core'
import { type as arktype } from 'arktype'
import {
	readdirSync,
	readFileSync,
} from 'node:fs'
import { resolve } from 'node:path'

import {
	CollectionLoadDecision,
	PersistedCollectionLoadStatus,
	PersistedCollectionSourceStatus,
	client,
	persistedCollectionHydrationPlan,
	persistedCollectionRemoteResult,
} from '$/client/$client.svelte.ts'
import {
	EntityFieldCardinality,
	EntityFieldType,
	EntityMetaKey,
	entity,
	entityFieldAddressKey,
	facet,
} from '$/schema/$schema.ts'


const clientDirectory = resolve(
	process.cwd(),
	'src/client'
)

const source = (
	fileName: string
) => readFileSync(
	resolve(
		clientDirectory,
		fileName
	),
	'utf8'
)


describe('client resolver stack architecture', () => {
	it('keeps the client implementation in the original files', () => {
		expect(readdirSync(clientDirectory)
			.filter((fileName) => !fileName.endsWith('.spec.ts'))
			.toSorted()).toEqual([
			'$client.svelte.ts',
			'$e2eProbe.ts',
			'$e2eTrace.ts',
			'$proxy.svelte.ts',
			'$subscribe.svelte.ts',
		])
	})

	it('keeps loaded-subset completion owned by the persisted collection', () => {
		expect(source('$client.svelte.ts')).toMatch(/PersistedCollectionLoadedSubset/)
		expect(source('$client.svelte.ts')).toMatch(/metadata\?\.collection\.set/)
		expect(source('$client.svelte.ts')).not.toMatch(/sourceExecutions|SourceExecution|localOnlyCollectionOptions|queryCollectionOptions/)
		expect(source('$subscribe.svelte.ts')).not.toMatch(/LoadedSubset|loadedSubsets|rowCount|sourceRowCounts|metadata\.collection|persistedCollectionOptions|queryCollectionOptions/)
	})

	it('keeps E2E tracing isolated from the production client', () => {
		expect(source('$client.svelte.ts')).not.toMatch(/__blockhead|PersistenceTrace|trace:/)
		expect(source('$subscribe.svelte.ts')).not.toMatch(/__blockhead|PersistenceTrace|trace:/)
		expect(source('$e2eProbe.ts')).toMatch(/__blockheadClientProbe/)
		expect(source('$e2eProbe.ts')).toMatch(/PersistenceTraceEvent/)
		expect(source('$e2eTrace.ts')).toMatch(/traceE2ECollections/)
	})

	it('keeps Persisted collection query functions from using hydrated rows for the persistence gate', () => {
		const clientSource = source('$client.svelte.ts')
		for (const queryFunction of [
			'loadEntityRows',
			'loadFieldRows',
			'loadCountRows',
		]) {
			const start = clientSource.indexOf(`const ${queryFunction}`)
			expect(start).toBeGreaterThanOrEqual(0)
			const nextConst = clientSource.indexOf('\nconst ', start + 1)
			const nextExport = clientSource.indexOf('\nexport const ', start + 1)
			const body = clientSource.slice(
				start,
				Math.min(
					...[
						nextConst,
						nextExport,
					].filter((index) => index >= 0)
				)
			)
			expect(body).not.toMatch(/collection\.toArray|collection\.values|collection\.size|collection\.has/)
		}
	})

	it('distinguishes remote, fresh query-cache-empty hydrated-rows, and loaded-marker outcomes', () => {
		const remote = persistedCollectionHydrationPlan(
			'counts',
			'network',
			undefined,
			[],
			['source-a']
		)
		expect(remote).toMatchObject({
			decision: CollectionLoadDecision.Remote,
			missReason: 'missing-marker',
			remoteSources: ['source-a'],
		})
		expect(persistedCollectionHydrationPlan(
			'counts',
			'network',
			{
				collectionId: 'counts',
				loadedKey: 'network',
				rowCount: 1,
				sourceRowCounts: {
					'source-a': 0,
				},
			},
			[],
			['source-a']
		)).toMatchObject({
			decision: CollectionLoadDecision.Remote,
			missReason: 'missing-marker',
			remoteSources: ['source-a'],
		})

		const hydratedRow = {
			key: 'count',
			[EntityMetaKey.Source]: 'source-a',
		}
		const completedRows = persistedCollectionRemoteResult({
			collectionId: 'counts',
			loadedKey: 'network',
			persistedRows: [],
			loaded: {
				rows: [hydratedRow],
				outcomes: [{
					source: 'source-a',
					status: PersistedCollectionSourceStatus.Completed,
				}],
			},
			remoteSources: ['source-a'],
			requestedSources: ['source-a'],
			getKey: (row) => row.key,
		})
		expect(persistedCollectionHydrationPlan(
			'counts',
			'network',
			completedRows.nextMarker,
			completedRows.rows,
			['source-a']
		)).toMatchObject({
			decision: CollectionLoadDecision.HydratedRows,
			remoteSources: [],
		})

		const completedEmpty = persistedCollectionRemoteResult({
			collectionId: 'fields',
			loadedKey: 'network',
			persistedRows: [],
			loaded: {
				rows: [],
				outcomes: [{
					source: 'source-a',
					status: PersistedCollectionSourceStatus.Completed,
				}],
			},
			remoteSources: ['source-a'],
			requestedSources: ['source-a'],
			getKey: (row) => row[EntityMetaKey.Source],
		})
		expect(completedEmpty.nextMarker).toEqual({
			collectionId: 'fields',
			loadedKey: 'network',
			rowCount: 0,
			sourceRowCounts: {
				'source-a': 0,
			},
		})
		expect(persistedCollectionHydrationPlan(
			'fields',
			'network',
			completedEmpty.nextMarker,
			[],
			['source-a']
		)).toMatchObject({
			decision: CollectionLoadDecision.LoadedMarker,
			remoteSources: [],
		})

		const emptyRows = completedRows.rows.slice(0, 0)
		const unaccountedEmpty = persistedCollectionRemoteResult({
			collectionId: 'fields',
			loadedKey: 'network',
			persistedRows: emptyRows,
			loaded: {
				rows: emptyRows,
				outcomes: [],
			},
			remoteSources: ['source-a'],
			requestedSources: ['source-a'],
			getKey: (row) => row.key,
		})
		expect(unaccountedEmpty.failedOutcomes).toEqual([{
			source: 'source-a',
			status: PersistedCollectionSourceStatus.Failed,
			error: 'fields did not account for source source-a',
		}])
		expect(persistedCollectionHydrationPlan(
			'fields',
			'network',
			unaccountedEmpty.nextMarker,
			unaccountedEmpty.rows,
			['source-a']
		)).toMatchObject({
			decision: CollectionLoadDecision.Remote,
			missReason: 'missing-source:source-a',
			remoteSources: ['source-a'],
		})
	})

	it('round-trips asynchronously persisted row and zero-row loaded markers', async () => {
		const collectionRowsByCollectionId = new Map<string, Map<string | number, object>>()
		const collectionMetadataByCollectionId = new Map<string, Map<string, string>>()
		const persistence = {
			adapter: {
				loadSubset: async (collectionId) => [
					...(collectionRowsByCollectionId.get(collectionId) ?? new Map()),
				].map(([key, value]) => ({
					key,
					value,
				})),
				applyCommittedTx: async (collectionId, transaction) => {
					await new Promise((resolve) => setTimeout(resolve, 50))
					const collectionRows = collectionRowsByCollectionId.get(collectionId) ?? new Map()
					for (const mutation of transaction.mutations) {
						if (mutation.type === 'delete')
							collectionRows.delete(mutation.key)
						else
							collectionRows.set(mutation.key, mutation.value)
					}
					collectionRowsByCollectionId.set(collectionId, collectionRows)
					const collectionMetadata = collectionMetadataByCollectionId.get(collectionId) ?? new Map()
					for (const mutation of transaction.collectionMetadataMutations ?? []) {
						if (mutation.type === 'delete')
							collectionMetadata.delete(mutation.key)
						else
							collectionMetadata.set(mutation.key, JSON.stringify(mutation.value))
					}
					collectionMetadataByCollectionId.set(collectionId, collectionMetadata)
				},
				loadCollectionMetadata: async (collectionId) => [
					...(collectionMetadataByCollectionId.get(collectionId) ?? new Map()),
				].map(([key, value]) => ({
					key,
					value: JSON.parse(value),
				})),
				ensureIndex: async () => {},
			} satisfies PersistenceAdapter,
		}
		const fixtureSchema = [
			entity({
				entityType: 'PersistenceFixture',
				labels: {
					singular: 'Persistence fixture',
					plural: 'Persistence fixtures',
				},
			})({
				slug: {
					type: EntityFieldType.Primitive,
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.One,
				},
				items: {
					type: EntityFieldType.Primitive,
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.ZeroOrMany,
				},
			})({
				selectors: {
					Slug: ['slug'],
				},
			}),
		] as const
		const sourceProviders = [{
			provider: 'PersistenceFixture',
			label: 'Persistence fixture',
			sources: [{
				provider: 'PersistenceFixture',
				source: 'PersistenceFixture',
				label: 'Persistence fixture',
			}],
		}] as const
		const resolvers = [{
			source: 'PersistenceFixture',
			resolvers: [{
				entityType: 'PersistenceFixture',
				resolve: {
					Slug: async () => ({}),
				},
				projections: {
					items: () => [],
				},
			}],
		}] as const
		const createContext = () => client({
			schema: fixtureSchema,
			sourceProviders,
		})({
			resolvers,
			env: {},
		})({
			queryClient: new QueryClient(),
			persistence,
			schemaVersion: 1,
		})

		const cold = createContext()
		expect((await cold.select(
			'PersistenceFixture',
			{
				slug: 'fixture',
			}
		)({
			fields: {
				items: true,
			},
		})).fields.items.values).toEqual([])
		expect(cold.events).toContainEqual(expect.objectContaining({
			decision: CollectionLoadDecision.Remote,
			status: PersistedCollectionLoadStatus.Completed,
			rowCount: 0,
			sourceRowCounts: {
				PersistenceFixture: 0,
			},
		}))
		await expect.poll(() => cold.events.some((event) => (
			event.decision === CollectionLoadDecision.Remote
			&& event.status === PersistedCollectionLoadStatus.Completed
			&& event.rowCount === 1
			&& event.sourceRowCounts?.PersistenceFixture === 1
		))).toBe(true)
		expect(cold.events).toContainEqual(expect.objectContaining({
			decision: CollectionLoadDecision.Remote,
			status: PersistedCollectionLoadStatus.Completed,
			rowCount: 1,
			sourceRowCounts: {
				PersistenceFixture: 1,
			},
		}))
		expect([...collectionMetadataByCollectionId.values()]
			.flatMap((collectionMetadata) => [...collectionMetadata])
			.map(([key, value]) => [
				key,
				JSON.parse(value),
			]))
			.toContainEqual([
				expect.stringMatching(/^loadedSubset:1:/),
				expect.objectContaining({
				rowCount: 0,
				sourceRowCounts: {
					PersistenceFixture: 0,
				},
				}),
			])
		expect([...collectionMetadataByCollectionId.values()]
			.flatMap((collectionMetadata) => [...collectionMetadata])
			.map(([key, value]) => [
				key,
				JSON.parse(value),
			]))
			.toContainEqual([
				expect.stringMatching(/^loadedSubset:1:/),
				expect.objectContaining({
					rowCount: 1,
					sourceRowCounts: {
						PersistenceFixture: 1,
					},
				}),
			])

		const warm = createContext()
		expect((await warm.select(
			'PersistenceFixture',
			{
				slug: 'fixture',
			}
		)({
			fields: {
				items: true,
			},
		})).fields.items.values).toEqual([])
		expect(warm.events).toContainEqual(expect.objectContaining({
			decision: CollectionLoadDecision.LoadedMarker,
			status: PersistedCollectionLoadStatus.Completed,
			rowCount: 0,
			sourceRowCounts: {
				PersistenceFixture: 0,
			},
		}))
		await expect.poll(() => warm.events.some((event) => (
			event.decision === CollectionLoadDecision.HydratedRows
			&& event.status === PersistedCollectionLoadStatus.Completed
			&& event.rowCount === 1
			&& event.sourceRowCounts?.PersistenceFixture === 1
		))).toBe(true)
		expect(warm.events).toContainEqual(expect.objectContaining({
			decision: CollectionLoadDecision.HydratedRows,
			status: PersistedCollectionLoadStatus.Completed,
			rowCount: 1,
			sourceRowCounts: {
				PersistenceFixture: 1,
			},
		}))
	})

	it('replays incomplete persisted subsets and rejects implicit-source marker incompatibility', () => {
		const persistedRows = [
			{
				key: 'first',
				[EntityMetaKey.Source]: 'source-a',
			},
			{
				key: 'second',
				[EntityMetaKey.Source]: 'source-a',
			},
		]
		const completed = persistedCollectionRemoteResult({
			collectionId: 'fields',
			loadedKey: 'network',
			persistedRows: [],
			loaded: {
				rows: persistedRows,
				outcomes: [{
					source: 'source-a',
					status: PersistedCollectionSourceStatus.Completed,
				}],
			},
			remoteSources: ['source-a'],
			requestedSources: ['source-a'],
			getKey: (row) => row.key,
		})
		expect(persistedCollectionHydrationPlan(
			'fields',
			'network',
			completed.nextMarker,
			persistedRows.slice(0, 1),
			['source-a']
		)).toMatchObject({
			decision: CollectionLoadDecision.Remote,
			missReason: 'row-count-undercount:2:1',
			remoteSources: ['source-a'],
		})
		expect(persistedCollectionHydrationPlan(
			'fields',
			'network',
			completed.nextMarker,
			persistedRows,
			[
				'source-a',
				'source-b',
			]
		)).toMatchObject({
			decision: CollectionLoadDecision.Remote,
			missReason: 'missing-source:source-b',
			remoteSources: ['source-b'],
		})

		const implicitSources = persistedCollectionRemoteResult({
			collectionId: 'fields',
			loadedKey: 'network',
			persistedRows: [],
			loaded: {
				rows: [
					...persistedRows.slice(0, 1),
					{
						key: 'source-b',
						[EntityMetaKey.Source]: 'source-b',
					},
				],
				outcomes: [
					{
						source: 'source-a',
						status: PersistedCollectionSourceStatus.Completed,
					},
					{
						source: 'source-b',
						status: PersistedCollectionSourceStatus.Completed,
					},
				],
			},
			remoteSources: [
				'source-a',
				'source-b',
			],
			requestedSources: [
				'source-a',
				'source-b',
			],
			getKey: (row) => row.key,
		})
		expect(persistedCollectionHydrationPlan(
			'fields',
			'network',
			implicitSources.nextMarker,
			implicitSources.rows.filter((row) => row[EntityMetaKey.Source] === 'source-a'),
			['source-a']
		)).toMatchObject({
			decision: CollectionLoadDecision.HydratedRows,
			remoteSources: [],
		})
	})

	it('count refresh failure keeps hydrated rows while surfacing later errors', () => {
		const hydratedCount = {
			key: 'count',
			value: 7,
			[EntityMetaKey.Source]: 'source-a',
		}
		const failedRefresh = persistedCollectionRemoteResult({
			collectionId: 'counts',
			loadedKey: 'network',
			marker: {
				collectionId: 'counts',
				loadedKey: 'network',
				rowCount: 2,
				sourceRowCounts: {
					'source-a': 2,
				},
			},
			persistedRows: [hydratedCount],
			loaded: {
				rows: [],
				outcomes: [{
					source: 'source-a',
					status: PersistedCollectionSourceStatus.Failed,
					error: 'count refresh failed',
				}],
			},
			remoteSources: ['source-a'],
			requestedSources: ['source-a'],
			getKey: (row) => row.key,
		})
		expect(failedRefresh.rows).toEqual([hydratedCount])
		expect(failedRefresh.failedOutcomes).toEqual([{
			source: 'source-a',
			status: PersistedCollectionSourceStatus.Failed,
			error: 'count refresh failed',
		}])
		expect(failedRefresh.status).toBe(PersistedCollectionLoadStatus.Partial)
		expect(failedRefresh.nextMarker).toEqual({
			collectionId: 'counts',
			loadedKey: 'network',
			rowCount: 0,
			sourceRowCounts: {},
		})
		expect(source('$client.svelte.ts')).toMatch(/collectionLoadFailures\.add\(\{[\s\S]*sources: \[outcome\.source\]/)
	})

	it('keeps undefined snapshot completion gated by schema cardinality', () => {
		const clientSource = source('$client.svelte.ts')
		for (const queryFunction of [
			'loadFieldRows',
			'loadCountRows',
		]) {
			const start = clientSource.indexOf(`const ${queryFunction}`)
			expect(start).toBeGreaterThanOrEqual(0)
			const nextConst = clientSource.indexOf('\nconst ', start + 1)
			const body = clientSource.slice(
				start,
				nextConst
			)
			expect(body).toMatch(/if \(snapshot === undefined\)[\s\S]*fieldCanCompleteEmpty/)
			expect(body).not.toMatch(/snapshot (?:==|===) null/)
		}
	})

	it('keeps base fields flat and nested facet fields addressed', async () => {
		const fixtureSchema = [
			entity({
				entityType: 'SelectionFixture',
				labels: {
					singular: 'Selection fixture',
					plural: 'Selection fixtures',
				},
			})({
				slug: {
					type: EntityFieldType.Primitive,
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.One,
				},
				namespace: {
					type: EntityFieldType.Primitive,
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.One,
				},
				kind: {
					type: EntityFieldType.Primitive,
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.One,
				},
			})({
				selectors: {
					Slug: ['slug'],
				},
				facets: {
					Parent: facet({
						path: ['kind'],
						is: 'parent',
					})({
						parentKind: {
							type: EntityFieldType.Primitive,
							primitiveType: arktype('string'),
							cardinality: EntityFieldCardinality.One,
						},
					})({
						facets: {
							Child: facet({
								path: [
									'Parent',
									'parentKind',
								],
								is: 'child',
							})({
								childField: {
									type: EntityFieldType.Primitive,
									primitiveType: arktype('string'),
									cardinality: EntityFieldCardinality.One,
								},
							}),
						},
					}),
				},
			}),
		] as const
		const context = client({
			schema: fixtureSchema,
			sourceProviders: [],
		})({
			resolvers: [],
			env: {},
		})({
			queryClient: new QueryClient(),
			persistence: {
				adapter: {
					loadSubset: async () => [],
					applyCommittedTx: async () => {},
					ensureIndex: async () => {},
				} satisfies PersistenceAdapter,
			},
			schemaVersion: 1,
		})
		const selection = context.select(
			'SelectionFixture',
			{
				slug: 'fixture',
			}
		)
		const baseFieldResource = selection({
			fields: {
				namespace: true,
			},
		})
		const nestedFacetResource = selection({
			fields: {
				Parent: {
					fields: {
						Child: {
							fields: {
								childField: true,
							},
						},
					},
				},
			},
		})

		expect((await baseFieldResource).fields).toEqual({
			namespace: undefined,
		})
		expect((await nestedFacetResource).fields).toEqual({})
		expect((await nestedFacetResource).fieldValuesByAddress).toEqual({
			[entityFieldAddressKey('SelectionFixture', [
				'Parent',
				'Child',
			], 'childField')]: undefined,
		})
	})

	it('validates resolver field value shape before writing persisted field rows', () => {
		const clientSource = source('$client.svelte.ts')
		expect(clientSource).toMatch(/returned non-array value for multiple-cardinality field/)
		expect(clientSource).toMatch(/returned array value for single-cardinality field/)
		expect(clientSource).toMatch(/entityFieldPrimitiveValueIsValid/)
		expect(clientSource).toMatch(/validateEntitySelector\(/)
		expect(clientSource).not.toMatch(/Array\.isArray\(value\) \?[\s\S]*:\s*\[value\]/)
	})

	it('keeps count rows are authoritative for paged and windowed list totals', () => {
		expect(source('$subscribe.svelte.ts')).not.toMatch(/totalCount:[^\n]*values\.length/)
		expect(source('$subscribe.svelte.ts')).not.toMatch(/loaded row length/)
	})

	it('keeps view-facing reads behind the proxy and subscribe files', () => {
		expect(source('$proxy.svelte.ts')).not.toMatch(/entityCollections|entityFieldCollections|queryCollectionOptions/)
		expect(source('$subscribe.svelte.ts')).not.toMatch(/queryCollectionOptions|persistedCollectionOptions/)
	})
})
