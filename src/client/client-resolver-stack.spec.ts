import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { QueryClient } from '@tanstack/query-core'
import {
	and,
	createLiveQueryCollection,
	eq,
} from '@tanstack/db'
import type { PersistenceAdapter } from '@tanstack/db-sqlite-persistence-core'
import { type as arktype } from 'arktype'
import { stringify } from 'devalue'
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
	entityResolverSourcesForSelectorKeys,
	localMutationAuthorityKey,
	persistedCollectionAppendResult,
	persistedCollectionHydrationPlan,
	persistedCollectionRemoteResult,
	trackPersistedCollectionPersistence,
} from '$/client/$client.svelte.ts'
import { writeLocalBlockheadAccount } from '$/collections/localMutations.ts'
import {
	materializeResolverOutput,
	ResolverOutputMaterialization,
} from '$/collections/assertLoadedCollectionRows.ts'
import {
	subscribeEntity,
	subscribeEntityField,
	subscribeEntityFieldCount,
} from '$/client/$subscribe.svelte.ts'
import {
	createEntityProxy,
	EntityProxyField,
} from '$/client/$proxy.svelte.ts'
import type {
	ResolverContext,
	SourceResolverModule,
} from '$/resolvers/$resolvers.ts'
import {
	EntityMetaKey,
	entity,
	entityFieldAddressKey,
	entitySelectorKey,
	facet,
	indexSchema,
	ProjectionResolution,
} from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import {
	sourceBindings,
	sourceProviders,
} from '$/sources/index.ts'
import {
	sourceBindingId,
	SourceDelivery,
} from '$/sources/SourceBinding.ts'


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

const testSourceIndex = <const _Source extends string>(sources: readonly _Source[]) => ({
	enabledBindingIds: new Set<string>(),
	enabledSources: new Set(sources),
	resolverPublicEnvBySource: new Map(sources.map((source) => [source, {}])),
})

const materializationFixtureSchema = [
	entity({
		entityType: 'MaterializationParent',
		labels: {
			singular: 'Materialization parent',
			plural: 'Materialization parents',
		},
	})({
		slug: {
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.One,
		},
		values: {
			primitiveType: arktype('number'),
			cardinality: EntityFieldCardinality.Many,
		},
		$$children: {
			entityType: 'MaterializationChild',
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		converted: {
			primitiveType: arktype('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
	})({
		selectors: {
			Slug: ['slug'],
		},
	}),
	entity({
		entityType: 'MaterializationChild',
		labels: {
			singular: 'Materialization child',
			plural: 'Materialization children',
		},
	})({
		id: {
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.One,
		},
		title: {
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		kind: {
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.One,
		},
		$sibling: {
			entityType: 'MaterializationChild',
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	})({
		selectors: {
			Id: ['id'],
		},
		facets: {
			Left: facet({
				path: ['kind'],
				is: 'left',
			})({
				label: {
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.ZeroOrOne,
				},
			}),
			Right: facet({
				path: ['kind'],
				is: 'right',
			})({
				label: {
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.ZeroOrOne,
				},
			}),
		},
	}),
] as const

const materializationFixtureSchemaIndex = indexSchema(materializationFixtureSchema)

const materializationParentSelector = { slug: 'parent' }
const materializationParentSelectorKey = entitySelectorKey(
	materializationFixtureSchema,
	materializationFixtureSchema[0],
	materializationParentSelector
)


describe('client resolver stack architecture', () => {
	it('keeps the client implementation in the original files', () => {
		expect(readdirSync(clientDirectory)
			.filter((fileName) => (
				!fileName.endsWith('.spec.ts')
				&& !fileName.endsWith('.test.ts')
				&& !fileName.endsWith('.types.ts')
			))
			.toSorted()).toEqual([
			'$client.svelte.ts',
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
		const productionLayoutSource = readFileSync(
			resolve(
				process.cwd(),
				'src/routes/+layout.svelte'
			),
			'utf8'
		)
		const applicationBootstrapSource = readFileSync(
			resolve(
				process.cwd(),
				'src/routes/ApplicationBootstrap.svelte'
			),
			'utf8'
		)

		expect(source('$client.svelte.ts')).not.toMatch(/__blockhead|PersistenceTrace|trace:/)
		expect(source('$client.svelte.ts')).not.toMatch(/\bindexSourceProviders\b/)
		expect(source('$client.svelte.ts')).toMatch(/enabledBindingIds\.has\(sourceBindingId\(sourceBinding\)\)/)
		expect(source('$subscribe.svelte.ts')).not.toMatch(/__blockhead|PersistenceTrace|trace:/)
		expect(productionLayoutSource).not.toMatch(/\$e2eProbe|E2E|__blockhead/)
		expect(productionLayoutSource).toMatch(/openBrowserWASQLiteOPFSDatabase/)
		expect(productionLayoutSource).toMatch(/createBrowserWASQLitePersistence/)
		expect(productionLayoutSource.indexOf('await import.meta.hot?.data.databaseClose')).toBeLessThan(
			productionLayoutSource.indexOf('return openBrowserWASQLiteOPFSDatabase')
		)
		expect(productionLayoutSource).toMatch(/data\.databaseClose = closeDatabase\(\)/)
		expect(productionLayoutSource).toMatch(/const closeDatabase = databaseCloseWhenReady\(databasePromise\)/)
		expect(productionLayoutSource).toMatch(/const applicationRuntime = applicationRuntimeWhenReady\([\s\S]*?bootstrap,[\s\S]*?mountWalletConnectionRuntime\(appClient\)/)
		expect(productionLayoutSource).toMatch(/export const getAppClient = \(\) => \{[\s\S]*?if \(appClient == null\)[\s\S]*?throw new Error\('App client was read before bootstrap completed'\)[\s\S]*?return appClient/)
		expect(productionLayoutSource).not.toMatch(/export (?:const|let) appClient/)
		expect(productionLayoutSource).not.toMatch(/bootstrap\.then\([\s\S]*?\.catch\(\(\) => \{\}\)/)
		expect(productionLayoutSource).toMatch(/sourceRuntimeCapabilities\(\)[\s\S]*?const sourceIndex = indexSourceProviders\(/)
		expect(productionLayoutSource.match(/\bindexSourceProviders\(/g)).toHaveLength(1)
		expect(productionLayoutSource).toMatch(/resolvers: await loadResolvers\(sourceIndex\.enabledSources\)/)
		expect(productionLayoutSource).toMatch(/\bsourceIndex,\n\s*\}/)
		expect(productionLayoutSource).toMatch(/const bootstrap = Promise\.all\(\[/)
		expect(productionLayoutSource).toMatch(/export const select: AppClient\['select'\] = \(\.\.\.parameters\) => getAppClient\(\)\.select\(\.\.\.parameters\)/)
		expect(productionLayoutSource).toMatch(/<ApplicationBootstrap[\s\S]*?ready=\{applicationRuntime\.ready\}[\s\S]*?\{children\}[\s\S]*?\/>/)
		expect(productionLayoutSource).not.toMatch(/<ApplicationBootstrap[^>]*>[\s\S]*?\{@render children\(\)\}[\s\S]*?<\/ApplicationBootstrap>/)
		expect(applicationBootstrapSource).toMatch(/\{#await ready\}[\s\S]*?Loading\.\.\.[\s\S]*?\{:then\}[\s\S]*?\{@render children\(\)\}[\s\S]*?\{:catch error\}/)
		expect(applicationBootstrapSource).toMatch(/boundaryKey="ApplicationBootstrap"[\s\S]*?failure=\{\{[\s\S]*?error,/)
		expect(productionLayoutSource).not.toMatch(/temporary|inMemory|memoryPersistence|installAppClientProbe/)
	})

	it('validates live resolvers against enabled bindings only', () => {
		const dydxHttpBinding = sourceBindings.find((binding) => (
			binding.source === Source.DydxIndexer
			&& binding.delivery === SourceDelivery.HttpProxy
		))
		if (dydxHttpBinding == null)
			throw new Error('dYdX HTTP binding missing')

		expect(() => client({
			schema: materializationFixtureSchema,
			sourceProviders,
		})({
			resolvers: [{
				source: Source.DydxIndexer,
				resolvers: [{
					entityType: 'MaterializationParent',
					resolve: {
						Slug: {
							resolve: async () => ({}),
						},
					},
					resolveLive: {
						converted: {
							facetPath: [],
							publishes: {
								converted: true,
							},
							start: () => () => {},
						},
					},
					projections: {
						converted: () => 1n,
					},
				}],
			}],
			sourceIndex: {
				enabledBindingIds: new Set([sourceBindingId(dydxHttpBinding)]),
				enabledSources: new Set([Source.DydxIndexer]),
				resolverPublicEnvBySource: new Map([[Source.DydxIndexer, {}]]),
			},
		})({
			queryClient: new QueryClient(),
			persistence: {
				adapter: {
					applyCommittedTx: async () => {},
					ensureIndex: async () => {},
					loadSubset: async () => [],
				},
			},
			schemaVersion: 1,
		})).toThrow('DydxIndexer declares resolveLive without a RemoteLive source binding')
	})

	it('serializes persisted collection commits before reporting durability', async () => {
		const transitions: string[] = []
		let releaseFirstCommit = () => {}
		const firstCommitGate = new Promise<void>((resolve) => {
			releaseFirstCommit = resolve
		})
		let releaseBarrierCommit = () => {}
		const barrierCommitGate = new Promise<void>((resolve) => {
			releaseBarrierCommit = resolve
		})
		let releaseFutureCommit = () => {}
		const futureCommitGate = new Promise<void>((resolve) => {
			releaseFutureCommit = resolve
		})
		const transaction = (txId: string) => ({
			txId,
			term: 1,
			seq: 1,
			rowVersion: 1,
			mutations: [],
		})
		const {
			persistence,
			waitForPersistence,
		} = trackPersistedCollectionPersistence({
			adapter: {
				applyCommittedTx: async (
					collectionId,
					committedTransaction
				) => {
					transitions.push(`start:${collectionId}`)
					if (committedTransaction.txId === 'first')
						await firstCommitGate
					if (committedTransaction.txId === 'barrier')
						await barrierCommitGate
					if (committedTransaction.txId === 'future')
						await futureCommitGate
					transitions.push(`done:${collectionId}`)
				},
				ensureIndex: async () => {},
				loadSubset: async () => [],
			} satisfies PersistenceAdapter,
		})

		const firstCommit = persistence.adapter.applyCommittedTx('first', transaction('first'))
		const secondCommit = persistence.adapter.applyCommittedTx('second', transaction('second'))
		await Promise.resolve()
		expect(transitions).toEqual(['start:first'])

		releaseFirstCommit()
		await Promise.all([
			firstCommit,
			secondCommit,
			waitForPersistence('first'),
			waitForPersistence('second'),
		])
		expect(transitions).toEqual([
			'start:first',
			'done:first',
			'start:second',
			'done:second',
		])

		let lateCommitDone = false
		const lateCommit = new Promise<void>((resolve, reject) => {
			setTimeout(() => {
				void persistence.adapter.applyCommittedTx(
					'late',
					transaction('late')
				).then(() => {
					lateCommitDone = true
					resolve()
				}, reject)
			})
		})
		await waitForPersistence('late')
		expect(lateCommitDone).toBe(true)
		await lateCommit

		const barrierCommit = persistence.adapter.applyCommittedTx(
			'shared',
			transaction('barrier')
		)
		const sharedBarrier = waitForPersistence('shared')
		await new Promise<void>((resolve) => setTimeout(resolve))
		let futureCommitDone = false
		const futureCommit = persistence.adapter.applyCommittedTx(
			'shared',
			transaction('future')
		).then(() => {
			futureCommitDone = true
		})
		releaseBarrierCommit()
		await sharedBarrier
		expect(futureCommitDone).toBe(false)
		releaseFutureCommit()
		await Promise.all([
			barrierCommit,
			futureCommit,
		])
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
			continuationBySource: {},
			loadedKey: 'network',
			rowCount: 0,
			sourceRowCounts: {
				'source-a': 0,
			},
			sourceRowKeys: {
				'source-a': [],
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

		const continued = persistedCollectionRemoteResult({
			collectionId: 'fields',
			loadedKey: 'network',
			persistedRows: [],
			loaded: {
				rows: [hydratedRow],
				outcomes: [{
					source: 'source-a',
					status: PersistedCollectionSourceStatus.Completed,
					continuation: {
						operation: 'listing',
						target: 'community',
						viewerScope: 'anonymous',
						terminal: false,
						token: 'opaque-token',
					},
				}],
			},
			remoteSources: ['source-a'],
			requestedSources: ['source-a'],
			getKey: (row) => row.key,
		})
		expect(continued.nextMarker.continuationBySource).toEqual({
			'source-a': {
				operation: 'listing',
				target: 'community',
				viewerScope: 'anonymous',
				terminal: false,
				token: 'opaque-token',
			},
		})
		const failedContinuation = persistedCollectionRemoteResult({
			collectionId: 'fields',
			loadedKey: 'network',
			marker: continued.nextMarker,
			persistedRows: continued.rows,
			loaded: {
				rows: [],
				outcomes: [{
					source: 'source-a',
					status: PersistedCollectionSourceStatus.Failed,
					error: 'expired token',
				}],
			},
			remoteSources: ['source-a'],
			requestedSources: ['source-a'],
			getKey: (row) => row.key,
		})
		expect(failedContinuation.rows).toEqual(continued.rows)
		expect(failedContinuation.nextMarker).toEqual(continued.nextMarker)
		expect(failedContinuation.failedOutcomes).toEqual([{
			source: 'source-a',
			status: PersistedCollectionSourceStatus.Failed,
			error: 'expired token',
		}])

		const appended = persistedCollectionAppendResult({
			collectionId: 'fields',
			loadedKey: 'network',
			marker: continued.nextMarker,
			persistedRows: [
				{
					...hydratedRow,
					title: 'First page',
					valueIndex: 0,
				},
				{
					key: 'sibling',
					[EntityMetaKey.Source]: 'source-b',
					valueIndex: 0,
				},
			],
			loaded: {
				rows: [
					{
						...hydratedRow,
						title: 'Second-page update',
						valueIndex: 0,
					},
					{
						key: 'next',
						[EntityMetaKey.Source]: 'source-a',
						valueIndex: 1,
					},
				],
				outcomes: [{
					source: 'source-a',
					status: PersistedCollectionSourceStatus.Completed,
					continuation: {
						operation: 'listing',
						target: 'community',
						viewerScope: 'anonymous',
						terminal: true,
					},
				}],
			},
			source: 'source-a',
			getKey: (row) => `${row[EntityMetaKey.Source]}:${row.key}:${row.valueIndex}`,
			getValueIdentity: (row) => row.key,
			setValueIndex: (row, valueIndex) => ({
				...row,
				valueIndex,
			}),
		})
		expect(appended.rows).toEqual([
			{
				key: 'sibling',
				[EntityMetaKey.Source]: 'source-b',
				valueIndex: 0,
			},
			{
				...hydratedRow,
				title: 'Second-page update',
				valueIndex: 0,
			},
			{
				key: 'next',
				[EntityMetaKey.Source]: 'source-a',
				valueIndex: 1,
			},
		])
		expect(appended.nextMarker.continuationBySource).toEqual({
			'source-a': {
				operation: 'listing',
				target: 'community',
				viewerScope: 'anonymous',
				terminal: true,
			},
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

	it('reconciles persisted field and count rows through partial, live, refresh, and malformed replay', async () => {
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
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.One,
				},
				items: {
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
			sources: {
				'source-a': {
					label: 'Source A',
				},
				'source-b': {
					label: 'Source B',
				},
			},
			bindings: {},
		}] as const
		let sourceAValues = ['a']
		let sourceACount = 1
		let sourceBValues = ['b']
		let sourceBCount = 1
		let sourceBFailure = true
		let sourceASubsetRefresh = false
		let sourceAResolveBlocker: Promise<void> | undefined
		let replaceLiveValues = (_values: readonly string[]) => {
			throw new Error('live field publisher not mounted')
		}
		let replaceLiveCount = (_count: number) => {
			throw new Error('live count publisher not mounted')
		}
		let invalidateLive = () => {
			throw new Error('live publisher not mounted')
		}
		let invalidateLiveValues = () => {
			throw new Error('live field publisher not mounted')
		}
		const resolvers = [
			{
				source: 'source-a',
				resolvers: [{
					entityType: 'PersistenceFixture',
					resolve: {
						Slug: {
							resolve: async () => {
								const snapshot = {
									count: sourceACount,
									values: sourceAValues,
								}
								const resolveBlocker = sourceAResolveBlocker
								sourceAResolveBlocker = undefined
								await resolveBlocker
								return snapshot
							},
						},
					},
					resolveLive: {
						items: {
							facetPath: [],
							publishes: {
								items: true,
							},
							start: ({ fields }) => {
								replaceLiveValues = (values) => fields.items.replaceRows([{
									source: 'source-a',
									value: values,
								}])
								replaceLiveCount = (count) => fields.items.count.replaceRows([{
									source: 'source-a',
									value: count,
								}])
								invalidateLiveValues = fields.items.invalidate
								invalidateLive = () => {
									fields.items.invalidate()
									fields.items.count.invalidate()
								}
							},
						},
					},
					projections: {
						items: {
							select: (snapshot, _selector, context) => {
								if (sourceASubsetRefresh && context.sorts[0]?.direction === 'asc')
									return []

								if (sourceASubsetRefresh && context.sorts[0]?.direction === 'desc')
									throw new Error('source-a descending subset failed')

								return snapshot.values
							},
							resolveCount: (snapshot) => snapshot.count,
						},
					},
				}],
			},
			{
				source: 'source-b',
				resolvers: [{
					entityType: 'PersistenceFixture',
					resolve: {
						Slug: {
							resolve: async () => ({}),
						},
					},
					projections: {
						items: {
							select: () => {
								if (sourceBFailure)
									throw new Error('source-b field failed')

								return sourceBValues
							},
							resolveCount: () => {
								if (sourceBFailure)
									throw new Error('source-b count failed')

								return sourceBCount
							},
						},
					},
				}],
			},
		] as const
		const createContext = () => client({
			schema: fixtureSchema,
			sourceProviders,
		})({
			resolvers,
			sourceIndex: testSourceIndex(['source-a', 'source-b']),
		})({
			queryClient: new QueryClient(),
			persistence,
			schemaVersion: 1,
		})
		const fieldAddressKey = entityFieldAddressKey('PersistenceFixture', [], 'items')

		const cold = createContext()
		expect((await cold.select(
			'PersistenceFixture',
			{
				slug: 'fixture',
			}
		)({
			fields: {
				items: {
					sources: [
						'source-a',
						'source-b',
					],
				},
			},
		})).fields.items).toMatchObject({
			values: ['a'],
		})
		await expect(cold.select(
			'PersistenceFixture',
			{
				slug: 'fixture',
			}
		).items.count({
			sources: [
				'source-a',
				'source-b',
			],
		})).resolves.toBe(1)
		const fieldCollectionId = cold.entityFieldCollections.PersistenceFixture[fieldAddressKey].id
		const countCollectionId = cold.entityFieldCountCollections.PersistenceFixture[fieldAddressKey]?.id
		if (countCollectionId === undefined)
			throw new Error('PersistenceFixture.items count collection missing')

		await expect.poll(() => cold.events.filter((event) => (
			event.collectionId === fieldCollectionId
			&& event.decision === CollectionLoadDecision.Remote
			&& event.status === PersistedCollectionLoadStatus.Partial
		))).toContainEqual(expect.objectContaining({
			rowCount: 1,
			sourceRowCounts: {
				'source-a': 1,
			},
		}))
		await expect.poll(() => cold.events.filter((event) => (
			event.collectionId === countCollectionId
			&& event.decision === CollectionLoadDecision.Remote
			&& event.status === PersistedCollectionLoadStatus.Partial
		))).toContainEqual(expect.objectContaining({
			rowCount: 1,
			sourceRowCounts: {
				'source-a': 1,
			},
		}))
		expect([...collectionRowsByCollectionId.get(fieldCollectionId)?.values() ?? []]).toHaveLength(1)
		expect([...collectionRowsByCollectionId.get(countCollectionId)?.values() ?? []]).toHaveLength(1)
		expect([...collectionMetadataByCollectionId.get(fieldCollectionId)?.values() ?? []].map(JSON.parse))
			.toContainEqual(expect.objectContaining({
				rowCount: 1,
				sourceRowCounts: {
					'source-a': 1,
				},
			}))

		sourceBFailure = false

		const warm = createContext()
		expect((await warm.select(
			'PersistenceFixture',
			{
				slug: 'fixture',
			}
		)({
			fields: {
				items: {
					sources: [
						'source-a',
						'source-b',
					],
				},
			},
		})).fields.items).toMatchObject({
			values: [
				'a',
				'b',
			],
		})
		await expect(warm.select(
			'PersistenceFixture',
			{
				slug: 'fixture',
			}
		).items.count({
			sources: [
				'source-a',
				'source-b',
			],
		})).resolves.toBe(1)
		await expect.poll(() => warm.events.filter((event) => (
			event.collectionId === fieldCollectionId
			&& event.decision === CollectionLoadDecision.Remote
			&& event.status === PersistedCollectionLoadStatus.Completed
		))).toContainEqual(expect.objectContaining({
			decision: CollectionLoadDecision.Remote,
			status: PersistedCollectionLoadStatus.Completed,
			rowCount: 2,
			sourceRowCounts: {
				'source-a': 1,
				'source-b': 1,
			},
		}))
		expect(warm.entityFieldCollections.PersistenceFixture[fieldAddressKey].toArray.map((row) => (
			row[EntityMetaKey.Value]
		))).toEqual([
			'a',
			'b',
		])
		await expect.poll(() => (
			warm.entityFieldCountCollections.PersistenceFixture[fieldAddressKey]?.toArray.length
		)).toBe(2)
		const warmFieldCollection = warm.entityFieldCollections.PersistenceFixture[fieldAddressKey]
		const warmCountCollection = warm.entityFieldCountCollections.PersistenceFixture[fieldAddressKey]
		if (warmCountCollection === undefined)
			throw new Error('PersistenceFixture.items count collection missing')

		const parentSelectorKey = stringify({
			slug: 'fixture',
		})
		const liveFieldQuery = createLiveQueryCollection({
			gcTime: 1,
			startSync: true,
			query: (query) => query
				.from({
					row: warmFieldCollection,
				})
				.where(({ row }) => eq(row[EntityMetaKey.ParentSelectorKey], parentSelectorKey)),
		})
		const liveCountQuery = createLiveQueryCollection({
			gcTime: 1,
			startSync: true,
			query: (query) => query
				.from({
					row: warmCountCollection,
				})
				.where(({ row }) => eq(row[EntityMetaKey.ParentSelectorKey], parentSelectorKey)),
		})
		const liveFieldSubscription = liveFieldQuery.subscribeChanges(() => {}, {
			includeInitialState: true,
		})
		const liveCountSubscription = liveCountQuery.subscribeChanges(() => {}, {
			includeInitialState: true,
		})
		await Promise.all([
			liveFieldQuery.preload(),
			liveCountQuery.preload(),
		])

		sourceAValues = [
			'live-a',
			'live-b',
		]
		sourceACount = 2
		replaceLiveValues(sourceAValues)
		replaceLiveCount(sourceACount)
		await expect.poll(() => (
			[...collectionRowsByCollectionId.get(fieldCollectionId)?.values() ?? []]
				.filter((row) => row[EntityMetaKey.Source] === 'source-a')
				.length
		)).toBe(2)
		expect([...collectionMetadataByCollectionId.get(fieldCollectionId)?.values() ?? []].map(JSON.parse))
			.toContainEqual(expect.objectContaining({
				sourceRowCounts: {
					'source-a': 1,
					'source-b': 1,
				},
			}))
		const completedFieldEventsBeforeLiveInvalidation = warm.events.filter((event) => (
			event.collectionId === fieldCollectionId
			&& event.status === PersistedCollectionLoadStatus.Completed
		)).length
		const completedCountEventsBeforeLiveInvalidation = warm.events.filter((event) => (
			event.collectionId === countCollectionId
			&& event.status === PersistedCollectionLoadStatus.Completed
		)).length
		invalidateLive()
		await expect.poll(() => (
			[...collectionMetadataByCollectionId.get(fieldCollectionId)?.values() ?? []]
				.map(JSON.parse)
				.some((marker) => marker.sourceRowCounts['source-a'] === 2)
		)).toBe(true)
		await expect.poll(() => warm.events.filter((event) => (
			event.collectionId === fieldCollectionId
			&& event.status === PersistedCollectionLoadStatus.Completed
		)).length).toBeGreaterThan(completedFieldEventsBeforeLiveInvalidation)
		await expect.poll(() => warm.events.filter((event) => (
			event.collectionId === countCollectionId
			&& event.status === PersistedCollectionLoadStatus.Completed
		)).length).toBeGreaterThan(completedCountEventsBeforeLiveInvalidation)
		await expect.poll(() => (
			[...collectionRowsByCollectionId.get(countCollectionId)?.values() ?? []]
				.some((row) => (
					row[EntityMetaKey.Source] === 'source-a'
					&& row[EntityMetaKey.Value] === 2
				))
		)).toBe(true)

		sourceAValues = ['overlap-stale']
		const overlapLoad = Promise.withResolvers<void>()
		sourceAResolveBlocker = overlapLoad.promise
		const overlapLoadingEventsBefore = warm.events.filter((event) => (
			event.collectionId === fieldCollectionId
			&& event.decision === CollectionLoadDecision.Remote
			&& event.status === PersistedCollectionLoadStatus.Loading
			&& event.reason === 'live invalidation'
		)).length
		invalidateLiveValues()
		await expect.poll(() => warm.events.filter((event) => (
			event.collectionId === fieldCollectionId
			&& event.decision === CollectionLoadDecision.Remote
			&& event.status === PersistedCollectionLoadStatus.Loading
			&& event.reason === 'live invalidation'
		)).length).toBeGreaterThan(overlapLoadingEventsBefore)
			const overlapKey = warm.events.filter((event) => (
				event.collectionId === fieldCollectionId
				&& event.decision === CollectionLoadDecision.Remote
				&& event.status === PersistedCollectionLoadStatus.Loading
				&& event.reason === 'live invalidation'
			))[overlapLoadingEventsBefore].key

		const overlapKeyLoadsBefore = warm.events.filter((event) => (
			event.collectionId === fieldCollectionId
			&& event.key === overlapKey
			&& event.decision === CollectionLoadDecision.Remote
			&& event.status === PersistedCollectionLoadStatus.Loading
		)).length
		expect(warmFieldCollection.isLoadingSubset).toBe(false)
		expect(warmFieldCollection.status).toBe('ready')
		expect(liveFieldSubscription.status).toBe('ready')

		sourceAValues = [
			'overlap-fresh-a',
			'overlap-fresh-b',
			'overlap-fresh-c',
		]
		invalidateLiveValues()
		invalidateLiveValues()
		warmFieldCollection.utils.refresh()
		expect(warm.events.filter((event) => (
			event.collectionId === fieldCollectionId
			&& event.key === overlapKey
			&& event.decision === CollectionLoadDecision.Remote
			&& event.status === PersistedCollectionLoadStatus.Loading
		))).toHaveLength(overlapKeyLoadsBefore)
		overlapLoad.resolve()

		await expect.poll(() => warm.events.filter((event) => (
			event.collectionId === fieldCollectionId
			&& event.key === overlapKey
			&& event.decision === CollectionLoadDecision.Remote
			&& event.status === PersistedCollectionLoadStatus.Loading
		)).length).toBe(overlapKeyLoadsBefore + 1)
		expect(liveFieldSubscription.status).toBe('ready')
		await expect.poll(() => (
			[...collectionMetadataByCollectionId.get(fieldCollectionId)?.values() ?? []]
				.map(JSON.parse)
				.find((marker) => marker.loadedKey === overlapKey)
				?.sourceRowCounts['source-a']
		)).toBe(3)
		const overlapMarker = [...collectionMetadataByCollectionId.get(fieldCollectionId)?.values() ?? []]
			.map(JSON.parse)
			.find((marker) => marker.loadedKey === overlapKey)
		expect(overlapMarker).toMatchObject({
				sourceRowCounts: {
					'source-a': 3,
					'source-b': 1,
				},
			})
		expect(overlapMarker.sourceRowKeys['source-a'].map((rowKey) => (
			collectionRowsByCollectionId.get(fieldCollectionId)?.get(rowKey)?.[EntityMetaKey.Value]
		))).toEqual(sourceAValues)

		sourceAValues = []
		sourceACount = 0
		sourceBFailure = true
		const partialFieldEventsBeforeEmptyInvalidation = warm.events.filter((event) => (
			event.collectionId === fieldCollectionId
			&& event.status === PersistedCollectionLoadStatus.Partial
		)).length
		const partialCountEventsBeforeEmptyInvalidation = warm.events.filter((event) => (
			event.collectionId === countCollectionId
			&& event.status === PersistedCollectionLoadStatus.Partial
		)).length
		invalidateLive()
		await expect.poll(() => warm.events.filter((event) => (
			event.collectionId === fieldCollectionId
			&& event.status === PersistedCollectionLoadStatus.Partial
		)).length).toBeGreaterThan(partialFieldEventsBeforeEmptyInvalidation)
		await expect.poll(() => warm.events.filter((event) => (
			event.collectionId === countCollectionId
			&& event.status === PersistedCollectionLoadStatus.Partial
		)).length).toBeGreaterThan(partialCountEventsBeforeEmptyInvalidation)
		await expect.poll(() => (
			[...collectionRowsByCollectionId.get(fieldCollectionId)?.values() ?? []]
				.filter((row) => row[EntityMetaKey.Source] === 'source-a')
				.length
		)).toBe(0)
		expect([...collectionRowsByCollectionId.get(fieldCollectionId)?.values() ?? []])
			.toContainEqual(expect.objectContaining({
				[EntityMetaKey.Source]: 'source-b',
				[EntityMetaKey.Value]: 'b',
			}))
		expect([...collectionRowsByCollectionId.get(countCollectionId)?.values() ?? []])
			.toEqual(expect.arrayContaining([
				expect.objectContaining({
					[EntityMetaKey.Source]: 'source-a',
					[EntityMetaKey.Value]: 0,
				}),
				expect.objectContaining({
					[EntityMetaKey.Source]: 'source-b',
					[EntityMetaKey.Value]: 1,
				}),
			]))
		expect([...collectionMetadataByCollectionId.get(fieldCollectionId)?.values() ?? []].map(JSON.parse))
			.toContainEqual(expect.objectContaining({
				sourceRowCounts: {
					'source-a': 0,
					'source-b': 1,
				},
			}))
		liveFieldSubscription.unsubscribe()
		liveCountSubscription.unsubscribe()

		sourceAValues = ['subset-shared']
		const ascendingSubsetContext = createContext()
		const descendingSubsetContext = createContext()
		const createSubsetQuery = (
			context: ReturnType<typeof createContext>,
			direction: 'asc' | 'desc'
		) => createLiveQueryCollection({
			gcTime: 1,
			startSync: true,
			query: (query) => query
				.from({
					row: context.entityFieldCollections.PersistenceFixture[fieldAddressKey],
				})
				.where(({ row }) => and(
					eq(row[EntityMetaKey.ParentSelectorKey], parentSelectorKey),
					eq(row[EntityMetaKey.Source], 'source-a'),
					eq(row[EntityMetaKey.Value], 'subset-shared')
				))
				.orderBy(({ row }) => row[EntityMetaKey.Value], direction)
				.limit(1),
		})
		const ascendingSubsetQuery = createSubsetQuery(ascendingSubsetContext, 'asc')
		const descendingSubsetQuery = createSubsetQuery(descendingSubsetContext, 'desc')
		const ascendingSubsetSubscription = ascendingSubsetQuery.subscribeChanges(() => {}, {
			includeInitialState: true,
		})
		const descendingSubsetSubscription = descendingSubsetQuery.subscribeChanges(() => {}, {
			includeInitialState: true,
		})
		await Promise.all([
			ascendingSubsetQuery.preload(),
			descendingSubsetQuery.preload(),
		])
		await expect.poll(() => (
			[...collectionRowsByCollectionId.get(fieldCollectionId)?.values() ?? []]
				.some((row) => row[EntityMetaKey.Value] === 'subset-shared')
		)).toBe(true)
		const sharedSubsetRow = [...collectionRowsByCollectionId.get(fieldCollectionId) ?? []]
			.find(([, row]) => row[EntityMetaKey.Value] === 'subset-shared')
		if (sharedSubsetRow === undefined)
			throw new Error('shared subset row did not persist')

		await expect.poll(() => (
			[...collectionMetadataByCollectionId.get(fieldCollectionId)?.values() ?? []]
				.map(JSON.parse)
				.filter((marker) => marker.sourceRowKeys['source-a']?.includes(sharedSubsetRow[0]))
				.length
		)).toBe(2)
		const malformedSharedSourceRowKey = stringify([
			'source-a',
			sharedSubsetRow[1][EntityMetaKey.ParentSelectorKey],
			'malformed',
			sharedSubsetRow[1].valueKey,
			sharedSubsetRow[1].valueIndex,
		])
		collectionRowsByCollectionId.get(fieldCollectionId)?.set(malformedSharedSourceRowKey, {
			...sharedSubsetRow[1],
			facetPathKey: 'malformed',
			fieldName: 'wrong-field',
		})
		const sharedSubsetMetadataKeys: string[] = []
		for (const [metadataKey, markerValue] of collectionMetadataByCollectionId.get(fieldCollectionId) ?? []) {
			const marker = JSON.parse(markerValue)
			if (!marker.sourceRowKeys['source-a']?.includes(sharedSubsetRow[0]))
				continue

			sharedSubsetMetadataKeys.push(metadataKey)
			collectionMetadataByCollectionId.get(fieldCollectionId)?.set(metadataKey, JSON.stringify({
				...marker,
				rowCount: marker.rowCount + 1,
				sourceRowCounts: {
					...marker.sourceRowCounts,
					'source-a': 2,
				},
				sourceRowKeys: {
					...marker.sourceRowKeys,
					'source-a': [
						sharedSubsetRow[0],
						malformedSharedSourceRowKey,
					],
				},
			}))
		}
		expect(sharedSubsetMetadataKeys).toHaveLength(2)
		sourceASubsetRefresh = true
		const ownershipSubsetContext = createContext()
		const ownershipSubsetQuery = createSubsetQuery(ownershipSubsetContext, 'asc')
		const ownershipSubsetSubscription = ownershipSubsetQuery.subscribeChanges(() => {}, {
			includeInitialState: true,
		})
		await ownershipSubsetQuery.preload()
		await expect.poll(() => (
			sharedSubsetMetadataKeys.map((metadataKey) => JSON.parse(
				collectionMetadataByCollectionId.get(fieldCollectionId)?.get(metadataKey) ?? 'null'
			).sourceRowKeys)
		)).toEqual(expect.arrayContaining([
			{
				'source-a': [],
			},
			{
				'source-a': [sharedSubsetRow[0]],
			},
		]))
		expect(collectionRowsByCollectionId.get(fieldCollectionId)?.has(malformedSharedSourceRowKey))
			.toBe(false)
		expect(collectionRowsByCollectionId.get(fieldCollectionId)?.get(sharedSubsetRow[0]))
			.toMatchObject({
				[EntityMetaKey.Source]: 'source-a',
				[EntityMetaKey.Value]: 'subset-shared',
			})
		const descendingPartialEvents = descendingSubsetContext.events.filter((event) => (
			event.collectionId === fieldCollectionId
			&& event.status === PersistedCollectionLoadStatus.Partial
		)).length
		descendingSubsetContext.entityFieldCollections.PersistenceFixture[fieldAddressKey].utils.refresh()
		await expect.poll(() => descendingSubsetContext.events.filter((event) => (
			event.collectionId === fieldCollectionId
			&& event.status === PersistedCollectionLoadStatus.Partial
		)).length).toBeGreaterThan(descendingPartialEvents)
		expect(collectionRowsByCollectionId.get(fieldCollectionId)?.get(sharedSubsetRow[0]))
			.toMatchObject({
				[EntityMetaKey.Source]: 'source-a',
				[EntityMetaKey.Value]: 'subset-shared',
			})
		ascendingSubsetSubscription.unsubscribe()
		descendingSubsetSubscription.unsubscribe()
		ownershipSubsetSubscription.unsubscribe()
		sourceASubsetRefresh = false
		sourceAValues = []

		const persistedSourceBField = [...collectionRowsByCollectionId.get(fieldCollectionId) ?? []]
			.find(([, row]) => row[EntityMetaKey.Source] === 'source-b')
		expect(persistedSourceBField).toBeDefined()
		if (persistedSourceBField !== undefined) {
			const duplicateValueKey = `Value:${stringify('duplicate')}`
			const duplicateRowKey = stringify([
				'source-b',
				persistedSourceBField[1][EntityMetaKey.ParentSelectorKey],
				persistedSourceBField[1].facetPathKey,
				duplicateValueKey,
				persistedSourceBField[1].valueIndex,
			])
			collectionRowsByCollectionId.get(fieldCollectionId)?.set(duplicateRowKey, {
				...persistedSourceBField[1],
				[EntityMetaKey.Value]: 'duplicate',
				valueKey: duplicateValueKey,
			})
			const sourceBMarkerMetadataKeys: string[] = []
			for (const [metadataKey, markerValue] of collectionMetadataByCollectionId.get(fieldCollectionId) ?? []) {
				const marker = JSON.parse(markerValue)
				if (!marker.sourceRowKeys['source-b']?.includes(persistedSourceBField[0]))
					continue

				sourceBMarkerMetadataKeys.push(metadataKey)
				collectionMetadataByCollectionId.get(fieldCollectionId)?.set(metadataKey, JSON.stringify({
					...marker,
					rowCount: marker.rowCount + 1,
					sourceRowCounts: {
						...marker.sourceRowCounts,
						'source-b': marker.sourceRowCounts['source-b'] + 1,
					},
					sourceRowKeys: {
						...marker.sourceRowKeys,
						'source-b': [
							...marker.sourceRowKeys['source-b'],
							duplicateRowKey,
						],
					},
				}))
			}
			expect(sourceBMarkerMetadataKeys.length).toBeGreaterThan(0)

			const duplicateReplay = createContext()
			void (await duplicateReplay.select(
				'PersistenceFixture',
				{
					slug: 'fixture',
				}
			)({
				fields: {
					items: {
						sources: [
							'source-a',
							'source-b',
						],
						},
					},
				})).fields.items
			await expect.poll(() => duplicateReplay.events.filter((event) => (
				event.collectionId === fieldCollectionId
			))).toContainEqual(expect.objectContaining({
				decision: CollectionLoadDecision.Remote,
				status: PersistedCollectionLoadStatus.Partial,
				reason: 'invalid-persisted-source:source-b',
			}))
			await expect.poll(() => (
				[...collectionRowsByCollectionId.get(fieldCollectionId)?.values() ?? []]
					.filter((row) => row[EntityMetaKey.Source] === 'source-b')
					.length
			)).toBe(0)

			const malformedRowKey = stringify([
				'source-b',
				persistedSourceBField[1][EntityMetaKey.ParentSelectorKey],
				'malformed',
				persistedSourceBField[1].valueKey,
				persistedSourceBField[1].valueIndex,
			])
			collectionRowsByCollectionId.get(fieldCollectionId)?.set(malformedRowKey, {
				...persistedSourceBField[1],
				facetPathKey: 'malformed',
				fieldName: 'wrong-field',
			})
			for (const metadataKey of sourceBMarkerMetadataKeys) {
				const markerValue = collectionMetadataByCollectionId.get(fieldCollectionId)?.get(metadataKey)
				if (markerValue === undefined)
					throw new Error('source-b loaded marker missing after duplicate replay')

				const marker = JSON.parse(markerValue)
				collectionMetadataByCollectionId.get(fieldCollectionId)?.set(metadataKey, JSON.stringify({
					...marker,
					rowCount: marker.rowCount + 1,
					sourceRowCounts: {
						...marker.sourceRowCounts,
						'source-b': 1,
					},
					sourceRowKeys: {
						...marker.sourceRowKeys,
						'source-b': [malformedRowKey],
					},
				}))
			}
		}
		const persistedSourceBCount = [...collectionRowsByCollectionId.get(countCollectionId) ?? []]
			.find(([, row]) => row[EntityMetaKey.Source] === 'source-b')
		expect(persistedSourceBCount).toBeDefined()
		if (persistedSourceBCount !== undefined) {
			const malformedCountRowKey = stringify([
				'source-b',
				persistedSourceBCount[1][EntityMetaKey.ParentSelectorKey],
				'malformed',
				persistedSourceBCount[1].filterKey,
			])
			collectionRowsByCollectionId.get(countCollectionId)?.delete(persistedSourceBCount[0])
			collectionRowsByCollectionId.get(countCollectionId)?.set(malformedCountRowKey, {
				...persistedSourceBCount[1],
				facetPathKey: 'malformed',
				fieldName: 'wrong-field',
			})
			for (const [metadataKey, markerValue] of collectionMetadataByCollectionId.get(countCollectionId) ?? []) {
				const marker = JSON.parse(markerValue)
				if (!marker.sourceRowKeys['source-b']?.includes(persistedSourceBCount[0]))
					continue

				collectionMetadataByCollectionId.get(countCollectionId)?.set(metadataKey, JSON.stringify({
					...marker,
					sourceRowKeys: {
						...marker.sourceRowKeys,
						'source-b': [malformedCountRowKey],
					},
				}))
			}
		}

		const malformedReplay = createContext()
		void (await malformedReplay.select(
			'PersistenceFixture',
			{
				slug: 'fixture',
			}
		)({
			fields: {
				items: {
					sources: [
						'source-a',
						'source-b',
					],
					},
				},
			})).fields.items
		void await malformedReplay.select(
			'PersistenceFixture',
			{
				slug: 'fixture',
			}
		).items.count({
			sources: [
				'source-a',
				'source-b',
			],
		})
		await expect.poll(() => malformedReplay.events.filter((event) => (
			event.collectionId === fieldCollectionId
		))).toContainEqual(expect.objectContaining({
			decision: CollectionLoadDecision.Remote,
			status: PersistedCollectionLoadStatus.Partial,
			reason: 'invalid-persisted-source:source-b',
			sourceRowCounts: {
				'source-a': 0,
			},
		}))
		await expect.poll(() => malformedReplay.events.filter((event) => (
			event.collectionId === countCollectionId
		))).toContainEqual(expect.objectContaining({
			decision: CollectionLoadDecision.Remote,
			status: PersistedCollectionLoadStatus.Partial,
			reason: 'invalid-persisted-source:source-b',
			sourceRowCounts: {
				'source-a': 1,
			},
		}))
		expect([...collectionRowsByCollectionId.get(fieldCollectionId)?.values() ?? []])
			.not.toContainEqual(expect.objectContaining({
				facetPathKey: 'malformed',
			}))
		expect([...collectionRowsByCollectionId.get(countCollectionId)?.values() ?? []])
			.not.toContainEqual(expect.objectContaining({
				facetPathKey: 'malformed',
			}))
		expect(malformedReplay.entityFieldCollections.PersistenceFixture[fieldAddressKey].toArray)
			.not.toContainEqual(expect.objectContaining({
				facetPathKey: 'malformed',
			}))
		expect(malformedReplay.entityFieldCollections.PersistenceFixture[fieldAddressKey].toArray)
			.toContainEqual(expect.objectContaining({
				[EntityMetaKey.Source]: 'source-a',
				[EntityMetaKey.Value]: 'subset-shared',
			}))
		expect(malformedReplay.entityFieldCountCollections.PersistenceFixture[fieldAddressKey]?.toArray)
			.not.toContainEqual(expect.objectContaining({
				facetPathKey: 'malformed',
			}))
		expect([...collectionMetadataByCollectionId.get(fieldCollectionId)?.values() ?? []].map(JSON.parse))
			.toContainEqual(expect.objectContaining({
				sourceRowCounts: {
					'source-a': 0,
				},
			}))
		expect([...collectionMetadataByCollectionId.get(countCollectionId)?.values() ?? []].map(JSON.parse))
			.toContainEqual(expect.objectContaining({
				sourceRowCounts: {
					'source-a': 1,
				},
			}))
	})

	it('retains completed source ownership across A to B to A subset loads', () => {
		const sourceA = persistedCollectionRemoteResult({
			collectionId: 'entities',
			loadedKey: 'shared-subset',
			persistedRows: [],
			loaded: {
				rows: [{
					[EntityMetaKey.Source]: 'source-a',
					value: 'a',
				}],
				outcomes: [{
					source: 'source-a',
					status: PersistedCollectionSourceStatus.Completed,
				}],
			},
			remoteSources: ['source-a'],
			requestedSources: ['source-a'],
			getKey: (row) => `${row[EntityMetaKey.Source]}:${row.value}`,
		})
		const sourceB = persistedCollectionRemoteResult({
			collectionId: 'entities',
			loadedKey: 'shared-subset',
			marker: sourceA.nextMarker,
			persistedRows: sourceA.rows,
			loaded: {
				rows: [{
					[EntityMetaKey.Source]: 'source-b',
					value: 'b',
				}],
				outcomes: [{
					source: 'source-b',
					status: PersistedCollectionSourceStatus.Completed,
				}],
			},
			remoteSources: ['source-b'],
			requestedSources: ['source-b'],
			getKey: (row) => `${row[EntityMetaKey.Source]}:${row.value}`,
		})

		expect(sourceB.nextMarker.sourceRowKeys).toEqual({
			'source-a': ['source-a:a'],
			'source-b': ['source-b:b'],
		})
		expect(persistedCollectionHydrationPlan(
			'entities',
			'shared-subset',
			sourceB.nextMarker,
			sourceA.rows,
			['source-a']
		)).toMatchObject({
			decision: CollectionLoadDecision.HydratedRows,
			remoteSources: [],
		})
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
			missReason: 'row-count-mismatch:2:1',
			remoteSources: ['source-a'],
		})
		expect(persistedCollectionHydrationPlan(
			'fields',
			'network',
			{
				...completed.nextMarker,
				rowCount: 1,
				sourceRowCounts: {
					'source-a': 1,
				},
				sourceRowKeys: {
					'source-a': ['first'],
				},
			},
			persistedRows,
			['source-a']
		)).toMatchObject({
			decision: CollectionLoadDecision.Remote,
			missReason: 'row-count-mismatch:1:2',
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

	it('atomically replaces successful source refreshes and preserves failed warm sources', () => {
		const hydratedCount = {
			key: 'count',
			value: 7,
			[EntityMetaKey.Source]: 'source-a',
		}
		const successfulEmptyRefresh = persistedCollectionRemoteResult({
			collectionId: 'counts',
			loadedKey: 'network',
			marker: {
				collectionId: 'counts',
				continuationBySource: {},
				loadedKey: 'network',
				rowCount: 1,
				sourceRowCounts: {
					'source-a': 1,
				},
				sourceRowKeys: {
					'source-a': ['count'],
				},
			},
			persistedRows: [hydratedCount],
			loaded: {
				rows: [],
				outcomes: [{
					source: 'source-a',
					status: PersistedCollectionSourceStatus.Completed,
				}],
			},
			remoteSources: ['source-a'],
			requestedSources: ['source-a'],
			getKey: (row) => row.key,
		})
		expect(successfulEmptyRefresh.rows).toEqual([])
		expect(successfulEmptyRefresh.nextMarker.sourceRowCounts).toEqual({
			'source-a': 0,
		})

		const failedRefresh = persistedCollectionRemoteResult({
			collectionId: 'counts',
			loadedKey: 'network',
			marker: {
				collectionId: 'counts',
				continuationBySource: {},
				loadedKey: 'network',
				rowCount: 1,
				sourceRowCounts: {
					'source-a': 1,
				},
				sourceRowKeys: {
					'source-a': ['count'],
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
			continuationBySource: {},
			loadedKey: 'network',
			rowCount: 1,
			sourceRowCounts: {
				'source-a': 1,
			},
			sourceRowKeys: {
				'source-a': ['count'],
			},
		})
		expect(source('$client.svelte.ts')).toMatch(/collectionLoadFailures\.add\(\{[\s\S]*sources: \[outcome\.source\]/)
		expect(source('$client.svelte.ts')).toMatch(/console\.error\([\s\S]*\[Blockhead collection-load-failure\]/)
		expect(source('$client.svelte.ts')).not.toMatch(/console\.warn\([^)]*partially failed/)
	})

	it('appends and cancels continuation pages within the exact relationship partition', async () => {
		const fixtureSchema = [
			entity({
				entityType: 'ContinuationParent',
				labels: {
					singular: 'Continuation parent',
					plural: 'Continuation parents',
				},
			})({
				slug: {
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.One,
				},
				$$children: {
					entityType: 'ContinuationChild',
					cardinality: EntityFieldCardinality.ZeroOrMany,
				},
			})({
				selectors: {
					Slug: ['slug'],
				},
			}),
			entity({
				entityType: 'ContinuationChild',
				labels: {
					singular: 'Continuation child',
					plural: 'Continuation children',
				},
			})({
				id: {
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.One,
				},
			})({
				selectors: {
					Id: ['id'],
				},
			}),
		] as const
		let releaseCancelledPage: (() => void) | undefined
		const persistedRowsByCollectionId = new Map<string, Map<string | number, object>>()
		const persistedMetadataByCollectionId = new Map<string, Map<string, string>>()
		const createContext = () => client({
			schema: fixtureSchema,
			sourceProviders: [{
				provider: 'continuation-provider',
				label: 'Continuation provider',
				sources: {
					'continuation-source': {
						label: 'Continuation source',
					},
				},
				bindings: {},
			}],
		})({
			resolvers: [{
				source: 'continuation-source',
				resolvers: [{
					entityType: 'ContinuationParent',
					resolve: {
						Slug: {
							resolve: async ({ slug }, resolverContext) => {
								if (resolverContext.providerContinuationToken === 'cancelled-page')
									await new Promise<void>((resolve) => {
										releaseCancelledPage = resolve
									})

								return {
									children: (
										resolverContext.providerContinuationToken === undefined ?
											[`${slug}-first`]
										:
											resolverContext.providerContinuationToken === 'next-page' ?
												[
													`${slug}-second`,
												]
											:
												[`${slug}-cancelled`]
									),
									next: (
										resolverContext.providerContinuationToken === undefined ?
											'next-page'
										:
											resolverContext.providerContinuationToken === 'next-page' ?
												'cancelled-page'
											:
												undefined
									),
								}
							},
						},
					},
					projections: {
						$$children: {
							select: ({ children }) => children.map((id) => ({
								[EntityMetaKey.Selector]: { id },
							})),
							continuation: ({ next }) => (
								next === undefined ?
									{
										operation: 'children',
										target: 'fixture',
										terminal: true,
									}
								:
									{
										operation: 'children',
										target: 'fixture',
										terminal: false,
										token: next,
									}
							),
						},
					},
				}],
			}] satisfies SourceResolverModule<typeof fixtureSchema, 'continuation-source', ResolverContext>[],
			sourceIndex: testSourceIndex(['continuation-source']),
		})({
			queryClient: new QueryClient(),
			persistence: {
				adapter: {
					loadSubset: async (collectionId) => [
						...(persistedRowsByCollectionId.get(collectionId) ?? new Map()),
					].map(([key, value]) => ({
						key,
						value,
					})),
					applyCommittedTx: async (collectionId, transaction) => {
						const persistedRows = persistedRowsByCollectionId.get(collectionId) ?? new Map()
						for (const mutation of transaction.mutations) {
							if (mutation.type === 'delete')
								persistedRows.delete(mutation.key)
							else
								persistedRows.set(mutation.key, mutation.value)
						}
						persistedRowsByCollectionId.set(collectionId, persistedRows)

						const persistedMetadata = persistedMetadataByCollectionId.get(collectionId) ?? new Map()
						for (const mutation of transaction.collectionMetadataMutations ?? []) {
							if (mutation.type === 'delete')
								persistedMetadata.delete(mutation.key)
							else
								persistedMetadata.set(mutation.key, JSON.stringify(mutation.value))
						}
						persistedMetadataByCollectionId.set(collectionId, persistedMetadata)
					},
					loadCollectionMetadata: async (collectionId) => [
						...(persistedMetadataByCollectionId.get(collectionId) ?? new Map()),
					].map(([key, value]) => ({
						key,
						value: JSON.parse(value),
					})),
					ensureIndex: async () => {},
				} satisfies PersistenceAdapter,
			},
			schemaVersion: 1,
		})
		const context = createContext()
		const firstResource = subscribeEntityField(
			context,
			'ContinuationParent',
			{ slug: 'first' },
			'$$children',
			{
				sources: ['continuation-source'],
			}
		)
		const secondResource = subscribeEntityField(
			context,
			'ContinuationParent',
			{ slug: 'second' },
			'$$children',
			{
				sources: ['continuation-source'],
			}
		)

		await expect.poll(() => firstResource.current?.entities.map((entity) => entity.entitySelector)).toEqual([
			{ id: 'first-first' },
		])
		await expect.poll(() => secondResource.current?.entities.map((entity) => entity.entitySelector)).toEqual([
			{ id: 'second-first' },
		])
		expect((await firstResource).continuation?.metadata).toMatchObject({
			terminal: false,
			token: 'next-page',
		})
		await firstResource.current?.continuation?.loadMore()
		await expect.poll(() => firstResource.current?.entities.map((entity) => entity.entitySelector)).toEqual([
			{ id: 'first-first' },
			{ id: 'first-second' },
		])
		expect(secondResource.current?.entities.map((entity) => entity.entitySelector)).toEqual([
			{ id: 'second-first' },
		])

		const restartedResource = subscribeEntityField(
			createContext(),
			'ContinuationParent',
			{ slug: 'first' },
			'$$children',
			{
				sources: ['continuation-source'],
			}
		)
		await expect.poll(() => restartedResource.current?.entities.map((entity) => entity.entitySelector)).toEqual([
			{ id: 'first-first' },
			{ id: 'first-second' },
		])
		const cancelledLoad = restartedResource.current?.continuation?.loadMore()
		await vi.waitFor(() => {
			expect(restartedResource.current?.continuation?.loading).toBe(true)
		})
		restartedResource.current?.continuation?.cancel()
		await expect(cancelledLoad).rejects.toMatchObject({
			name: 'AbortError',
		})
		releaseCancelledPage?.()
		await Promise.resolve()
		expect(restartedResource.current?.entities.map((entity) => entity.entitySelector)).toEqual([
			{ id: 'first-first' },
			{ id: 'first-second' },
		])
		expect(restartedResource.current?.continuation?.metadata).toMatchObject({
			terminal: false,
			token: 'cancelled-page',
		})
		expect((await restartedResource).entities.map((entity) => entity.entitySelector)).toEqual([
			{ id: 'first-first' },
			{ id: 'first-second' },
		])
	})

	it('rejects an entire malformed hydrated source and forces replay without preserving its marker', () => {
		const validSibling = {
			key: 'valid',
			[EntityMetaKey.Source]: 'source-a',
		}
		expect(persistedCollectionHydrationPlan(
			'fields',
			'network',
			{
				collectionId: 'fields',
				loadedKey: 'network',
				rowCount: 2,
				sourceRowCounts: {
					'source-a': 2,
				},
				sourceRowKeys: {
					'source-a': [
						'malformed-a',
						'malformed-b',
					],
				},
			},
			[],
			['source-a'],
			['source-a']
		)).toMatchObject({
			decision: CollectionLoadDecision.Remote,
			missReason: 'invalid-persisted-source:source-a',
			remoteSources: ['source-a'],
		})

		const failedReplay = persistedCollectionRemoteResult({
			collectionId: 'fields',
			loadedKey: 'network',
			marker: {
				collectionId: 'fields',
				continuationBySource: {},
				loadedKey: 'network',
				rowCount: 2,
				sourceRowCounts: {
					'source-a': 2,
				},
				sourceRowKeys: {
					'source-a': [
						'malformed-a',
						'malformed-b',
					],
				},
			},
			persistedRows: [],
			loaded: {
				rows: [validSibling],
				outcomes: [{
					source: 'source-a',
					status: PersistedCollectionSourceStatus.Failed,
					error: 'malformed source replay failed',
				}],
			},
			remoteSources: ['source-a'],
			requestedSources: ['source-a'],
			invalidSources: ['source-a'],
			getKey: (row) => row.key,
		})
		expect(failedReplay.rows).toEqual([])
		expect(failedReplay.nextMarker.sourceRowCounts).toEqual({})
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
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.One,
				},
				namespace: {
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.One,
				},
				value: {
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.One,
				},
				$child: {
					entityType: 'SelectionChildFixture',
					cardinality: EntityFieldCardinality.One,
				},
				$$children: {
					entityType: 'SelectionChildFixture',
					cardinality: EntityFieldCardinality.Many,
				},
				kind: {
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
							primitiveType: arktype('string'),
							cardinality: EntityFieldCardinality.One,
						},
						$parentChild: {
							entityType: 'SelectionChildFixture',
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
									primitiveType: arktype('string'),
									cardinality: EntityFieldCardinality.One,
								},
							}),
						},
					}),
					Other: facet({
						path: ['kind'],
						is: 'other',
					})({
						$otherChild: {
							entityType: 'SelectionChildFixture',
							cardinality: EntityFieldCardinality.One,
						},
					}),
				},
			}),
			entity({
				entityType: 'SelectionChildFixture',
				labels: {
					singular: 'Selection child fixture',
					plural: 'Selection child fixtures',
				},
			})({
				id: {
					primitiveType: arktype('bigint'),
					cardinality: EntityFieldCardinality.One,
				},
				label: {
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.One,
				},
				kind: {
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.One,
				},
				$owner: {
					entityType: 'SelectionFixture',
					cardinality: EntityFieldCardinality.One,
				},
			})({
				selectors: {
					Id: [
						'id',
						'$owner',
					],
				},
				facets: {
					Fixture: facet({
						path: ['kind'],
						is: 'fixture',
					})({
						$fixture: {
							entityType: 'SelectionFixture',
							cardinality: EntityFieldCardinality.One,
						},
					}),
				},
			}),
		] as const
		const context = client({
			schema: fixtureSchema,
			sourceProviders: [{
				provider: 'selection-fixture',
				label: 'Selection fixture',
				sources: {
					'selection-fixture': {
						label: 'Selection fixture',
					},
				},
				bindings: {},
			}],
		})({
			resolvers: [{
				source: 'selection-fixture',
				resolvers: [
					{
						entityType: 'SelectionFixture',
						resolve: {
							Slug: {
								resolve: async () => ({}),
							},
						},
						projections: {
							kind: () => 'parent',
							value: () => 'Loaded fixture',
							$child: () => ({
								[EntityMetaKey.Selector]: {
									id: 1n,
									$owner: {
										slug: 'fixture',
									},
								},
							}),
							$$children: () => [{
								[EntityMetaKey.Selector]: {
									id: 1n,
									$owner: {
										slug: 'fixture',
									},
								},
							}],
							Parent: {
								$parentChild: () => ({
									[EntityMetaKey.Selector]: {
										id: 1n,
										$owner: {
											slug: 'fixture',
										},
									},
								}),
							},
						},
					},
					{
						entityType: 'SelectionChildFixture',
						resolve: {
							Id: {
								resolve: async () => ({}),
							},
						},
						projections: {
							label: () => 'Loaded child',
							kind: () => 'fixture',
							Fixture: {
								$fixture: () => ({
									[EntityMetaKey.Selector]: {
										slug: 'fixture',
									},
								}),
							},
						},
					},
				],
			}],
			sourceIndex: testSourceIndex(['selection-fixture']),
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
		const nestedReferenceResource = selection({
			fields: {
				$child: {
					where: ({ row }) => eq(row[EntityMetaKey.Source], 'selection-fixture'),
					fields: {
						label: true,
					},
				},
				$$children: {
					fields: {
						label: true,
					},
				},
			},
		})
		const invalidFieldResource = selection(JSON.parse('{"fields":{"missing":true}}'))
		const invalidNestedFacetFieldResource = selection(JSON.parse('{"fields":{"Parent":{"fields":{"missing":true}}}}'))
		const invalidSiblingFacetFieldResource = selection(JSON.parse('{"fields":{"Parent":{"fields":{"namespace":true}}}}'))
		const invalidFacetResource = selection(JSON.parse('{"fields":{"Missing":{"fields":{}}}}'))
		const invalidReferenceFieldResource = selection(JSON.parse('{"fields":{"$child":{"fields":{"missing":true}}}}'))
		const selectedChildFieldResource = selection.$child({
			where: ({ row }) => eq(row[EntityMetaKey.Source], 'selection-fixture'),
			fields: {
				label: true,
			},
		})
		const selectedChildrenFieldResource = selection.$$children({
			fields: {
				label: true,
			},
		})
		const selectedFirstChildResource = selection.$$children.first({
			fields: {
				label: true,
			},
		})
		const selectedChildFromSelectedParentResource = nestedReferenceResource.$child({
			fields: {
				label: true,
			},
		})
		const selectedFixtureFromChildrenResource = selection.$$children.Fixture.$fixture({
			fields: {
				value: true,
			},
		})
		const selectedOwnerFromChildrenResource = selection.$$children.$owner({
			fields: {
				value: true,
			},
		})
		const reselectedOwnerFromChildrenResource = selection.$$children.$owner({
			sources: ['selection-fixture'],
		})({
			fields: {
				value: true,
			},
		})
		const selectedChildFromOwnerResource = selection.$$children.$owner.$child({
			fields: {
				label: true,
			},
		})
		const selectedFacetChildFromOwnerResource = selection.$$children.$owner.Parent.$parentChild({
			fields: {
				label: true,
			},
		})
		const ineligibleFacetChildFromOwnerResource = selection.$$children.$owner.Other.$otherChild({
			fields: {
				label: true,
			},
		})

		expect((await baseFieldResource).fields).toEqual({
			namespace: undefined,
		})
		expect((await nestedFacetResource).fields).toEqual({
			Parent: {
				fields: {
					Child: {
						fields: {
							childField: undefined,
						},
					},
				},
			},
		})
		expect((await nestedFacetResource).fieldValuesByAddress).toEqual({
			[entityFieldAddressKey('SelectionFixture', [
				'Parent',
				'Child',
			], 'childField')]: undefined,
		})
		expect((await nestedReferenceResource).fields.$child.label).toBe('Loaded child')
		expect((await nestedReferenceResource).fields.$$children.values[0]?.label).toBe('Loaded child')
		expect((await selectedChildFieldResource).label).toBe('Loaded child')
		expect((await selectedChildrenFieldResource).values[0]?.label).toBe('Loaded child')
		expect((await selectedFirstChildResource)?.label).toBe('Loaded child')
		expect((await selectedChildFromSelectedParentResource).label).toBe('Loaded child')
		expect(
			(await selectedFixtureFromChildrenResource).values[0]?.[EntityMetaKey.Selector]
		).toEqual({
			slug: 'fixture',
		})
		expect(
			(await selectedOwnerFromChildrenResource).values[0]?.[EntityMetaKey.Selector]
		).toEqual({
			slug: 'fixture',
		})
		expect(reselectedOwnerFromChildrenResource.sources).toEqual(['selection-fixture'])
		const reselectedOwners = await reselectedOwnerFromChildrenResource
		expect(
			reselectedOwners.values[0]?.value
		).toBe('Loaded fixture')
		expect(
			(await selectedChildFromOwnerResource).values[0]?.[EntityMetaKey.Selector]
		).toEqual({
			id: 1n,
			$owner: {
				slug: 'fixture',
			},
		})
		expect(
			(await selectedFacetChildFromOwnerResource).values[0]?.[EntityMetaKey.Selector]
		).toEqual({
			id: 1n,
			$owner: {
				slug: 'fixture',
			},
		})
		expect((await ineligibleFacetChildFromOwnerResource).values).toEqual([])
		expect(() => invalidFieldResource.then()).toThrow('SelectionFixture.missing does not exist')
		expect(() => invalidNestedFacetFieldResource.then()).toThrow('SelectionFixture.Parent.missing does not exist')
		expect(() => invalidSiblingFacetFieldResource.then()).toThrow('SelectionFixture.Parent.namespace does not exist')
		expect(() => invalidFacetResource.then()).toThrow('SelectionFixture.Missing does not exist')
		expect(() => invalidReferenceFieldResource.then()).toThrow('SelectionChildFixture.missing does not exist')
		expect(() => selection[EntityProxyField](JSON.parse('"missing"'))).toThrow('SelectionFixture.missing does not exist')
		expect(() => selection[EntityProxyField](JSON.parse('"namespace"'))).toThrow('SelectionFixture.namespace does not collide with an entity resource property')
		expect(selection[EntityProxyField]('value').fieldName).toBe('value')
		expect(() => selection.Parent[EntityProxyField](JSON.parse('"parentKind"'))).toThrow('SelectionFixture.Parent.parentKind does not collide with a projection resource property')
		expect(() => selection[JSON.parse('"missing"')]).toThrow('SelectionFixture.missing does not exist')
		expect(() => selection.Parent[JSON.parse('"missing"')]).toThrow('SelectionFixture.Parent.missing does not exist')
		expect(() => selection.Parent.Child[JSON.parse('"missing"')]).toThrow('SelectionFixture.Parent.Child.missing does not exist')
		expect(() => selection.current).not.toThrow()
		expect(() => selection.Parent.current).not.toThrow()
	})

	it('validates resolver field value shape before writing persisted field rows', () => {
		const clientSource = source('$client.svelte.ts')
		const materializerSource = readFileSync(
			resolve(
				process.cwd(),
				'src/collections/assertLoadedCollectionRows.ts'
			),
			'utf8'
		)
		expect(clientSource).toMatch(/materializeResolverOutput/)
		expect(clientSource).toMatch(/ResolverOutputMaterialization\.Field/)
		expect(clientSource).toMatch(/ResolverOutputMaterialization\.Count/)
		expect(clientSource).toMatch(/schemaIndex = indexSchema\(schema\)/)
		expect(clientSource).toMatch(/schemaIndex\?: ReturnType<typeof indexSchema<_Schema>>/)
		expect(clientSource).not.toMatch(/Array\.isArray\(value\) \?[\s\S]*:\s*\[value\]/)
		expect(materializerSource).toMatch(/schemaIndex\.entityFieldDefinitionByEntityTypePathAndName\[fieldDefinition\.entityType\]/)
		expect(materializerSource).not.toMatch(/indexSchema\(|entityFieldDefinitions\(/)
	})

	it('settles persisted account terminal projections through the app resolver registry', async () => {
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
		const resolvers = (
			await Promise.all([
				import('$/resolvers/Constants.ts'),
				import('$/resolvers/Local.ts'),
			])
		).map((resolverModule) => resolverModule.default)
		const createContext = () => client({
			schema,
			sourceProviders,
		})({
			resolvers,
			sourceIndex: testSourceIndex(resolvers.map(({ source }) => source)),
		})({
			queryClient: new QueryClient(),
			persistence,
			schemaVersion: 1,
		})
		await writeLocalBlockheadAccount(createContext(), {
			namespace: 'eip155',
			reference: '1',
			accountAddress: '0x1111111111111111111111111111111111111111',
		})
		const restartedContext = createContext()
		expect(restartedContext.enabledSources.has(Source.Constants_Internal)).toBe(true)
		expect(restartedContext.resolverIndexes.resolverParts.filter((resolverPart) => (
			resolverPart.entityType === EntityType.Account
			&& resolverPart.fieldName === '$account'
			&& resolverPart.facetPath.join('.') === 'Evm'
		)).map((resolverPart) => resolverPart.source)).toEqual([
			Source.Constants_Internal,
		])
		const directEvmAccount = restartedContext.select(
			EntityType.Account,
			{
				caip10: {
					namespace: 'eip155',
					reference: '1',
					accountAddress: '0x1111111111111111111111111111111111111111',
				},
			}
		)
			.Evm
			.$account({
				sources: [Source.Constants_Internal],
			})
		await expect.poll(() => directEvmAccount.current).toBeDefined()
		await expect(directEvmAccount).resolves.toEqual(directEvmAccount.current)
		const accountProjection = restartedContext.select(
			EntityType._Global,
			{
				scope: '$$blockheadAccounts',
			}
		)
			.$$blockheadAccounts({
				sources: [Source.Local_Internal],
			})
			.$account({
				sources: [Source.Local_Internal],
			})
			.Evm

		await expect.poll(() => accountProjection.current?.resolution).toBe(
			ProjectionResolution.Applicable
		)
		await expect(accountProjection).resolves.toMatchObject({
			resolution: ProjectionResolution.Applicable,
		})
		const evmAccounts = (await accountProjection).value.$account({
			sources: [Source.Constants_Internal],
		})
		await expect.poll(() => evmAccounts.current?.values.length).toBe(1)
		await expect(evmAccounts).resolves.toEqual(evmAccounts.current)

		const networkProjection = restartedContext.select(
			EntityType.Network,
			{
				caip2: {
					namespace: 'eip155',
					reference: '1',
				},
			}
		).Evm
		await expect.poll(() => networkProjection.current?.resolution).toBe(
			ProjectionResolution.Applicable
		)
		const upgrades = (await networkProjection).value
			.$$upgrades({
				sources: [Source.Constants_Internal],
				limit: 1,
			})({
				fields: {
					upgradeId: true,
					name: true,
				},
			})
		await expect.poll(() => upgrades.current?.values.length).toBe(1)
		await expect(upgrades).resolves.toEqual(upgrades.current)
	}, 90_000)

	it('hydrates identity from selector defaults without activating unrelated selector resolvers', async () => {
		const fixtureSchema = [
			entity({
				entityType: 'SelectorSourceFixture',
				labels: {
					singular: 'Selector source fixture',
					plural: 'Selector source fixtures',
				},
			})({
				slug: {
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.One,
					defaultSources: ['identity-source'],
				},
				kind: {
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.One,
				},
			})({
				selectors: {
					Slug: ['slug'],
				},
				facets: {
					Details: facet({
						path: ['kind'],
						is: 'details',
					})({
						status: {
							primitiveType: arktype('string'),
							cardinality: EntityFieldCardinality.One,
							defaultSources: ['facet-source'],
						},
					}),
				},
			}),
		] as const
		const calls = {
			'identity-source': 0,
			'unrelated-source': 0,
			'facet-source': 0,
		}
		const resolvers = [
			{
				entityType: 'SelectorSourceFixture',
				source: 'identity-source',
				resolve: {
					Slug: {
						resolve: async () => {
							calls['identity-source'] += 1
							return {}
						},
					},
				},
				projections: {
					kind: () => 'details',
				},
			},
			{
				entityType: 'SelectorSourceFixture',
				source: 'unrelated-source',
				resolve: {
					Slug: {
						resolve: async () => {
							calls['unrelated-source'] += 1
							return {}
						},
					},
				},
				projections: {
					kind: () => 'details',
				},
			},
			{
				entityType: 'SelectorSourceFixture',
				source: 'facet-source',
				resolve: {
					Slug: {
						resolve: async () => {
							calls['facet-source'] += 1
							return 'resolved'
						},
					},
				},
				projections: {
					Details: {
						status: (status) => status,
					},
				},
			},
		] satisfies SourceResolverModule<
			typeof fixtureSchema,
			'identity-source' | 'unrelated-source' | 'facet-source',
			ResolverContext
		>['resolvers']

		const context = client({
			schema: fixtureSchema,
			sourceProviders: [{
				provider: 'selector-source-fixture',
				label: 'Selector source fixture',
				sources: {
					'identity-source': {
						label: 'Identity source',
					},
					'unrelated-source': {
						label: 'Unrelated source',
					},
					'facet-source': {
						label: 'Facet source',
					},
				},
				bindings: {},
			}],
		})({
			resolvers: [
				{
					source: 'identity-source',
					resolvers: [resolvers[0]],
				},
				{
					source: 'unrelated-source',
					resolvers: [resolvers[1]],
				},
				{
					source: 'facet-source',
					resolvers: [resolvers[2]],
				},
			],
			sourceIndex: testSourceIndex([
				'facet-source',
				'identity-source',
				'unrelated-source',
			]),
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

		expect(entityResolverSourcesForSelectorKeys(
			fixtureSchema,
			fixtureSchema[0],
			[stringify({ slug: 'fixture' })],
			context.resolverIndexes.resolverDefinitionsByEntityType.SelectorSourceFixture
		)).toEqual(['identity-source'])
		expect(entityResolverSourcesForSelectorKeys(
			fixtureSchema,
			fixtureSchema[0],
			[stringify({ slug: 'fixture' })],
			context.resolverIndexes.resolverDefinitionsByEntityType.SelectorSourceFixture,
			['facet-source']
		)).toEqual(['facet-source'])

		const parentScopedSelection = context.select(
			'SelectorSourceFixture',
			{
				slug: 'fixture',
			},
			{
				sources: ['unrelated-source'],
			}
		)
		expect(parentScopedSelection.Details.status.sources).toBeUndefined()
		expect(parentScopedSelection.Details.status({
			sources: ['identity-source'],
		}).sources).toEqual(['identity-source'])
		await expect(parentScopedSelection.Details.status).resolves.toBe('resolved')

		expect((await subscribeEntity(
			context,
			'SelectorSourceFixture',
			{ slug: 'fixture' },
			{
				fields: {
					Details: {
						fields: {
							status: true,
						},
					},
				},
			}
		)).fields.Details.fields.status).toBe('resolved')
		expect(calls).toEqual({
			'identity-source': 1,
			'unrelated-source': 0,
			'facet-source': 2,
		})
	})

	it('materializes every selector derived from one trusted identity snapshot', async () => {
		const fixtureSchema = [
			entity({
				entityType: 'IdentityFixture',
				labels: {
					singular: 'Identity fixture',
					plural: 'Identity fixtures',
				},
			})({
				did: {
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.One,
				},
				handle: {
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.One,
				},
			})({
				selectors: {
					Did: ['did'],
					Handle: ['handle'],
				},
			}),
		] as const
		let providerCalls = 0
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
		const createContext = () => client({
			schema: fixtureSchema,
			sourceProviders: [{
				provider: 'identity-provider',
				label: 'Identity provider',
				sources: {
					'identity-source': {
						label: 'Identity source',
					},
				},
				bindings: {},
			}],
		})({
			resolvers: [{
				source: 'identity-source',
				resolvers: [{
					entityType: 'IdentityFixture',
					resolve: {
						Did: {
							resolve: async ({ did }) => {
								providerCalls += 1
								return {
									did,
									handle: 'alice.example',
								}
							},
						},
						Handle: {
							resolve: async ({ handle }) => {
								providerCalls += 1
								return {
									did: 'did:plc:alice',
									handle,
								}
							},
						},
					},
					projections: {
						did: (identity) => identity.did,
						handle: (identity) => identity.handle,
					},
				}],
			}],
			sourceIndex: testSourceIndex(['identity-source']),
		})({
			queryClient: new QueryClient(),
			persistence,
			schemaVersion: 1,
		})
		const context = createContext()

		await subscribeEntity(
			context,
			'IdentityFixture',
			{ handle: 'alice.example' },
			{ sources: ['identity-source'] }
		)
		expect(context.entityCollections.IdentityFixture.toArray.map((row) => row[EntityMetaKey.Selector])).toEqual(expect.arrayContaining([
			{ did: 'did:plc:alice' },
			{ handle: 'alice.example' },
		]))
		await expect.poll(() => (
			collectionRowsByCollectionId.get('client.entities.IdentityFixture')?.size
		)).toBe(2)
		await expect.poll(() => (
			collectionMetadataByCollectionId.get('client.entities.IdentityFixture')?.size
		)).toBe(2)

		const restartedContext = createContext()
		await subscribeEntity(
			restartedContext,
			'IdentityFixture',
			{ did: 'did:plc:alice' },
			{
				sources: ['identity-source'],
				fields: {},
			}
		)
		expect(providerCalls).toBe(1)
	})

	it('materializes exact entity, field, reference, and count rows', () => {
		const childSelector = { id: 'child' }
		const childSelectorKey = entitySelectorKey(
			materializationFixtureSchema,
			materializationFixtureSchema[1],
			childSelector
		)

		expect(materializeResolverOutput({
			kind: ResolverOutputMaterialization.Entity,
			schema: materializationFixtureSchema,
			schemaIndex: materializationFixtureSchemaIndex,
			entityDefinition: materializationFixtureSchema[0],
			selector: materializationParentSelector,
			selectorKey: materializationParentSelectorKey,
			source: 'source-a',
			snapshot: {
				providerWireField: 'not a schema field',
			},
		})).toEqual([{
			[EntityMetaKey.Selector]: materializationParentSelector,
			[EntityMetaKey.SelectorKey]: materializationParentSelectorKey,
			[EntityMetaKey.Source]: 'source-a',
		}])

		expect(materializeResolverOutput({
			kind: ResolverOutputMaterialization.Field,
			schema: materializationFixtureSchema,
			schemaIndex: materializationFixtureSchemaIndex,
			entityDefinition: materializationFixtureSchema[0],
			parentSelector: materializationParentSelector,
			parentSelectorKey: materializationParentSelectorKey,
			source: 'source-a',
			fieldDefinition: materializationFixtureSchema[0].fields[1],
			value: [
				1,
				2,
			],
		})).toEqual([
			expect.objectContaining({
				valueIndex: 0,
				[EntityMetaKey.Value]: 1,
			}),
			expect.objectContaining({
				valueIndex: 1,
				[EntityMetaKey.Value]: 2,
			}),
		])
		expect(materializeResolverOutput({
			kind: ResolverOutputMaterialization.Field,
			schema: materializationFixtureSchema,
			schemaIndex: materializationFixtureSchemaIndex,
			entityDefinition: materializationFixtureSchema[0],
			parentSelector: materializationParentSelector,
			parentSelectorKey: materializationParentSelectorKey,
			source: 'source-a',
			fieldDefinition: materializationFixtureSchema[0].fields[1],
			value: [
				1,
				1,
				2,
			],
		})).toMatchObject([
			{
				valueIndex: 0,
				valueKey: 'Value:[1]',
			},
			{
				valueIndex: 1,
				valueKey: 'Value:[1]',
			},
			{
				valueIndex: 2,
				valueKey: 'Value:[2]',
			},
		])
		expect(() => materializeResolverOutput({
			kind: ResolverOutputMaterialization.Field,
			schema: materializationFixtureSchema,
			schemaIndex: materializationFixtureSchemaIndex,
			entityDefinition: materializationFixtureSchema[0],
			parentSelector: materializationParentSelector,
			parentSelectorKey: materializationParentSelectorKey,
			source: 'source-a',
			fieldDefinition: materializationFixtureSchema[0].fields[1],
			value: [
				1,
				'not-a-number',
			],
		})).toThrow(/must be a number/)
		const materializedReferenceRows = materializeResolverOutput({
			kind: ResolverOutputMaterialization.Field,
			schema: materializationFixtureSchema,
			schemaIndex: materializationFixtureSchemaIndex,
			entityDefinition: materializationFixtureSchema[0],
			parentSelector: materializationParentSelector,
			parentSelectorKey: materializationParentSelectorKey,
			source: 'source-a',
			fieldDefinition: materializationFixtureSchema[0].fields[2],
			value: [{
				[EntityMetaKey.Selector]: childSelector,
				[EntityMetaKey.SelectorKey]: childSelectorKey,
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey('MaterializationChild', [], 'title')]: 'Child title',
					[entityFieldAddressKey('MaterializationChild', ['Left'], 'label')]: 'Left label',
					[entityFieldAddressKey('MaterializationChild', ['Right'], 'label')]: 'Right label',
				},
			}],
		})
		expect(materializedReferenceRows).toEqual([expect.objectContaining({
			[EntityMetaKey.Value]: {
				[EntityMetaKey.Selector]: childSelector,
				[EntityMetaKey.SelectorKey]: childSelectorKey,
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey('MaterializationChild', [], 'title')]: 'Child title',
					[entityFieldAddressKey('MaterializationChild', ['Left'], 'label')]: 'Left label',
					[entityFieldAddressKey('MaterializationChild', ['Right'], 'label')]: 'Right label',
				},
			},
		})])
		expect(materializeResolverOutput({
			kind: ResolverOutputMaterialization.Field,
			schema: materializationFixtureSchema,
			schemaIndex: materializationFixtureSchemaIndex,
			entityDefinition: materializationFixtureSchema[0],
			parentSelector: materializationParentSelector,
			parentSelectorKey: materializationParentSelectorKey,
			source: 'source-a',
			fieldDefinition: materializationFixtureSchema[0].fields[2],
			value: materializedReferenceRows.map((row) => row[EntityMetaKey.Value]),
		})).toEqual(materializedReferenceRows)

		expect(materializeResolverOutput({
			kind: ResolverOutputMaterialization.Count,
			schema: materializationFixtureSchema,
			schemaIndex: materializationFixtureSchemaIndex,
			entityDefinition: materializationFixtureSchema[0],
			parentSelector: materializationParentSelector,
			parentSelectorKey: materializationParentSelectorKey,
			source: 'source-a',
			fieldDefinition: materializationFixtureSchema[0].fields[2],
			value: 2,
			filterKey: '{}',
		})).toEqual([expect.objectContaining({
			[EntityMetaKey.Value]: 2,
			filterKey: '{}',
		})])
	})

	it('keeps provider snapshots behind projections and resolves every embedded relationship row', async () => {
		const context = client({
			schema: materializationFixtureSchema,
			sourceProviders: [{
				provider: 'materialization-provider',
				label: 'Materialization provider',
				sources: {
					'source-a': {
						label: 'Source A',
					},
				},
				bindings: {},
			}],
		})({
			resolvers: [{
				source: 'source-a',
				resolvers: [{
					entityType: 'MaterializationParent',
					resolve: {
						Slug: {
							resolve: async () => ({
								converted: '7',
							}),
						},
					},
					projections: {
						converted: (snapshot) => BigInt(snapshot.converted),
						$$children: () => [
							{
								[EntityMetaKey.Selector]: {
									id: 'left',
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey('MaterializationChild', [], 'title')]: 'Left child',
									[entityFieldAddressKey('MaterializationChild', [], 'kind')]: 'left',
									[entityFieldAddressKey('MaterializationChild', [], '$sibling')]: {
										[EntityMetaKey.Selector]: {
											id: 'right',
										},
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey('MaterializationChild', [], 'title')]: 'Right child',
											[entityFieldAddressKey('MaterializationChild', [], 'kind')]: 'right',
										},
									},
								},
							},
							{
								[EntityMetaKey.Selector]: {
									id: 'right',
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey('MaterializationChild', [], 'title')]: 'Right child',
									[entityFieldAddressKey('MaterializationChild', [], 'kind')]: 'right',
								},
							},
						],
					},
				}],
			}],
			sourceIndex: testSourceIndex(['source-a']),
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
			'MaterializationParent',
			materializationParentSelector,
			{
				sources: ['source-a'],
			}
		)

		await selection
		await expect(selection.converted).resolves.toBe(7n)

		const children = selection.$$children({
			fields: {
				title: true,
				kind: true,
				$sibling: {
					fields: {
						title: true,
					},
				},
			},
		})
		await expect(children).resolves.toMatchObject({
			values: [
				{
					id: 'left',
					title: 'Left child',
					kind: 'left',
					$sibling: {
						title: 'Right child',
					},
					[EntityMetaKey.Source]: 'source-a',
				},
				{
					id: 'right',
					title: 'Right child',
					kind: 'right',
					[EntityMetaKey.Source]: 'source-a',
				},
			],
		})
		await expect.poll(() => children.current).toMatchObject({
			values: [
				{
					id: 'left',
					title: 'Left child',
					kind: 'left',
					[EntityMetaKey.Source]: 'source-a',
				},
				{
					id: 'right',
					title: 'Right child',
					kind: 'right',
					[EntityMetaKey.Source]: 'source-a',
				},
			],
		})
		const childTitleFieldAddressKey = entityFieldAddressKey('MaterializationChild', [], 'title')
		const leftChildSelectorKey = entitySelectorKey(
			materializationFixtureSchema,
			materializationFixtureSchema[1],
			{
				id: 'left',
			}
		)
		context.entityFieldCollections.MaterializationChild[childTitleFieldAddressKey].utils.replaceRows(
			(row) => (
				row[EntityMetaKey.ParentSelectorKey] === leftChildSelectorKey
				&& row[EntityMetaKey.Source] === 'source-a'
			),
			[{
				facetPath: [],
				facetPathKey: stringify([]),
				fieldName: 'title',
				[EntityMetaKey.ParentSelector]: {
					id: 'left',
				},
				[EntityMetaKey.ParentSelectorKey]: leftChildSelectorKey,
				[EntityMetaKey.Source]: 'source-a',
				[EntityMetaKey.Value]: 'Updated left child',
				valueKey: `Value:${stringify('Updated left child')}`,
			}]
		)
		await expect.poll(() => children.current).toMatchObject({
			values: [
				{
					id: 'left',
					title: 'Updated left child',
					kind: 'left',
				},
				{
					id: 'right',
					title: 'Right child',
					kind: 'right',
				},
			],
		})
	})

	it('hydrates relationship children only from their producer sources', async () => {
		const childCalls: Record<'source-a' | 'source-b', string[]> = {
			'source-a': [],
			'source-b': [],
		}
		const resolverModule = (
			source: 'source-a' | 'source-b',
			childIds: string[]
		) => ({
			source,
			resolvers: [
				{
					entityType: 'MaterializationParent',
					resolve: {
						Slug: {
							resolve: async () => ({ childIds }),
						},
					},
					projections: {
						$$children: ({ childIds: resolvedChildIds }) => resolvedChildIds.map((id) => ({
							[EntityMetaKey.Selector]: { id },
						})),
					},
				},
				{
					entityType: 'MaterializationChild',
					resolve: {
						Id: {
							resolve: async ({ id }) => {
								childCalls[source].push(id)
								return {
									title: `${source}:${id}`,
								}
							},
						},
					},
					projections: {
						title: ({ title }) => title,
					},
				},
			],
		}) satisfies SourceResolverModule<
			typeof materializationFixtureSchema,
			'source-a' | 'source-b',
			ResolverContext
		>
		const context = client({
			schema: materializationFixtureSchema,
			sourceProviders: [{
				provider: 'materialization-provider',
				label: 'Materialization provider',
				sources: {
					'source-a': {
						label: 'Source A',
					},
					'source-b': {
						label: 'Source B',
					},
				},
				bindings: {},
			}],
		})({
			resolvers: [
				resolverModule('source-a', [
					'shared',
					'a-only',
				]),
				resolverModule('source-b', [
					'shared',
					'b-only',
				]),
			],
			sourceIndex: testSourceIndex(['source-a', 'source-b']),
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

		const children = await subscribeEntityField(
			context,
			'MaterializationParent',
			materializationParentSelector,
			'$$children',
			{
				sources: [
					'source-a',
					'source-b',
				],
				fields: {
					title: true,
				},
			}
		)

		expect(children.values.map((child) => child.title).sort()).toEqual([
			'source-a:a-only',
			'source-a:shared',
			'source-b:b-only',
			'source-b:shared',
		])
		const proxiedChildren = await createEntityProxy(
			context,
			'MaterializationParent',
			materializationParentSelector
		).$$children({
			sources: [
				'source-a',
				'source-b',
			],
			fields: {
				title: true,
			},
		})
		expect(proxiedChildren.values.map((child) => child.title).sort()).toEqual([
			'source-a:a-only',
			'source-a:shared',
			'source-b:b-only',
			'source-b:shared',
		])
		expect(childCalls).toEqual({
			'source-a': [
				'shared',
				'a-only',
			],
			'source-b': [
				'shared',
				'b-only',
			],
		})
	})

	it('rejects every malformed resolver materialization atomically', () => {
		const fieldInput = {
			kind: ResolverOutputMaterialization.Field,
			schema: materializationFixtureSchema,
			schemaIndex: materializationFixtureSchemaIndex,
			entityDefinition: materializationFixtureSchema[0],
			parentSelector: materializationParentSelector,
			parentSelectorKey: materializationParentSelectorKey,
			source: 'source-a',
			fieldDefinition: materializationFixtureSchema[0].fields[2],
		}

		expect(() => materializeResolverOutput({
			...fieldInput,
			parentSelectorKey: 'wrong',
			value: [],
		})).toThrow(/selector key/)
		expect(() => materializeResolverOutput({
			...fieldInput,
			value: {
				[EntityMetaKey.Selector]: { id: 'child' },
			},
		})).toThrow(/non-array/)
		expect(() => materializeResolverOutput({
			...fieldInput,
			fieldDefinition: materializationFixtureSchema[0].fields[1],
			value: ['not a number'],
		})).toThrow(/must be a number/)
		expect(() => materializeResolverOutput({
			...fieldInput,
			value: [{
				[EntityMetaKey.Selector]: { slug: 'wrong entity type' },
			}],
		})).toThrow(/invalid selector/)
		expect(() => materializeResolverOutput({
			...fieldInput,
			value: [{
				[EntityMetaKey.Selector]: { id: 'child' },
				[EntityMetaKey.SelectorKey]: 'wrong',
			}],
		})).toThrow(/does not match selector/)
		expect(() => materializeResolverOutput({
			...fieldInput,
			value: [{
				[EntityMetaKey.Selector]: { id: 'child' },
				__source: 'injected',
			}],
		})).toThrow(/direct denormalized sibling fields/)
		expect(() => materializeResolverOutput({
			...fieldInput,
			value: [{
				[EntityMetaKey.Selector]: { id: 'child' },
				[EntityMetaKey.Fields]: {
					title: 'legacy terminal-name bag',
				},
			}],
		})).toThrow(/invalid canonical field address/)
		expect(() => materializeResolverOutput({
			...fieldInput,
			value: [{
				[EntityMetaKey.Selector]: { id: 'child' },
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey('MaterializationParent', [], 'slug')]: 'wrong entity',
				},
			}],
		})).toThrow(/invalid canonical field address/)
		expect(() => materializeResolverOutput({
			...fieldInput,
			value: [{
				[EntityMetaKey.Selector]: { id: 'child' },
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey('MaterializationChild', ['Missing'], 'label')]: 'wrong facet',
				},
			}],
		})).toThrow(/invalid canonical field address/)
		expect(() => materializeResolverOutput({
			...fieldInput,
			value: [{
				[EntityMetaKey.Selector]: { id: 'child' },
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey('MaterializationChild', [], 'missing')]: true,
				},
			}],
		})).toThrow(/invalid canonical field address/)
		expect(() => materializeResolverOutput({
			...fieldInput,
			value: [{
				[EntityMetaKey.Selector]: { id: 'child' },
				title: 'direct',
			}],
		})).toThrow(/direct denormalized sibling fields/)
		expect(() => materializeResolverOutput({
			kind: ResolverOutputMaterialization.Count,
			schema: materializationFixtureSchema,
			schemaIndex: materializationFixtureSchemaIndex,
			entityDefinition: materializationFixtureSchema[0],
			parentSelector: materializationParentSelector,
			parentSelectorKey: materializationParentSelectorKey,
			source: 'source-a',
			fieldDefinition: materializationFixtureSchema[0].fields[2],
			value: Number.MAX_SAFE_INTEGER + 1,
			filterKey: '{}',
		})).toThrow(/invalid count/)
		expect(() => materializeResolverOutput({
			kind: ResolverOutputMaterialization.Count,
			schema: materializationFixtureSchema,
			schemaIndex: materializationFixtureSchemaIndex,
			entityDefinition: materializationFixtureSchema[0],
			parentSelector: materializationParentSelector,
			parentSelectorKey: materializationParentSelectorKey,
			source: 'source-a',
			fieldDefinition: materializationFixtureSchema[0].fields[2],
			value: -1,
			filterKey: '{}',
		})).toThrow(/invalid count/)
	})

	it('keeps count rows are authoritative for paged and windowed list totals', () => {
		expect(source('$subscribe.svelte.ts')).not.toMatch(/totalCount:[^\n]*values\.length/)
		expect(source('$subscribe.svelte.ts')).not.toMatch(/loaded row length/)
	})

	it('selects authoritative count rows by field-local source priority without preloading passive raw collections', async () => {
		const fixtureSchema = [
			entity({
				entityType: 'CountFixture',
				labels: {
					singular: 'Count fixture',
					plural: 'Count fixtures',
				},
			})({
				slug: {
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.One,
				},
				items: {
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.Many,
				},
			})({
				selectors: {
					Slug: ['slug'],
				},
			}),
		] as const
		const countCalls = {
			'source-a': 0,
			'source-b': 0,
		}
		const resolverModule = (source: 'source-a' | 'source-b', count: number) => ({
			source,
			resolvers: [{
				entityType: 'CountFixture',
				resolve: {
					Slug: {
						resolve: async () => ({}),
					},
				},
				projections: {
					items: {
						select: () => [],
						resolveCount: () => {
							countCalls[source] += 1
							return count
						},
					},
				},
			}],
		}) satisfies SourceResolverModule<typeof fixtureSchema, 'source-a' | 'source-b', ResolverContext>
		const createContext = () => client({
			schema: fixtureSchema,
			sourceProviders: [{
				provider: 'fixture',
				label: 'Fixture',
				sources: {
					'source-a': {
						label: 'Source A',
					},
					'source-b': {
						label: 'Source B',
					},
				},
				bindings: {},
			}],
		})({
			resolvers: [
				resolverModule('source-a', 5),
				resolverModule('source-b', 7),
			],
			sourceIndex: testSourceIndex(['source-a', 'source-b']),
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
		const context = createContext()
		const entitySelector = {
			slug: 'fixture',
		}
		await expect(subscribeEntityField(
			context,
			'CountFixture',
			entitySelector,
			'items',
			{
				sources: [
					'source-b',
					'source-a',
				],
			}
		)).resolves.toMatchObject({
			values: [],
		})
		expect(countCalls).toEqual({
			'source-a': 0,
			'source-b': 0,
		})

		const result = await subscribeEntityFieldCount(
			context,
			'CountFixture',
			entitySelector,
			'items',
			{
				sources: [
					'source-b',
					'source-a',
				],
			}
		)

		expect(result).toBe(7)
		expect(context.entityFieldCountCollections.CountFixture[
			entityFieldAddressKey('CountFixture', [], 'items')
		]?.toArray.map((row) => [
			row[EntityMetaKey.Source],
			row[EntityMetaKey.Value],
			row[EntityMetaKey.ParentSelectorKey],
		])).toEqual([
			[
				'source-a',
				5,
				entitySelectorKey(fixtureSchema, fixtureSchema[0], entitySelector),
			],
			[
				'source-b',
				7,
				stringify(entitySelector),
			],
		])
		expect(context.collectionLoadFailures.list).toEqual([])
		expect(countCalls).toEqual({
			'source-a': 1,
			'source-b': 1,
		})

		countCalls['source-a'] = 0
		countCalls['source-b'] = 0
		const sourceBOnlyContext = createContext()
		const sourceBOnlyFieldCollection = sourceBOnlyContext.entityFieldCollections.CountFixture[
			entityFieldAddressKey('CountFixture', [], 'items')
		]
		const sourceBOnlyCountCollection = sourceBOnlyContext.entityFieldCountCollections.CountFixture[
			entityFieldAddressKey('CountFixture', [], 'items')
		]
		if (sourceBOnlyCountCollection === undefined)
			throw new Error('CountFixture.items count collection missing')

		const sourceBOnlyFieldPreload = vi.spyOn(sourceBOnlyFieldCollection, 'preload')
		const sourceBOnlyCountPreload = vi.spyOn(sourceBOnlyCountCollection, 'preload')
		expect(await subscribeEntityFieldCount(
			sourceBOnlyContext,
			'CountFixture',
			entitySelector,
			'items',
			{
				sources: ['source-b'],
			}
		)).toBe(7)
		expect(countCalls).toEqual({
			'source-a': 0,
			'source-b': 1,
		})
		expect(sourceBOnlyFieldPreload).not.toHaveBeenCalled()
		expect(sourceBOnlyCountPreload).not.toHaveBeenCalled()
		expect(sourceBOnlyContext.collectionLoadFailures.list).toEqual([])

		countCalls['source-a'] = 0
		countCalls['source-b'] = 0
		const getterOnlyContext = createContext()
		const getterOnlyFieldCollection = getterOnlyContext.entityFieldCollections.CountFixture[
			entityFieldAddressKey('CountFixture', [], 'items')
		]
		const getterOnlyCountCollection = getterOnlyContext.entityFieldCountCollections.CountFixture[
			entityFieldAddressKey('CountFixture', [], 'items')
		]
		if (getterOnlyCountCollection === undefined)
			throw new Error('CountFixture.items count collection missing')

		const getterOnlyFieldPreload = vi.spyOn(getterOnlyFieldCollection, 'preload')
		const getterOnlyCountPreload = vi.spyOn(getterOnlyCountCollection, 'preload')
		const getterOnlyResource = subscribeEntityFieldCount(
			getterOnlyContext,
			'CountFixture',
			entitySelector,
			'items',
			{
				sources: ['source-b'],
			}
		)
		expect(countCalls).toEqual({
			'source-a': 0,
			'source-b': 0,
		})
		expect(getterOnlyResource.current).toBeUndefined()
		await vi.waitFor(() => {
			expect(getterOnlyResource.current).toBe(7)
		})
		expect(countCalls).toEqual({
			'source-a': 0,
			'source-b': 1,
		})
		expect(getterOnlyFieldPreload).not.toHaveBeenCalled()
		expect(getterOnlyCountPreload).not.toHaveBeenCalled()
		expect(getterOnlyContext.collectionLoadFailures.list).toEqual([])

		countCalls['source-a'] = 0
		countCalls['source-b'] = 0
		const allSourcesContext = createContext()
		expect(await subscribeEntityFieldCount(
			allSourcesContext,
			'CountFixture',
			entitySelector,
			'items',
			{
			}
		)).toBe(5)
		expect(countCalls).toEqual({
			'source-a': 1,
			'source-b': 1,
		})
		expect(allSourcesContext.collectionLoadFailures.list).toEqual([])
	})

	it('shares projection live publishers and cleans up after the last field subscriber', async () => {
		const fixtureSchema = [
			entity({
				entityType: 'LiveFixture',
				labels: {
					singular: 'Live fixture',
					plural: 'Live fixtures',
				},
			})({
				slug: {
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.One,
				},
				items: {
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.Many,
				},
			})({
				selectors: {
					Slug: ['slug'],
				},
			}),
		] as const
		let starts = 0
		let cleanups = 0
		const context = client({
			schema: fixtureSchema,
			sourceProviders: [{
				provider: 'fixture',
				label: 'Fixture',
				sources: {
					'live-source': {
						label: 'Live source',
					},
				},
				bindings: {},
			}],
		})({
			resolvers: [{
				source: 'live-source',
				resolvers: [{
					entityType: 'LiveFixture',
					resolve: {
						Slug: {
							resolve: async () => ({}),
						},
					},
					resolveLive: {
						items: {
							facetPath: [],
							publishes: {
								items: true,
							},
							start: ({ fields }) => {
								starts += 1
								expect(() => fields.items.replaceRows([{
									source: 'wrong-source',
									value: ['wrong source'],
								}])).toThrow(/cannot write/)
								expect(() => fields.items.replaceRows([{
									source: 'live-source',
									value: [1],
								}])).toThrow(/must be a string/)
								expect(() => fields.items.count.replaceRows([{
									source: 'live-source',
									value: -1,
								}])).toThrow(/invalid count/)
								fields.items.replaceRows([{
									source: 'live-source',
									value: [
										'live',
									],
								}])
								expect(() => fields.items.replaceRows([
									{
										source: 'live-source',
										value: ['replacement'],
									},
									{
										source: 'live-source',
										value: [1],
									},
								])).toThrow(/must be a string/)
								fields.items.count.replaceRows([{
									source: 'live-source',
									value: 1,
								}])
								fields.items.count.replaceRows([])
								return () => {
									cleanups += 1
								}
							},
						},
					},
					projections: {
						items: () => [],
					},
				}],
			}],
			sourceIndex: testSourceIndex(['live-source']),
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
		const parentSelectorKey = stringify({
			slug: 'fixture',
		})
		const fieldCollection = context.entityFieldCollections.LiveFixture[
			entityFieldAddressKey('LiveFixture', [], 'items')
		]
		const countCollection = context.entityFieldCountCollections.LiveFixture[
			entityFieldAddressKey('LiveFixture', [], 'items')
		]
		const createQuery = () => createLiveQueryCollection({
			gcTime: 1,
			startSync: true,
			query: (query) => query
				.from({
					row: fieldCollection,
				})
				.where(({ row }) => and(
					eq(row[EntityMetaKey.ParentSelectorKey], parentSelectorKey),
					eq(row[EntityMetaKey.Source], 'live-source')
				)),
		})
		const firstQuery = createQuery()
		const secondQuery = createQuery()
		const firstSubscription = firstQuery.subscribeChanges(() => {}, {
			includeInitialState: true,
		})
		const secondSubscription = secondQuery.subscribeChanges(() => {}, {
			includeInitialState: true,
		})

		await expect.poll(() => starts).toBe(1)
		expect(fieldCollection.toArray.map((row) => row[EntityMetaKey.Value])).toEqual([
			'live',
		])
		if (countCollection !== undefined)
			await createLiveQueryCollection({
				query: (query) => query
					.from({
						row: countCollection,
					})
					.where(({ row }) => and(
						eq(row[EntityMetaKey.ParentSelectorKey], parentSelectorKey),
						eq(row[EntityMetaKey.Source], 'live-source')
					)),
			}).preload()

		expect(countCollection?.toArray).toEqual([])
		expect([...context.liveSubscriptions.values()].map((subscription) => subscription.referenceCount)).toEqual([
			2,
		])
		await Promise.resolve()
		firstSubscription.unsubscribe()
		expect(cleanups).toBe(0)
		secondSubscription.unsubscribe()
		await expect.poll(() => cleanups).toBe(1)
		expect(context.liveSubscriptions.size).toBe(0)
	})

	it('settles existing getter and promise resources from exact persisted Local authority', async () => {
		const fixtureSchema = [
			entity({
				entityType: 'LocalAuthorityFixture',
				labels: {
					singular: 'Local authority fixture',
					plural: 'Local authority fixtures',
				},
			})({
				slug: {
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.One,
				},
				note: {
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.ZeroOrOne,
				},
				$related: {
					entityType: 'LocalAuthorityRelatedFixture',
					cardinality: EntityFieldCardinality.ZeroOrOne,
				},
				items: {
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.Many,
				},
			})({
				selectors: {
					Slug: ['slug'],
				},
			}),
			entity({
				entityType: 'LocalAuthorityRelatedFixture',
				labels: {
					singular: 'Local authority related fixture',
					plural: 'Local authority related fixtures',
				},
			})({
				id: {
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.One,
				},
			})({
				selectors: {
					Id: ['id'],
				},
			}),
		] as const
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
		let providerCalls = 0
		let localResolverCalls = 0
		const createContext = () => client({
			schema: fixtureSchema,
			sourceProviders: [{
				provider: 'local',
				label: 'Local',
				sources: {
					[Source.Local_Internal]: {
						label: 'Local',
					},
					[Source.Constants_Internal]: {
						label: 'Constants',
					},
				},
				bindings: {},
			}],
		})({
			resolvers: [{
				source: Source.Local_Internal,
				resolvers: [{
					entityType: 'LocalAuthorityFixture',
					resolve: {
						Slug: {
							resolve: () => {
								localResolverCalls += 1
								throw new Error('explicit Local must remain collection-owned')
							},
						},
					},
					projections: {
						note: (snapshot) => snapshot.note,
						items: {
							select: (snapshot) => snapshot.items,
							resolveCount: (snapshot) => snapshot.items.length,
						},
					},
				}],
			}, {
				source: Source.Constants_Internal,
				resolvers: [{
					entityType: 'LocalAuthorityFixture',
					resolve: {
						Slug: {
							resolve: ({ slug }) => {
								providerCalls += 1
								return slug === 'catalog' ?
									{
										slug,
										note: 'Catalog value',
									}
								:
									new Promise(() => {})
							},
						},
					},
					projections: {
						note: (snapshot) => snapshot.note,
						items: {
							select: () => {
								providerCalls += 1
								return new Promise(() => {})
							},
							resolveCount: () => {
								providerCalls += 1
								return new Promise(() => {})
							},
						},
					},
				}],
			}],
			sourceIndex: testSourceIndex([
				Source.Constants_Internal,
				Source.Local_Internal,
			]),
		})({
			queryClient: new QueryClient(),
			persistence,
			schemaVersion: 1,
		})
		const queuedContext = createContext()
		const queuedFirstSelector = {
			slug: 'queued-first',
		}
		const queuedReplacementSelector = {
			slug: 'queued-replacement',
		}
		const queuedSecondSelector = {
			slug: 'queued-second',
		}
		const queuedFirstSelectorKey = stringify(queuedFirstSelector)
		const queuedReplacementSelectorKey = stringify(queuedReplacementSelector)
		const queuedSecondSelectorKey = stringify(queuedSecondSelector)
		const appliedMutations: string[] = []
		const queuedMutationApplications = [
			queuedContext.entityCollections.LocalAuthorityFixture.utils.writeUpsertWithAuthority(
				{
					[EntityMetaKey.Selector]: queuedFirstSelector,
					[EntityMetaKey.SelectorKey]: queuedFirstSelectorKey,
					[EntityMetaKey.Source]: Source.Local_Internal,
				},
				queuedFirstSelectorKey,
				localMutationAuthorityKey({
					source: Source.Local_Internal,
					entityType: 'LocalAuthorityFixture',
					selectorKey: queuedFirstSelectorKey,
				}),
				'present',
				() => {
					appliedMutations.push('add')
				}
			),
			queuedContext.entityCollections.LocalAuthorityFixture.utils.replaceRowsWithAuthority(
				(row) => row[EntityMetaKey.SelectorKey] === queuedFirstSelectorKey,
				[],
				queuedFirstSelectorKey,
				localMutationAuthorityKey({
					source: Source.Local_Internal,
					entityType: 'LocalAuthorityFixture',
					selectorKey: queuedFirstSelectorKey,
				}),
				'deleted',
				() => {
					appliedMutations.push('delete')
				}
			),
			queuedContext.entityCollections.LocalAuthorityFixture.utils.replaceRowsWithAuthority(
				(row) => row[EntityMetaKey.Source] === Source.Local_Internal,
				[{
					[EntityMetaKey.Selector]: queuedReplacementSelector,
					[EntityMetaKey.SelectorKey]: queuedReplacementSelectorKey,
					[EntityMetaKey.Source]: Source.Local_Internal,
				}],
				queuedReplacementSelectorKey,
				localMutationAuthorityKey({
					source: Source.Local_Internal,
					entityType: 'LocalAuthorityFixture',
					selectorKey: queuedReplacementSelectorKey,
				}),
				'present',
				() => {
					appliedMutations.push('replace')
				}
			),
			queuedContext.entityCollections.LocalAuthorityFixture.utils.writeUpsertWithAuthority(
				{
					[EntityMetaKey.Selector]: queuedSecondSelector,
					[EntityMetaKey.SelectorKey]: queuedSecondSelectorKey,
					[EntityMetaKey.Source]: Source.Local_Internal,
				},
				queuedSecondSelectorKey,
				localMutationAuthorityKey({
					source: Source.Local_Internal,
					entityType: 'LocalAuthorityFixture',
					selectorKey: queuedSecondSelectorKey,
				}),
				'present',
				() => {
					appliedMutations.push('second add')
				}
			),
		]
		expect(queuedContext.entityCollections.LocalAuthorityFixture.toArray).toEqual([])
		expect(appliedMutations).toEqual([])
		queuedContext.entityCollections.LocalAuthorityFixture.startSyncImmediate()
		await Promise.all(queuedMutationApplications)
		expect(appliedMutations).toEqual([
			'add',
			'delete',
			'replace',
			'second add',
		])
		expect(queuedContext.entityCollections.LocalAuthorityFixture.toArray.map((row) => (
			row[EntityMetaKey.SelectorKey]
		))).toEqual([
			queuedReplacementSelectorKey,
			queuedSecondSelectorKey,
		])

		const queuedRelationshipContext = createContext()
		const queuedRelationshipSelector = {
			slug: 'queued-relationship',
		}
		const queuedRelationshipSelectorKey = stringify(queuedRelationshipSelector)
		const queuedItemsFieldAddressKey = entityFieldAddressKey('LocalAuthorityFixture', [], 'items')
		const queuedItemsCollection = queuedRelationshipContext.entityFieldCollections.LocalAuthorityFixture[
			queuedItemsFieldAddressKey
		]
		const queuedItemsCountCollection = queuedRelationshipContext.entityFieldCountCollections.LocalAuthorityFixture[
			queuedItemsFieldAddressKey
		]
		if (queuedItemsCountCollection === undefined)
			throw new Error('LocalAuthorityFixture.items count collection missing')

		const queuedCountApplications: number[] = []
		const applyQueuedCount = () => {
			const count = new Set(queuedItemsCollection.toArray.map((row) => row.valueKey)).size
			return queuedItemsCountCollection.utils.writeUpsertWithAuthority({
				facetPath: [],
				facetPathKey: stringify([]),
				fieldName: 'items',
				filterKey: stringify({}),
				[EntityMetaKey.ParentSelector]: queuedRelationshipSelector,
				[EntityMetaKey.ParentSelectorKey]: queuedRelationshipSelectorKey,
				[EntityMetaKey.Source]: Source.Local_Internal,
				[EntityMetaKey.Value]: count,
			},
				queuedRelationshipSelectorKey,
				localMutationAuthorityKey({
					source: Source.Local_Internal,
					entityType: 'LocalAuthorityFixture',
					selectorKey: queuedRelationshipSelectorKey,
					fieldName: 'items',
					fieldAddressKey: queuedItemsFieldAddressKey,
					facetPathKey: stringify([]),
					filterKey: stringify({}),
				}),
				'resolved',
				() => {
					queuedCountApplications.push(count)
				}
			)
		}
		const queuedRelationshipApplications = [
			queuedItemsCollection.utils.writeUpsertWithAuthority({
				facetPath: [],
				facetPathKey: stringify([]),
				fieldName: 'items',
				[EntityMetaKey.ParentSelector]: queuedRelationshipSelector,
				[EntityMetaKey.ParentSelectorKey]: queuedRelationshipSelectorKey,
				[EntityMetaKey.Source]: Source.Local_Internal,
				[EntityMetaKey.Value]: 'queued item',
				valueIndex: 0,
				valueKey: `Value:${stringify('queued item')}`,
			},
				queuedRelationshipSelectorKey,
				localMutationAuthorityKey({
					source: Source.Local_Internal,
					entityType: 'LocalAuthorityFixture',
					selectorKey: queuedRelationshipSelectorKey,
					fieldName: 'items',
					fieldAddressKey: queuedItemsFieldAddressKey,
					facetPathKey: stringify([]),
					valueKey: `Value:${stringify('queued item')}`,
				}),
				'present',
				applyQueuedCount
			),
			queuedItemsCollection.utils.replaceRowsWithAuthority(
				(row) => row[EntityMetaKey.ParentSelectorKey] === queuedRelationshipSelectorKey,
				[],
				queuedRelationshipSelectorKey,
				localMutationAuthorityKey({
					source: Source.Local_Internal,
					entityType: 'LocalAuthorityFixture',
					selectorKey: queuedRelationshipSelectorKey,
					fieldName: 'items',
					fieldAddressKey: queuedItemsFieldAddressKey,
					facetPathKey: stringify([]),
				}),
				'resolved',
				applyQueuedCount
			),
		]
		queuedItemsCollection.startSyncImmediate()
		expect(queuedItemsCollection.toArray).toEqual([])
		expect(queuedItemsCountCollection.toArray).toEqual([])
		queuedItemsCountCollection.startSyncImmediate()
		await Promise.all(queuedRelationshipApplications)
		expect(queuedCountApplications).toEqual([
			1,
			0,
		])
		expect(queuedItemsCountCollection.toArray).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Value]: 0,
			}),
		])

		const rejectedContext = createContext()
		const rejectedSelector = {
			slug: 'rejected',
		}
		const rejectedFollowerSelector = {
			slug: 'rejected-follower',
		}
		const rejectedSelectorKey = stringify(rejectedSelector)
		const rejectedFollowerSelectorKey = stringify(rejectedFollowerSelector)
		const rejectedMutation = rejectedContext.entityCollections.LocalAuthorityFixture.utils.writeUpsertWithAuthority(
			{
				[EntityMetaKey.Selector]: rejectedSelector,
				[EntityMetaKey.SelectorKey]: rejectedSelectorKey,
				[EntityMetaKey.Source]: Source.Local_Internal,
			},
			rejectedSelectorKey,
			localMutationAuthorityKey({
				source: Source.Local_Internal,
				entityType: 'LocalAuthorityFixture',
				selectorKey: rejectedSelectorKey,
			}),
			'present',
			() => {
				throw new Error('queued application failed')
			}
		)
		const rejectedFollowerMutation = rejectedContext.entityCollections.LocalAuthorityFixture.utils.writeUpsertWithAuthority(
			{
				[EntityMetaKey.Selector]: rejectedFollowerSelector,
				[EntityMetaKey.SelectorKey]: rejectedFollowerSelectorKey,
				[EntityMetaKey.Source]: Source.Local_Internal,
			},
			rejectedFollowerSelectorKey,
			localMutationAuthorityKey({
				source: Source.Local_Internal,
				entityType: 'LocalAuthorityFixture',
				selectorKey: rejectedFollowerSelectorKey,
			}),
			'present'
		)
		const rejectedMutationError = rejectedMutation.catch((error) => error)
		const rejectedFollowerMutationError = rejectedFollowerMutation.catch((error) => error)
		rejectedContext.entityCollections.LocalAuthorityFixture.startSyncImmediate()
		expect(await rejectedMutationError).toEqual(new Error('queued application failed'))
		expect(await rejectedFollowerMutationError).toEqual(new Error('queued application failed'))
		expect(rejectedContext.entityCollections.LocalAuthorityFixture.toArray.map((row) => (
			row[EntityMetaKey.SelectorKey]
		))).toEqual([
			rejectedSelectorKey,
		])
		rejectedContext.entityCollections.LocalAuthorityFixture.utils.deleteSelectorRowsAndAuthority(
			(row) => row[EntityMetaKey.SelectorKey] === rejectedSelectorKey,
			rejectedSelectorKey
		)
		await rejectedContext.entityCollections.LocalAuthorityFixture.utils.waitForPersistence()

		const preSyncContext = createContext()
		const preSyncEntitySelector = {
			slug: 'pre-sync',
		}
		const preSyncSelectorKey = stringify(preSyncEntitySelector)
		preSyncContext.entityCollections.LocalAuthorityFixture.startSyncImmediate()
		preSyncContext.entityCollections.LocalAuthorityFixture.utils.writeUpsertWithAuthority(
			{
				[EntityMetaKey.Selector]: preSyncEntitySelector,
				[EntityMetaKey.SelectorKey]: preSyncSelectorKey,
				[EntityMetaKey.Source]: Source.Local_Internal,
			},
			preSyncSelectorKey,
			localMutationAuthorityKey({
				source: Source.Local_Internal,
				entityType: 'LocalAuthorityFixture',
				selectorKey: preSyncSelectorKey,
			}),
			'present'
		)
		await preSyncContext.entityCollections.LocalAuthorityFixture.utils.waitForPersistence()
		expect(collectionRowsByCollectionId.get(
			preSyncContext.entityCollections.LocalAuthorityFixture.id
		)?.size).toBe(3)

		const context = createContext()
		const entitySelector = {
			slug: 'runtime',
		}
		const selectorKey = stringify(entitySelector)
		const fieldAddressKey = entityFieldAddressKey('LocalAuthorityFixture', [], 'note')
		const relatedFieldAddressKey = entityFieldAddressKey('LocalAuthorityFixture', [], '$related')
		const resource = subscribeEntityField(
			context,
			'LocalAuthorityFixture',
			entitySelector,
			'note',
			{
				sources: [Source.Local_Internal],
			}
		)
		const relatedResource = subscribeEntityField(
			context,
			'LocalAuthorityFixture',
			entitySelector,
			'$related',
			{
				sources: [Source.Local_Internal],
			}
		)
		const entityResource = context.select(
			'LocalAuthorityFixture',
			entitySelector
		)({
			sources: [Source.Local_Internal],
			fields: {
				slug: true,
				note: true,
			},
		})
		expect(subscribeEntityField(
			context,
			'LocalAuthorityFixture',
			entitySelector,
			'note',
			{
				sources: [Source.Local_Internal],
			}
		)).toBe(resource)
		expect(resource.current).toBeUndefined()
		context.entityCollections.LocalAuthorityFixture.utils.writeUpsertWithAuthority(
			{
				[EntityMetaKey.Selector]: entitySelector,
				[EntityMetaKey.SelectorKey]: selectorKey,
				[EntityMetaKey.Source]: Source.Local_Internal,
			},
			selectorKey,
			localMutationAuthorityKey({
				source: Source.Local_Internal,
				entityType: 'LocalAuthorityFixture',
				selectorKey,
			}),
			'present'
		)
		context.entityFieldCollections.LocalAuthorityFixture[fieldAddressKey].utils.writeUpsertWithAuthority({
			facetPath: [],
			facetPathKey: stringify([]),
			fieldName: 'note',
			[EntityMetaKey.ParentSelector]: entitySelector,
			[EntityMetaKey.ParentSelectorKey]: selectorKey,
			[EntityMetaKey.Source]: Source.Local_Internal,
			[EntityMetaKey.Value]: 'Persisted locally',
			valueKey: `Value:${stringify('Persisted locally')}`,
		},
			selectorKey,
			localMutationAuthorityKey({
				source: Source.Local_Internal,
				entityType: 'LocalAuthorityFixture',
				selectorKey,
				fieldName: 'note',
				fieldAddressKey,
				facetPathKey: stringify([]),
			}),
			'resolved'
		)
		context.entityFieldCollections.LocalAuthorityFixture[relatedFieldAddressKey].utils.writeUpsertWithAuthority({
			facetPath: [],
			facetPathKey: stringify([]),
			fieldName: '$related',
			[EntityMetaKey.ParentSelector]: entitySelector,
			[EntityMetaKey.ParentSelectorKey]: selectorKey,
			[EntityMetaKey.Source]: Source.Local_Internal,
			[EntityMetaKey.Value]: {
				[EntityMetaKey.Selector]: {
					id: 'related',
				},
				[EntityMetaKey.SelectorKey]: stringify({ id: 'related' }),
			},
			valueKey: `Entity:${stringify({ id: 'related' })}`,
		},
			selectorKey,
			localMutationAuthorityKey({
				source: Source.Local_Internal,
				entityType: 'LocalAuthorityFixture',
				selectorKey,
				fieldName: '$related',
				fieldAddressKey: relatedFieldAddressKey,
				facetPathKey: stringify([]),
			}),
			'resolved'
		)

		await expect.poll(() => resource.current).toBe('Persisted locally')
		await expect(resource).resolves.toBe('Persisted locally')
		await expect.poll(() => entityResource.current?.note).toBe('Persisted locally')
		await expect(entityResource).resolves.toMatchObject({
			slug: 'runtime',
			note: 'Persisted locally',
		})
		context.entityFieldCollections.LocalAuthorityFixture[fieldAddressKey].utils.replaceRowsWithAuthority(
			(row) => row[EntityMetaKey.ParentSelectorKey] === selectorKey,
			[{
				facetPath: [],
				facetPathKey: stringify([]),
				fieldName: 'note',
				[EntityMetaKey.ParentSelector]: entitySelector,
				[EntityMetaKey.ParentSelectorKey]: selectorKey,
				[EntityMetaKey.Source]: Source.Local_Internal,
				[EntityMetaKey.Value]: 'Updated locally',
				valueKey: `Value:${stringify('Updated locally')}`,
			}],
			selectorKey,
			localMutationAuthorityKey({
				source: Source.Local_Internal,
				entityType: 'LocalAuthorityFixture',
				selectorKey,
				fieldName: 'note',
				fieldAddressKey,
				facetPathKey: stringify([]),
			}),
			'resolved'
		)
		await expect.poll(() => resource.current).toBe('Updated locally')
		await expect(resource).resolves.toBe('Updated locally')
		await expect.poll(() => entityResource.current?.note).toBe('Updated locally')
		await expect(entityResource).resolves.toMatchObject({
			slug: 'runtime',
			note: 'Updated locally',
		})
		await expect.poll(() => relatedResource.current).toMatchObject({
			[EntityMetaKey.Selector]: {
				id: 'related',
			},
		})
		await expect(relatedResource).resolves.toMatchObject({
			[EntityMetaKey.Selector]: {
				id: 'related',
			},
		})
		await expect(context.select(
			'LocalAuthorityFixture',
			entitySelector
		)({
			sources: [Source.Local_Internal],
			fields: {
				slug: true,
				note: true,
			},
		})).resolves.toMatchObject({
			slug: 'runtime',
			note: 'Updated locally',
		})

		const absentEntitySelector = {
			slug: 'runtime-absent',
		}
		const absentSelectorKey = stringify(absentEntitySelector)
		const absentResource = subscribeEntityField(
			context,
			'LocalAuthorityFixture',
			absentEntitySelector,
			'note',
			{
				sources: [Source.Local_Internal],
			}
		)
		expect(absentResource.ready).toBe(false)
		context.entityFieldCollections.LocalAuthorityFixture[fieldAddressKey].utils.replaceRowsWithAuthority(
			() => false,
			[],
			absentSelectorKey,
			localMutationAuthorityKey({
				source: Source.Local_Internal,
				entityType: 'LocalAuthorityFixture',
				selectorKey: absentSelectorKey,
				fieldName: 'note',
				fieldAddressKey,
				facetPathKey: stringify([]),
			}),
			'resolved'
		)
		context.entityFieldCollections.LocalAuthorityFixture[relatedFieldAddressKey].utils.replaceRowsWithAuthority(
			() => false,
			[],
			absentSelectorKey,
			localMutationAuthorityKey({
				source: Source.Local_Internal,
				entityType: 'LocalAuthorityFixture',
				selectorKey: absentSelectorKey,
				fieldName: '$related',
				fieldAddressKey: relatedFieldAddressKey,
				facetPathKey: stringify([]),
			}),
			'resolved'
		)

		await expect.poll(() => absentResource.ready).toBe(true)
		await expect(absentResource).resolves.toBeUndefined()
		await Promise.all([
			context.entityFieldCollections.LocalAuthorityFixture[fieldAddressKey].utils.waitForPersistence(),
			context.entityFieldCollections.LocalAuthorityFixture[relatedFieldAddressKey].utils.waitForPersistence(),
		])
		const restartedContext = createContext()
		const restartedAbsentResource = subscribeEntityField(
			restartedContext,
			'LocalAuthorityFixture',
			absentEntitySelector,
			'note',
			{
				sources: [Source.Local_Internal],
			}
		)
		await expect.poll(() => restartedAbsentResource.ready).toBe(true)
		await expect(restartedAbsentResource).resolves.toBeUndefined()
		const restartedAbsentReference = restartedContext.select(
			'LocalAuthorityFixture',
			absentEntitySelector,
			{
				sources: [Source.Local_Internal],
			}
		).$related
		await expect.poll(() => restartedAbsentReference.ready).toBe(true)
		await expect(restartedAbsentReference).resolves.toBeUndefined()

		const itemsFieldAddressKey = entityFieldAddressKey('LocalAuthorityFixture', [], 'items')
		const emptyItemsEntitySelector = {
			slug: 'runtime-empty-items',
		}
		const emptyItemsSelectorKey = stringify(emptyItemsEntitySelector)
		context.entityFieldCountCollections.LocalAuthorityFixture[itemsFieldAddressKey]?.utils.writeUpsertWithAuthority({
			[EntityMetaKey.ParentSelector]: emptyItemsEntitySelector,
			[EntityMetaKey.ParentSelectorKey]: emptyItemsSelectorKey,
			[EntityMetaKey.Source]: Source.Local_Internal,
			[EntityMetaKey.Value]: 0,
			facetPath: [],
			facetPathKey: stringify([]),
			fieldName: 'items',
			filterKey: stringify({}),
		},
			emptyItemsSelectorKey,
			localMutationAuthorityKey({
				source: Source.Local_Internal,
				entityType: 'LocalAuthorityFixture',
				selectorKey: emptyItemsSelectorKey,
				fieldName: 'items',
				fieldAddressKey: itemsFieldAddressKey,
				facetPathKey: stringify([]),
				filterKey: stringify({}),
			}),
			'resolved'
		)
		context.entityFieldCollections.LocalAuthorityFixture[itemsFieldAddressKey].utils.replaceRowsWithAuthority(
			() => false,
			[],
			emptyItemsSelectorKey,
			localMutationAuthorityKey({
				source: Source.Local_Internal,
				entityType: 'LocalAuthorityFixture',
				selectorKey: emptyItemsSelectorKey,
				fieldName: 'items',
				fieldAddressKey: itemsFieldAddressKey,
				facetPathKey: stringify([]),
			}),
			'resolved'
		)
		const emptyItemsResource = subscribeEntityField(
			context,
			'LocalAuthorityFixture',
			emptyItemsEntitySelector,
			'items',
			{
				sources: [Source.Local_Internal],
			}
		)
		await expect.poll(() => emptyItemsResource.current).toMatchObject({
			values: [],
		})
		await expect(emptyItemsResource).resolves.toMatchObject({
			values: [],
		})
		await expect(subscribeEntityFieldCount(
			context,
			'LocalAuthorityFixture',
			emptyItemsEntitySelector,
			'items',
			{
				sources: [Source.Local_Internal],
			}
		)).resolves.toBe(0)
		const emptyItemsProxyResource = context.select(
			'LocalAuthorityFixture',
			emptyItemsEntitySelector,
			{
				sources: [Source.Local_Internal],
			}
		).items({
			sources: [Source.Local_Internal],
		})
		await expect.poll(() => emptyItemsProxyResource.current).toMatchObject({
			values: [],
		})
		await expect(emptyItemsProxyResource).resolves.toMatchObject({
			values: [],
		})
		await expect(context.select(
			'LocalAuthorityFixture',
			emptyItemsEntitySelector
		).items.count({
			sources: [Source.Local_Internal],
		})).resolves.toBe(0)

		const itemsResource = subscribeEntityField(
			context,
			'LocalAuthorityFixture',
			entitySelector,
			'items',
			{
				sources: [Source.Local_Internal],
			}
		)
		const filteredItemsResource = subscribeEntityField(
			context,
			'LocalAuthorityFixture',
			entitySelector,
			'items',
			{
				sources: [Source.Local_Internal],
				where: ({ row }) => eq(row.valueKey, `Value:${stringify('First')}`),
				limit: 1,
			}
		)
		context.entityFieldCollections.LocalAuthorityFixture[itemsFieldAddressKey].utils.writeUpsertWithAuthority({
			facetPath: [],
			facetPathKey: stringify([]),
			fieldName: 'items',
			[EntityMetaKey.ParentSelector]: entitySelector,
			[EntityMetaKey.ParentSelectorKey]: selectorKey,
			[EntityMetaKey.Source]: Source.Local_Internal,
			[EntityMetaKey.Value]: 'First',
			valueIndex: 0,
			valueKey: `Value:${stringify('First')}`,
		},
			selectorKey,
			localMutationAuthorityKey({
				source: Source.Local_Internal,
				entityType: 'LocalAuthorityFixture',
				selectorKey,
				fieldName: 'items',
				fieldAddressKey: itemsFieldAddressKey,
				facetPathKey: stringify([]),
				valueKey: `Value:${stringify('First')}`,
				valueIndex: 0,
			}),
			'present'
		)
		await Promise.resolve()
		expect(itemsResource.ready).toBe(false)
		expect(filteredItemsResource.ready).toBe(false)

		context.entityFieldCountCollections.LocalAuthorityFixture[itemsFieldAddressKey]?.utils.writeUpsertWithAuthority({
			[EntityMetaKey.ParentSelector]: entitySelector,
			[EntityMetaKey.ParentSelectorKey]: selectorKey,
			[EntityMetaKey.Source]: Source.Local_Internal,
			[EntityMetaKey.Value]: 1,
			facetPath: [],
			facetPathKey: stringify([]),
			fieldName: 'items',
			filterKey: stringify({}),
		},
			selectorKey,
			localMutationAuthorityKey({
				source: Source.Local_Internal,
				entityType: 'LocalAuthorityFixture',
				selectorKey,
				fieldName: 'items',
				fieldAddressKey: itemsFieldAddressKey,
				facetPathKey: stringify([]),
				filterKey: stringify({}),
			}),
			'resolved'
		)
		context.entityFieldCollections.LocalAuthorityFixture[itemsFieldAddressKey].utils.replaceRowsWithAuthority(
			() => false,
			[],
			selectorKey,
			localMutationAuthorityKey({
				source: Source.Local_Internal,
				entityType: 'LocalAuthorityFixture',
				selectorKey,
				fieldName: 'items',
				fieldAddressKey: itemsFieldAddressKey,
				facetPathKey: stringify([]),
			}),
			'resolved'
		)

		await expect.poll(() => itemsResource.current).toMatchObject({
			values: ['First'],
		})
		await expect(context.select(
			'LocalAuthorityFixture',
			entitySelector
		).items.count({
			sources: [Source.Local_Internal],
		})).resolves.toBe(1)
		await expect.poll(() => filteredItemsResource.current).toMatchObject({
			values: ['First'],
		})
		await expect(filteredItemsResource).resolves.toMatchObject({
			values: ['First'],
		})

		const itemsCollectionId = context.entityFieldCollections.LocalAuthorityFixture[itemsFieldAddressKey].id
		const itemsCountCollectionId = context.entityFieldCountCollections.LocalAuthorityFixture[itemsFieldAddressKey]?.id
		await expect.poll(() => collectionMetadataByCollectionId.get(itemsCollectionId)?.size).toBeGreaterThan(0)
		await expect.poll(() => (
			itemsCountCollectionId === undefined ?
				0
			:
				collectionMetadataByCollectionId.get(itemsCountCollectionId)?.size
		)).toBeGreaterThan(0)
		await expect.poll(() => (
			collectionMetadataByCollectionId.get(context.entityCollections.LocalAuthorityFixture.id)?.size ?? 0
		)).toBeGreaterThan(0)
		await expect.poll(() => (
			collectionMetadataByCollectionId.get(
				context.entityFieldCollections.LocalAuthorityFixture[fieldAddressKey].id
			)?.size ?? 0
		)).toBeGreaterThan(0)
		const providerCallsBeforeReentry = providerCalls
		const reenteredContext = createContext()
		const reenteredFilteredItemsResource = subscribeEntityField(
			reenteredContext,
			'LocalAuthorityFixture',
			entitySelector,
			'items',
			{
				sources: [Source.Local_Internal],
				where: ({ row }) => eq(row.valueKey, `Value:${stringify('First')}`),
				limit: 1,
			}
		)
		await expect.poll(() => reenteredFilteredItemsResource.current).toMatchObject({
			values: ['First'],
		})
		await expect(reenteredFilteredItemsResource).resolves.toMatchObject({
			values: ['First'],
		})
		await expect(reenteredContext.select(
			'LocalAuthorityFixture',
			entitySelector
		)({
			sources: [Source.Local_Internal],
			fields: {
				note: true,
			},
		})).resolves.toMatchObject({
			note: 'Updated locally',
		})
		expect(localResolverCalls).toBe(0)
		expect(providerCalls).toBe(providerCallsBeforeReentry)
		reenteredContext.entityFieldCollections.LocalAuthorityFixture[fieldAddressKey].utils.replaceRowsWithAuthority(
			(row) => (
				row[EntityMetaKey.Source] === Source.Local_Internal
				&& row[EntityMetaKey.ParentSelectorKey] === selectorKey
			),
			[],
			selectorKey,
			localMutationAuthorityKey({
				source: Source.Local_Internal,
				entityType: 'LocalAuthorityFixture',
				selectorKey,
				fieldName: 'note',
				fieldAddressKey,
				facetPathKey: stringify([]),
			}),
			'deleted'
		)
		await reenteredContext.entityFieldCollections.LocalAuthorityFixture[fieldAddressKey].utils.waitForPersistence()
		await expect(subscribeEntityField(
			reenteredContext,
			'LocalAuthorityFixture',
			entitySelector,
			'note',
			{
				sources: [Source.Local_Internal],
			}
		)).resolves.toBeUndefined()
		expect(providerCalls).toBe(providerCallsBeforeReentry)

		await expect(subscribeEntityField(
			reenteredContext,
			'LocalAuthorityFixture',
			{
				slug: 'catalog',
			},
			'note',
			{
				sources: [Source.Constants_Internal],
			}
		)).resolves.toBe('Catalog value')
		expect(providerCalls).toBeGreaterThan(providerCallsBeforeReentry)

		reenteredContext.entityFieldCollections.LocalAuthorityFixture[itemsFieldAddressKey]
			.utils.deleteSelectorRowsAndAuthority(
				(row) => (
					row[EntityMetaKey.Source] === Source.Local_Internal
					&& row[EntityMetaKey.ParentSelectorKey] === selectorKey
				),
				selectorKey
			)
		reenteredContext.entityFieldCountCollections.LocalAuthorityFixture[itemsFieldAddressKey]
			?.utils.deleteSelectorRowsAndAuthority(
				(row) => (
					row[EntityMetaKey.Source] === Source.Local_Internal
					&& row[EntityMetaKey.ParentSelectorKey] === selectorKey
				),
				selectorKey
			)
		await expect.poll(() => (
			reenteredContext.entityFieldCollections.LocalAuthorityFixture[itemsFieldAddressKey].toArray
		)).toHaveLength(0)
		const deletedItemsResource = subscribeEntityField(
			reenteredContext,
			'LocalAuthorityFixture',
			entitySelector,
			'items',
			{
				sources: [Source.Local_Internal],
				where: ({ row }) => eq(row.valueKey, `Value:${stringify('First')}`),
				limit: 1,
			}
		)
		expect(deletedItemsResource.current).toBeUndefined()
		expect(deletedItemsResource.ready).toBe(false)
	}, 30_000)

	it('keeps view-facing reads behind the proxy and subscribe files', () => {
		expect(source('$proxy.svelte.ts')).not.toMatch(/entityCollections|entityFieldCollections|queryCollectionOptions/)
		expect(source('$proxy.svelte.ts')).not.toMatch(/activeReferenceResources|referenceResourceBySelector/)
		expect(source('$subscribe.svelte.ts')).not.toMatch(/queryCollectionOptions|persistedCollectionOptions/)
		expect(source('$subscribe.svelte.ts')).toMatch(/subscribeEntityField[\s\S]*nestedResourceBySelectorKey/)
	})
})
