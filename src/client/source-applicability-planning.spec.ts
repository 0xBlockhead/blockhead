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
	inArray,
} from '@tanstack/db'
import type { PersistenceAdapter } from '@tanstack/db-sqlite-persistence-core'
import { stringify } from 'devalue'

import {
	client,
	entityResolverSourcesForSelectorKeys,
} from '$/client/$client.svelte.ts'
import { subscribeEntityField } from '$/client/$subscribe.svelte.ts'
import {
	materializeResolverOutput,
	ResolverOutputMaterialization,
} from '$/collections/assertLoadedCollectionRows.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	indexResolvers,
	resolverDefinitionsKey,
	resolverPartsKey,
	type SourceResolverModule,
} from '$/resolvers/$resolvers.ts'
import cosmosSdkResolvers from '$/resolvers/CosmosSdk-Rest.ts'
import superchainResolvers from '$/resolvers/Superchain-Github.ts'
import {
	EntityMetaKey,
	entity,
	entityFieldAddressKey,
	entitySelectorKey,
	facet,
	indexSchema,
} from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { type as arktype } from 'arktype'


const networkDefinition = schema.find((definition) => definition.entityType === EntityType.Network)
if (networkDefinition == null)
	throw new Error('Network schema definition missing')

const resolverIndexes = indexResolvers(
	schema,
	[
		cosmosSdkResolvers,
		superchainResolvers,
	],
	new Set([
		Source.CosmosSdk_Rest,
		Source.Superchain_Github,
	])
)

const networkSources = (
	entitySelector: {
		readonly caip2: {
			readonly namespace: string
			readonly reference: string
		}
	}
) => entityResolverSourcesForSelectorKeys(
	schema,
	networkDefinition,
	[stringify(entitySelector)],
	resolverIndexes.resolverDefinitionsByEntityType[EntityType.Network] ?? [],
	[
		Source.CosmosSdk_Rest,
		Source.Superchain_Github,
	]
)

const fixtureSchema = [
	entity({
		entityType: 'ApplicabilityFixture',
		labels: {
			singular: 'Applicability fixture',
			plural: 'Applicability fixtures',
		},
	})({
		slug: {
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.One,
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
				},
			}),
		},
	}),
] as const

const testSourceIndex = <const _Source extends string>(sources: readonly _Source[]) => ({
	enabledBindingIds: new Set<string>(),
	enabledSources: new Set(sources),
	resolverPublicEnvBySource: new Map(sources.map((source) => [source, {}])),
})


describe('source applicability planning contract', () => {
	it.each([
		['ethereum', []],
		['arbitrum', []],
		['optimism', [Source.Superchain_Github]],
		['cosmos', [Source.CosmosSdk_Rest]],
	] as const)('plans applicable sources for %s', (network, expectedSources) => {
		expect(networkSources({
			caip2: networkBySlug[network].caip2,
		})).toEqual(expectedSources)
	})

	it('excluded source never invokes or owns outcome', async () => {
		const excludedResolve = vi.fn(async () => ({ kind: 'excluded' }))
		const includedResolve = vi.fn(async () => ({ kind: 'included' }))
		const indexed = indexResolvers(fixtureSchema, [
			{
				source: 'Fixture',
				resolvers: [{
					entityType: 'ApplicabilityFixture',
					resolve: {
						Slug: {
							appliesTo: [{
								slug: 'included',
							}],
							resolve: includedResolve,
						},
					},
					projections: {
						kind: (snapshot) => snapshot.kind,
					},
				}],
			},
			{
				source: 'Excluded',
				resolvers: [{
					entityType: 'ApplicabilityFixture',
					resolve: {
						Slug: {
							appliesTo: [{
								slug: 'excluded',
							}],
							resolve: excludedResolve,
						},
					},
					projections: {
						kind: (snapshot) => snapshot.kind,
					},
				}],
			},
		] satisfies SourceResolverModule<
			typeof fixtureSchema,
			'Fixture' | 'Excluded'
		>[], new Set([
			'Fixture',
			'Excluded',
		]))
		const selector = {
			slug: 'included',
		}
		const admittedSources = entityResolverSourcesForSelectorKeys(
			fixtureSchema,
			fixtureSchema[0],
			[stringify(selector)],
			indexed.resolverDefinitionsByEntityType.ApplicabilityFixture ?? [],
			[
				'Fixture',
				'Excluded',
			]
		)
		const outcomes = []
		for (const resolver of indexed.resolverDefinitionsByEntityTypeAndSelectorName[
			resolverDefinitionsKey('ApplicabilityFixture', 'Slug')
		] ?? []) {
			if (!admittedSources.includes(resolver.source))
				continue

			outcomes.push({
				source: resolver.source,
				value: await resolver.resolve.Slug?.(selector, {
					env: {},
					publicEnv: {},
				}),
			})
		}

		expect(includedResolve).toHaveBeenCalledOnce()
		expect(excludedResolve).not.toHaveBeenCalled()
		expect(outcomes).toEqual([{
			source: 'Fixture',
			value: {
				kind: 'included',
			},
		}])
	})

	it('excluded root live resolver never starts', async () => {
		const includedStart = vi.fn()
		const excludedStart = vi.fn()
		const context = client({
			schema: fixtureSchema,
			sourceProviders: [
				{
					provider: 'Included',
					label: 'Included',
					sources: {
						'Included': {
							label: 'Included',
						},
					},
					bindings: {},
				},
				{
					provider: 'Excluded',
					label: 'Excluded',
					sources: {
						'Excluded': {
							label: 'Excluded',
						},
					},
					bindings: {},
				},
			],
		})({
			resolvers: [
				{
					source: 'Included',
					resolvers: [{
						entityType: 'ApplicabilityFixture',
						resolve: {
							Slug: {
								appliesTo: [{
									slug: 'included',
								}],
								resolve: async () => ({
									kind: 'summary',
								}),
							},
						},
						resolveLive: {
							kind: {
								facetPath: [],
								publishes: {
									kind: true,
								},
								start: includedStart,
							},
						},
						projections: {
							kind: (snapshot) => snapshot.kind,
						},
					}],
				},
				{
					source: 'Excluded',
					resolvers: [{
						entityType: 'ApplicabilityFixture',
						resolve: {
							Slug: {
								appliesTo: [{
									slug: 'excluded',
								}],
								resolve: async () => ({
									kind: 'summary',
								}),
							},
						},
						resolveLive: {
							kind: {
								facetPath: [],
								publishes: {
									kind: true,
								},
								start: excludedStart,
							},
						},
						projections: {
							kind: (snapshot) => snapshot.kind,
						},
					}],
				},
			],
			sourceIndex: testSourceIndex(['Included', 'Excluded']),
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
		const fieldCollection = context.entityFieldCollections.ApplicabilityFixture[
			entityFieldAddressKey('ApplicabilityFixture', [], 'kind')
		]
		const parentSelectorKey = stringify({
			slug: 'included',
		})
		const query = createLiveQueryCollection({
			startSync: true,
			query: (query) => query
				.from({
					row: fieldCollection,
				})
				.where(({ row }) => eq(row[EntityMetaKey.ParentSelectorKey], parentSelectorKey)),
		})
		const subscription = query.subscribeChanges(() => {}, {
			includeInitialState: true,
		})

		await expect.poll(() => includedStart.mock.calls.length).toBe(1)
		expect(excludedStart).not.toHaveBeenCalled()

		subscription.unsubscribe()
	})

	it('keeps required and selector-owned field planning row-local', async () => {
		const collectionRows = new Map<string, Map<string | number, object>>()
		const collectionMetadata = new Map<string, Map<string, object>>()
		const persistence = {
			adapter: {
				loadSubset: async (collectionId) => [
					...(collectionRows.get(collectionId) ?? new Map()),
				].map(([key, value]) => ({
					key,
					value,
				})),
				applyCommittedTx: async (collectionId, transaction) => {
					const rows = collectionRows.get(collectionId) ?? new Map()
					for (const mutation of transaction.mutations) {
						if (mutation.type === 'delete')
							rows.delete(mutation.key)
						else
							rows.set(mutation.key, mutation.value)
					}
					collectionRows.set(collectionId, rows)

					const metadata = collectionMetadata.get(collectionId) ?? new Map()
					for (const mutation of transaction.collectionMetadataMutations ?? []) {
						if (mutation.type === 'delete')
							metadata.delete(mutation.key)
						else
							metadata.set(mutation.key, mutation.value)
					}
					collectionMetadata.set(collectionId, metadata)
				},
				loadCollectionMetadata: async (collectionId) => [
					...(collectionMetadata.get(collectionId) ?? new Map()),
				].map(([key, value]) => ({
					key,
					value,
				})),
				ensureIndex: async () => {},
			} satisfies PersistenceAdapter,
		}
		const createContext = () => client({
			schema: fixtureSchema,
			sourceProviders: [{
				provider: 'Restricted',
				label: 'Restricted',
				sources: {
					'Restricted': {
						label: 'Restricted',
					},
				},
				bindings: {},
			}],
		})({
			resolvers: [{
				source: 'Restricted',
				resolvers: [{
					entityType: 'ApplicabilityFixture',
					resolve: {
						Slug: {
							appliesTo: [{
								slug: 'included',
							}],
							resolve: async () => ({
								slug: 'included',
								kind: 'summary',
							}),
						},
					},
					projections: {
						slug: (snapshot) => snapshot.slug,
						kind: (snapshot) => snapshot.kind,
					},
				}],
			}],
			sourceIndex: testSourceIndex(['Restricted']),
		})({
			queryClient: new QueryClient(),
			persistence,
			schemaVersion: 1,
		})
		const context = createContext()

		await expect(subscribeEntityField(
			context,
			'ApplicabilityFixture',
			{
				slug: 'excluded',
			},
			'kind',
			{
				sources: ['Restricted'],
			}
		)).resolves.toBeUndefined()

		const includedSelectorKey = stringify({ slug: 'included' })
		const excludedSelectorKey = stringify({ slug: 'excluded' })
		const selectorFieldRows = createLiveQueryCollection({
			query: (query) => query
				.from({
					row: context.entityFieldCollections.ApplicabilityFixture[
						entityFieldAddressKey('ApplicabilityFixture', [], 'slug')
					],
				})
				.where(({ row }) => and(
					inArray(row[EntityMetaKey.ParentSelectorKey], [
						includedSelectorKey,
						excludedSelectorKey,
					]),
					eq(row[EntityMetaKey.Source], 'Restricted')
				)),
		})
		await selectorFieldRows.preload()

		expect(selectorFieldRows.toArray.map((row) => row[EntityMetaKey.ParentSelectorKey])).toEqual([
			includedSelectorKey,
		])

		const fieldCollection = context.entityFieldCollections.ApplicabilityFixture[
			entityFieldAddressKey('ApplicabilityFixture', [], 'slug')
		]
		await expect.poll(() => collectionRows.get(fieldCollection.id)?.size).toBe(1)
		const persistedRow = [...collectionRows.get(fieldCollection.id) ?? []][0]

		const staleRow = {
			...persistedRow[1],
			[EntityMetaKey.ParentSelector]: {
				slug: 'excluded',
			},
			[EntityMetaKey.ParentSelectorKey]: excludedSelectorKey,
			[EntityMetaKey.Value]: 'excluded',
			valueKey: stringify('excluded'),
		}
		const staleRowKey = stringify([
			'Restricted',
			excludedSelectorKey,
			staleRow.facetPathKey,
			staleRow.valueKey,
			staleRow.valueIndex,
		])
		collectionRows.get(fieldCollection.id)?.set(staleRowKey, staleRow)
		await expect.poll(() => collectionMetadata.get(fieldCollection.id)?.size).toBe(1)
		const metadataEntry = [...collectionMetadata.get(fieldCollection.id) ?? []][0]
		collectionMetadata.get(fieldCollection.id)?.set(metadataEntry[0], {
			...metadataEntry[1],
			rowCount: 2,
			sourceRowCounts: {
				Restricted: 2,
			},
			sourceRowKeys: {
				Restricted: [
					persistedRow[0],
					staleRowKey,
				],
			},
		})

		const warmContext = createContext()
		const warmRows = createLiveQueryCollection({
			query: (query) => query
				.from({
					row: warmContext.entityFieldCollections.ApplicabilityFixture[
						entityFieldAddressKey('ApplicabilityFixture', [], 'slug')
					],
				})
				.where(({ row }) => and(
					inArray(row[EntityMetaKey.ParentSelectorKey], [
						includedSelectorKey,
						excludedSelectorKey,
					]),
					eq(row[EntityMetaKey.Source], 'Restricted')
				)),
		})
		await warmRows.preload()

		expect(warmRows.toArray.map((row) => row[EntityMetaKey.ParentSelectorKey])).toEqual([
			includedSelectorKey,
		])
		await expect.poll(() => collectionRows.get(fieldCollection.id)?.has(staleRowKey)).toBe(false)
		expect(collectionRows.get(fieldCollection.id)?.has(persistedRow[0])).toBe(true)
	})

	it('admitted required undefined remains failure', () => {
		const schemaIndex = indexSchema(fixtureSchema)
		const selector = {
			slug: 'included',
		}
		expect(() => materializeResolverOutput({
			kind: ResolverOutputMaterialization.Field,
			schema: fixtureSchema,
			schemaIndex,
			entityDefinition: fixtureSchema[0],
			parentSelector: selector,
			parentSelectorKey: entitySelectorKey(
				fixtureSchema,
				fixtureSchema[0],
				selector
			),
			source: 'Fixture',
			fieldDefinition: fixtureSchema[0].fields[1],
			value: undefined,
		})).toThrow(/ApplicabilityFixture.*kind.*Fixture/)
	})

	it('facet applicability intersects independently', () => {
		const indexed = indexResolvers(fixtureSchema, [{
			source: 'Fixture',
			resolvers: [{
				entityType: 'ApplicabilityFixture',
				resolve: {
					Slug: {
						appliesTo: [{
							slug: 'included',
						}],
						resolve: async () => ({
							kind: 'summary',
							status: 'ready',
						}),
					},
				},
				projections: {
					kind: (snapshot) => snapshot.kind,
					Details: {
						status: (snapshot) => snapshot.status,
					},
				},
			}],
		}] satisfies SourceResolverModule<typeof fixtureSchema, 'Fixture'>[], new Set(['Fixture']))
		const part = indexed.resolverValuePartsByEntityTypeSelectorAndFieldName[
			resolverPartsKey(
				'ApplicabilityFixture',
				'Slug',
				['Details'],
				'status'
			)
		][0]

		expect(part.facetPath).toEqual(['Details'])
		expect(part.resolver.appliesTo('Slug', {
			slug: 'included',
		})).toBe(true)
		expect(fixtureSchema[0].facets[0].condition).toEqual({
			path: ['kind'],
			is: 'details',
		})
	})

})
