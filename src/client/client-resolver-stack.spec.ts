import {
	describe,
	expect,
	it,
} from 'vitest'
import { QueryClient } from '@tanstack/query-core'
import { BaseQueryBuilder, and, eq, inArray } from '@tanstack/db'
import type { LoadSubsetOptions } from '@tanstack/db'
import type { IR } from '@tanstack/db'
import { type as arktype } from 'arktype'
import { stringify } from 'devalue'

import {
	createCollections,
	subscribeEntity,
	type EntityCollectionsContext,
} from '$/client/$client.svelte.ts'
import {
	EntityFieldCardinality,
	EntityFieldType,
	EntityMetaKey,
	entityIdKey,
	indexSchema,
	type EntityDefinition,
	type Schema,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { indexResolvers } from '$/resolvers/$resolvers.ts'
import type {
	ResolveLiveFieldHandle,
	ResolveLivePublisherContext,
	ResolverContext,
	ResolverIndexes,
	SourceResolverDefinition,
} from '$/resolvers/$resolvers.ts'


type FixtureEntityId = (
	| {
		readonly id: string
	}
	| {
		readonly slug: string
	}
)

type FixtureSnapshot = {
	readonly id: string
	readonly slug: string
	readonly name: string
	readonly kind: string
	readonly labels: readonly string[]
	readonly tags: readonly string[]
	readonly networks: readonly FixtureNetworkReference[]
	readonly primaryNetwork?: FixtureNetworkReference
	readonly conditionalText?: string
	readonly indexedConditionalText?: string
}

type FixtureNetworkReference = {
	readonly [EntityMetaKey.Id]: {
		readonly id: string
	}
	readonly [EntityMetaKey.IdKey]: string
	readonly slug: string
	readonly name: string
	readonly rank: number
	readonly category: string
}

type ResolverCall = {
	readonly definitionIndex: number
	readonly source: Source
	readonly projectionName: string
	readonly context: ResolverContext
}

const fixtureEntityDefinition = {
	entityType: EntityType.Network,
	label: 'Fixture Network',
	labelPlural: 'Fixture Networks',
	id: arktype.or(
		arktype({
			id: 'string',
			'+': 'reject',
		}),
		arktype({
			slug: 'string',
			'+': 'reject',
		}),
	),
	lookups: [
		{
			name: 'slug',
			fields: [
				'slug',
			],
		},
	],
	identities: [
		{
			name: 'id',
			fields: [
				'id',
			],
		},
	],
	fields: [
		{
			name: 'id',
			type: EntityFieldType.Primitive,
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'slug',
			type: EntityFieldType.Primitive,
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'kind',
			type: EntityFieldType.Primitive,
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'labels',
			type: EntityFieldType.Primitive,
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: 'tags',
			type: EntityFieldType.Primitive,
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$primaryNetwork',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$networks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: 'conditionalText',
			type: EntityFieldType.Primitive,
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			when: {
				fieldName: 'kind',
				values: [
					'enabled',
				],
			},
		},
		{
			name: 'idConditionalText',
			type: EntityFieldType.Primitive,
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			when: {
				fieldName: 'id',
				values: [
					'parent',
				],
			},
		},
		{
			name: 'indexedConditionalText',
			type: EntityFieldType.Primitive,
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			when: {
				fieldName: 'labels',
				itemIndex: 1,
				values: [
					'target',
				],
			},
		},
		{
			name: 'conditionalTags',
			type: EntityFieldType.Primitive,
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.ZeroOrMany,
			when: {
				fieldName: 'kind',
				values: [
					'enabled',
				],
			},
		},
	],
} as const satisfies EntityDefinition

const fixtureSchema = [
	fixtureEntityDefinition,
] as const satisfies Schema

type FixtureLiveStart = {
	readonly source: Source
	readonly signal: AbortSignal
	readonly field: ResolveLiveFieldHandle<typeof fixtureSchema, EntityType.Network, '$$networks'>
}

type FixtureRootLiveStart = {
	readonly source: Source
	readonly signal: AbortSignal
	readonly fields: ResolveLivePublisherContext<typeof fixtureSchema, EntityType.Network>['fields']
}

const fixtureReference = (
	id: string,
	name: string,
	rank: number,
	category = 'public',
): FixtureNetworkReference => ({
	[EntityMetaKey.Id]: {
		id,
	},
	[EntityMetaKey.IdKey]: entityIdKey(fixtureEntityDefinition, {
		id,
	}),
	slug: id,
	name,
	rank,
	category,
})

const fixtureSnapshots = {
	parent: {
		id: 'parent',
		slug: 'parent-slug',
		name: 'Parent',
		kind: 'enabled',
		labels: [
			'other',
			'target',
		],
		tags: [
			'red',
			'green',
			'blue',
		],
		networks: [
			fixtureReference('network-b', 'Network B', 2, 'private'),
			fixtureReference('network-a', 'Network A', 1),
			fixtureReference('network-c', 'Network C', 3),
		],
		primaryNetwork: fixtureReference('network-a', 'Network A', 1),
		conditionalText: 'condition matched',
		indexedConditionalText: 'indexed condition matched',
	},
	networkA: {
		id: 'network-a',
		slug: 'network-a',
		name: 'Network A',
		kind: 'enabled',
		labels: [
			'other',
			'target',
		],
		tags: [
			'alpha',
			'beta',
		],
		networks: [],
		conditionalText: 'child condition matched',
		indexedConditionalText: 'child indexed condition matched',
	},
	networkB: {
		id: 'network-b',
		slug: 'network-b',
		name: 'Network B',
		kind: 'disabled',
		labels: [
			'other',
			'miss',
		],
		tags: [
			'gamma',
		],
		networks: [],
		conditionalText: 'should not appear',
		indexedConditionalText: 'should not appear',
	},
	networkC: {
		id: 'network-c',
		slug: 'network-c',
		name: 'Network C',
		kind: 'enabled',
		labels: [
			'other',
			'target',
		],
		tags: [],
		networks: [],
		conditionalText: 'child c condition matched',
		indexedConditionalText: 'child c indexed condition matched',
	},
	disabled: {
		id: 'disabled',
		slug: 'disabled-slug',
		name: 'Disabled',
		kind: 'disabled',
		labels: [
			'other',
			'miss',
		],
		tags: [],
		networks: [],
		conditionalText: 'should not appear',
		indexedConditionalText: 'should not appear',
	},
	missingLabel: {
		id: 'missing-label',
		slug: 'missing-label-slug',
		name: 'Missing Label',
		kind: 'enabled',
		labels: [
			'other',
		],
		tags: [],
		networks: [],
		indexedConditionalText: 'should not appear',
	},
} as const satisfies Record<string, FixtureSnapshot>

const snapshotForEntityId = (
	entityId: FixtureEntityId,
) => (
	'id' in entityId ?
		Object.values(fixtureSnapshots).find((snapshot) => snapshot.id === entityId.id)
	:
		Object.values(fixtureSnapshots).find((snapshot) => snapshot.slug === entityId.slug)
)

const createResolver = (
	calls: ResolverCall[],
	definitionIndex: number,
	source: Source,
	resolve: SourceResolverDefinition<typeof fixtureSchema, Source>['resolve'],
	fields: SourceResolverDefinition<typeof fixtureSchema, Source>['fields'],
): SourceResolverDefinition<typeof fixtureSchema, Source> => ({
	definitionIndex,
	source,
	entityType: EntityType.Network,
	resolve,
	fields,
})

const createResolve = (
	calls: ResolverCall[],
	definitionIndex: number,
	source: Source,
	projectionName: string,
	mode?: 'fail' | 'unsupported' | 'where',
) => async (
	entityId: FixtureEntityId,
	context: ResolverContext,
) => {
	calls.push({
		definitionIndex,
		source,
		projectionName,
		context,
	})
	if (mode === 'fail')
		throw new Error(`${source} primary resolve failed`)

	const snapshot = snapshotForEntityId(entityId)
	if (snapshot == null)
		return undefined
	if (mode === 'unsupported' && context.filters.some((filter) => filter.fieldPath.join('.') === 'category'))
		throw new Error('unsupported category filter')
	return {
		...snapshot,
		networks: (
			mode === 'where' ?
				snapshot.networks.filter((network) => context.filters.every((filter) => (
					filter.fieldPath.join('.') !== 'category'
					|| (
						filter.operator === 'eq'
						&& filter.value === network.category
					)
				)))
			:
				snapshot.networks
		),
	}
}

const fixtureResolverIndexes = (
	calls: ResolverCall[],
	liveStarts: FixtureLiveStart[] = [],
	rootLiveStarts: FixtureRootLiveStart[] = [],
	liveCleanups: string[] = [],
): ResolverIndexes<typeof fixtureSchema> => {
	const resolverDefinitions = [
		createResolver(calls, 0, Source.Local_Internal, {
			id: createResolve(calls, 0, Source.Local_Internal, 'id'),
			slug: createResolve(calls, 0, Source.Local_Internal, 'slug'),
		}, {
			id: (snapshot: FixtureSnapshot) => snapshot.id,
			slug: (snapshot: FixtureSnapshot) => snapshot.slug,
			name: (snapshot: FixtureSnapshot) => snapshot.name,
			kind: (snapshot: FixtureSnapshot) => snapshot.kind,
			labels: (snapshot: FixtureSnapshot) => snapshot.labels,
			tags: (snapshot: FixtureSnapshot) => snapshot.tags,
			$primaryNetwork: (snapshot: FixtureSnapshot) => snapshot.primaryNetwork,
			$$networks: {
				parentSelectors: [
					'id',
				],
				select: (snapshot: FixtureSnapshot) => snapshot.networks,
				resolveCount: (snapshot: FixtureSnapshot) => snapshot.networks.length,
			},
			conditionalText: (snapshot: FixtureSnapshot) => snapshot.conditionalText,
			indexedConditionalText: (snapshot: FixtureSnapshot) => snapshot.indexedConditionalText,
			conditionalTags: () => [],
		}),
		createResolver(calls, 1, Source.Constants_Internal, {
			id: createResolve(calls, 1, Source.Constants_Internal, 'id'),
		}, {
			id: (snapshot: FixtureSnapshot) => snapshot.id,
			slug: (snapshot: FixtureSnapshot) => snapshot.slug,
			name: () => 'Constants Parent',
			$$networks: {
				select: () => [
					fixtureReference('network-a', 'Constants Network A', 0),
					fixtureReference('network-d', 'Network D', 4),
				],
				resolveCount: () => 2,
			},
		}),
		createResolver(calls, 2, Source.Coingecko_Rest, {
			slug: createResolve(calls, 2, Source.Coingecko_Rest, 'slug'),
		}, {
			name: (snapshot: FixtureSnapshot) => `Slug ${snapshot.name}`,
		}),
		createResolver(calls, 3, Source.Local_Internal, {
			id: createResolve(calls, 3, Source.Local_Internal, 'id'),
		}, {
			slug: (snapshot: FixtureSnapshot) => snapshot.slug,
			name: (snapshot: FixtureSnapshot) => snapshot.name,
			$$networks: () => [
				fixtureReference('network-duplicate', 'Duplicate Part', 5, 'duplicate'),
			],
		}),
		createResolver(calls, 4, Source.Blockscout_Rest, {
			id: createResolve(calls, 4, Source.Blockscout_Rest, 'id', 'where'),
		}, {
			$$networks: {
				parentSelectors: [
					'id',
				],
				select: (snapshot: FixtureSnapshot) => snapshot.networks,
			},
		}),
		createResolver(calls, 5, Source.Etherscan_Rest, {
			id: createResolve(calls, 5, Source.Etherscan_Rest, 'id', 'unsupported'),
		}, {
			$$networks: {
				parentSelectors: [
					'id',
				],
				select: (snapshot: FixtureSnapshot) => snapshot.networks,
			},
		}),
		createResolver(calls, 6, Source.Defillama_Rest, {
			id: createResolve(calls, 6, Source.Defillama_Rest, 'id', 'fail'),
		}, {
			name: (snapshot: FixtureSnapshot) => snapshot.name,
		}),
		createResolver(calls, 7, Source.Allium_Rest, {
			id: createResolve(calls, 7, Source.Allium_Rest, 'id'),
		}, {
			$$networks: {
				parentSelectors: [
					'id',
				],
				select: () => {
					throw new Error('field facet failed')
				},
			},
		}),
		createResolver(calls, 8, Source.CoinMarketCap_Rest, {
			id: createResolve(calls, 8, Source.CoinMarketCap_Rest, 'id'),
		}, {
			$$networks: {
				parentSelectors: [
					'id',
				],
				select: (snapshot: FixtureSnapshot) => snapshot.networks,
				resolveCount: () => {
					throw new Error('count facet failed')
				},
			},
		}),
		createResolver(calls, 9, Source.Dune_Rest, {
			id: createResolve(calls, 9, Source.Dune_Rest, 'id'),
		}, {
			$$networks: {
				parentSelectors: [
					'slug',
				],
				select: (snapshot: FixtureSnapshot) => snapshot.networks,
				resolveCount: (snapshot: FixtureSnapshot) => snapshot.networks.length,
			},
		}),
		createResolver(calls, 10, Source.MetadataVision_Rest, {
			id: createResolve(calls, 10, Source.MetadataVision_Rest, 'id'),
		}, {
			kind: () => undefined,
		}),
		createResolver(calls, 11, Source.NostrBand_Rest, {
			id: createResolve(calls, 11, Source.NostrBand_Rest, 'id'),
		}, {
			tags: {
				partial: true,
				select: (snapshot: FixtureSnapshot) => snapshot.tags.slice(0, 2),
			},
		}),
		createResolver(calls, 12, Source.Primal_Rest, {
			id: createResolve(calls, 12, Source.Primal_Rest, 'id'),
		}, {
			tags: {
				select: () => {
					throw new Error('tags field facet failed')
				},
			},
		}),
		createResolver(calls, 13, Source.Neynar_Rest, {
			id: createResolve(calls, 13, Source.Neynar_Rest, 'id'),
		}, {
			idConditionalText: () => 'parent id matched without field hydration',
			conditionalText: () => 'field row condition matched',
		}),
		createResolver(calls, 14, Source.Atproto_Xrpc, {
			id: createResolve(calls, 14, Source.Atproto_Xrpc, 'id'),
		}, {
			conditionalText: () => 'should not resolve',
		}),
		{
			...createResolver(calls, 15, Source.Farcaster_Rest, {
				id: createResolve(calls, 15, Source.Farcaster_Rest, 'id'),
			}, {
				$$networks: {
					parentSelectors: [
						'id',
					],
					resolveLive: {
						start: (context: ResolveLivePublisherContext<typeof fixtureSchema, EntityType.Network> & {
							readonly field: ResolveLiveFieldHandle<typeof fixtureSchema, EntityType.Network, '$$networks'>
						}) => {
							liveStarts.push({
								source: Source.Farcaster_Rest,
								signal: context.signal,
								field: context.field,
							})
							return () => {
								liveCleanups.push(`${Source.Farcaster_Rest}:field`)
							}
						},
					},
				},
			}),
			resolveLive: {
				networkPublisher: {
					publishes: {
						$$networks: true,
					},
					start: (context: ResolveLivePublisherContext<typeof fixtureSchema, EntityType.Network>) => {
						rootLiveStarts.push({
							source: Source.Farcaster_Rest,
							signal: context.signal,
							fields: context.fields,
						})
						return () => {
							liveCleanups.push(`${Source.Farcaster_Rest}:root`)
						}
					},
				},
			} satisfies SourceResolverDefinition<typeof fixtureSchema, Source>['resolveLive'],
		},
		createResolver(calls, 16, Source.Reddit_Rest, {
			id: createResolve(calls, 16, Source.Reddit_Rest, 'id'),
		}, {
			$$networks: {
				parentSelectors: [
					'id',
				],
				resolveLive: {
					start: (context: ResolveLivePublisherContext<typeof fixtureSchema, EntityType.Network> & {
						readonly field: ResolveLiveFieldHandle<typeof fixtureSchema, EntityType.Network, '$$networks'>
					}) => {
						liveStarts.push({
							source: Source.Reddit_Rest,
							signal: context.signal,
							field: context.field,
						})
						return () => {
							liveCleanups.push(`${Source.Reddit_Rest}:field:16`)
						}
					},
				},
			},
		}),
		createResolver(calls, 17, Source.Reddit_Rest, {
			id: createResolve(calls, 17, Source.Reddit_Rest, 'id'),
		}, {
			$$networks: {
				parentSelectors: [
					'id',
				],
				resolveLive: {
					start: (context: ResolveLivePublisherContext<typeof fixtureSchema, EntityType.Network> & {
						readonly field: ResolveLiveFieldHandle<typeof fixtureSchema, EntityType.Network, '$$networks'>
					}) => {
						liveStarts.push({
							source: Source.Reddit_Rest,
							signal: context.signal,
							field: context.field,
						})
						return () => {
							liveCleanups.push(`${Source.Reddit_Rest}:field:17`)
						}
					},
				},
			},
		}),
		createResolver(calls, 18, Source.Beacon_Rest, {
			id: createResolve(calls, 18, Source.Beacon_Rest, 'id'),
		}, {
			$primaryNetwork: () => 'not-a-reference',
		}),
	]
	return indexResolvers(
		fixtureSchema,
		resolverDefinitions.map((resolver) => ({
			source: resolver.source,
			resolvers: [
				{
					entityType: resolver.entityType,
					resolve: resolver.resolve,
					fields: resolver.fields,
					...(resolver.resolveLive != null && {
						resolveLive: resolver.resolveLive,
					}),
				},
			],
		})),
		new Set(resolverDefinitions.map((resolver) => resolver.source)),
	).resolverIndexes
}

const createFixtureContext = async () => {
	const calls: ResolverCall[] = []
	const liveStarts: FixtureLiveStart[] = []
	const rootLiveStarts: FixtureRootLiveStart[] = []
	const liveCleanups: string[] = []
	const {
		entityDefinitionByType,
		entityFieldDefinitionByEntityTypeAndName,
	} = indexSchema(fixtureSchema)
	const context = createCollections({
		schema: fixtureSchema,
		entityDefinitionByType,
		entityFieldDefinitionByEntityTypeAndName,
		resolverIndexes: fixtureResolverIndexes(calls, liveStarts, rootLiveStarts, liveCleanups),
		resolverPublicEnvBySource: new Map(),
		queryClient: new QueryClient(),
		collectionPersistence: {
			adapter: {
				loadSubset: async () => [],
				applyCommittedTx: async () => {},
				ensureIndex: async () => {},
			},
		},
		schemaVersion: 1,
	})
	return {
		context,
		calls,
		liveStarts,
		rootLiveStarts,
		liveCleanups,
	}
}

const fieldWhere = (
	context: EntityCollectionsContext<typeof fixtureSchema>,
	fieldName: keyof typeof context.entityFieldCollections[EntityType.Network],
	category = 'public',
) => {
	const query = new BaseQueryBuilder()
		.from({
			fieldRow: context.entityFieldCollections[EntityType.Network][fieldName],
		})
		.where(({ fieldRow }) => eq(fieldRow.category, category))
	// @ts-expect-error TanStack exposes _getQuery at runtime but hides it from QueryBuilder; this fixture needs the real IR expression.
	// oxlint-disable-next-line typescript/consistent-type-assertions -- TanStack exposes _getQuery at runtime but hides it from QueryBuilder; this fixture needs the real IR expression.
	const where = (query as { _getQuery(): IR.QueryIR })._getQuery().where?.[0]
	return where != null && 'expression' in where ? where.expression : where
}

const networkNames = (
	result: Awaited<ReturnType<typeof subscribeEntity<typeof fixtureSchema, EntityType.Network, {
		readonly fields: {
			readonly $$networks: true
		}
	}>>>,
) => result.fields.$$networks.values.map((value: FixtureNetworkReference) => value.name)


describe('subscribeEntity Resolver Stack fixtures', () => {
	it('resolves selected entity fields through fixture TanStack collections', async () => {
		const { context } = await createFixtureContext()
		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				name: true,
				tags: {
					count: true,
				},
				$$networks: {
					sources: [
						Source.Blockscout_Rest,
					],
					count: true,
				},
			},
		})

		expect(result.fields.name).toBe('Parent')
		expect(result.fields.tags.values).toHaveLength(3)
		expect(result.fields.tags.values).toEqual(expect.arrayContaining([
			'red',
			'green',
			'blue',
		]))
		expect(result.fields.$$networks.totalCount).toBe(3)
	})

	it('materializes entity, field, and count collection rows on demand', async () => {
		const { context } = await createFixtureContext()
		await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				name: true,
				tags: {
					count: true,
				},
				$$networks: {
					sources: [
						Source.Blockscout_Rest,
					],
					count: true,
				},
			},
		})

		expect(context.entityCollections[EntityType.Network].size).toBeGreaterThan(0)
		expect(context.entityFieldCollections[EntityType.Network].$$networks.size).toBeGreaterThan(0)
		expect(context.entityFieldCountCollections[EntityType.Network].$$networks?.size).toBeGreaterThan(0)
		expect(context.events.collectionSync.map((event) => event.collection.kind)).toEqual(expect.arrayContaining([
			'Entity',
			'Field',
			'Count',
		]))
		expect(context.events.collectionSync.filter((event) => (
			event.collection.kind === 'Entity'
		)).map((event) => event.collection)).toEqual(expect.arrayContaining([
			{
				kind: 'Entity',
				entityType: EntityType.Network,
				id: `Entity:${EntityType.Network}`,
			},
		]))
		expect(context.events.collectionSync.filter((event) => (
			event.collection.kind === 'Field'
		)).map((event) => event.collection)).toEqual(expect.arrayContaining([
			{
				kind: 'Field',
				entityType: EntityType.Network,
				fieldName: '$$networks',
				id: `Field:${EntityType.Network}:$$networks`,
			},
		]))
		expect(context.events.collectionSync.filter((event) => (
			event.collection.kind === 'Count'
		)).map((event) => event.collection)).toEqual(expect.arrayContaining([
			{
				kind: 'Count',
				entityType: EntityType.Network,
				fieldName: '$$networks',
				id: `Count:${EntityType.Network}:$$networks`,
			},
		]))
		expect(context.events.resolver.length).toBeGreaterThan(0)
	})

	it('emits pending and success resource state from collection subscriptions', async () => {
		const { context } = await createFixtureContext()
		const resource = subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				name: true,
			},
		})
		const states: {
			readonly loading: boolean
			readonly ready: boolean
			readonly currentName?: string
		}[] = []
		const unsubscribe = resource.subscribe(() => {
			states.push({
				loading: resource.loading,
				ready: resource.ready,
				currentName: resource.current?.fields.name,
			})
		})

		expect(states[0]).toEqual({
			loading: true,
			ready: false,
			currentName: undefined,
		})
		await resource
		await expect.poll(() => states.some((state) => (
			state.loading === false
			&& state.ready === true
			&& state.currentName === 'Parent'
		))).toBe(true)
		expect(resource.loading).toBe(false)
		expect(resource.ready).toBe(true)
		expect(resource.current?.fields.name).toBe('Parent')
		expect(resource.error).toBeUndefined()
		unsubscribe()
	})

	it('rejects and exposes selected field collection errors on the resource', async () => {
		const { context } = await createFixtureContext()
		const resource = subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				$$networks: {
					sources: [
						Source.Allium_Rest,
					],
				},
			},
		})

		expect(resource.loading).toBe(true)
		const error = [
			expect.objectContaining({
				selectorAddress: [
					EntityType.Network,
					'$$networks',
				],
				dimension: 'field',
				entityType: EntityType.Network,
				entityId: {
					id: 'parent',
				},
				fieldName: '$$networks',
				message: expect.stringContaining('all compatible Field Facets failed'),
			}),
		]
		await expect(resource).rejects.toEqual(error)
		expect(resource.error).toEqual(error)
		expect(resource.loading).toBe(false)
		expect(resource.ready).toBe(false)
	})

	it('selects resolver definitions by actual resolve projection and records identity aliases', async () => {
		const { context, calls } = await createFixtureContext()
		const result = await subscribeEntity(context, EntityType.Network, {
			slug: 'parent-slug',
		}, {
			sources: [
				Source.Coingecko_Rest,
			],
			fields: {
				name: true,
			},
		})

		expect(result.fields.name).toBe('Slug Parent')
		expect(calls.map((call) => [
			call.definitionIndex,
			call.projectionName,
		])).toContainEqual([
			2,
			'slug',
		])
		expect(
			context.entityCollections[EntityType.Network].toArray.find((entity) => (
				entity[EntityMetaKey.IdKey] === entityIdKey(fixtureEntityDefinition, {
					slug: 'parent-slug',
				})
			)),
		).toMatchObject({
			[EntityMetaKey.Source]: Source.Coingecko_Rest,
			name: 'Slug Parent',
		})
	})

	it('resolves lookup requests to durable parent aliases at the field and count collection boundary', async () => {
		const { context, calls } = await createFixtureContext()
		const fieldSubscription = context.entityFieldCollections[EntityType.Network].$$networks.subscribeChanges(() => {}, {
			includeInitialState: true,
			where: (fieldRow) => and(
				inArray(fieldRow[EntityMetaKey.ParentIdKey], [
					entityIdKey(fixtureEntityDefinition, {
						slug: 'parent-slug',
					}),
					entityIdKey(fixtureEntityDefinition, {
						id: 'parent',
					}),
				]),
				inArray(fieldRow[EntityMetaKey.Source], [
					Source.Local_Internal,
				]),
			),
		})
		const countCollection = context.entityFieldCountCollections[EntityType.Network].$$networks
		if (countCollection == null)
			throw new Error('expected fixture count collection')

		const countSubscription = countCollection.subscribeChanges(() => {}, {
			includeInitialState: true,
			where: (count) => and(
				inArray(count[EntityMetaKey.ParentIdKey], [
					entityIdKey(fixtureEntityDefinition, {
						slug: 'parent-slug',
					}),
					entityIdKey(fixtureEntityDefinition, {
						id: 'parent',
					}),
				]),
				inArray(count[EntityMetaKey.Source], [
					Source.Local_Internal,
				]),
			),
		})

		await expect.poll(() => context.entityFieldCollections[EntityType.Network].$$networks.toArray.some((row) => (
			row[EntityMetaKey.ParentIdKey] === entityIdKey(fixtureEntityDefinition, {
				id: 'parent',
			})
			&& row[EntityMetaKey.Source] === Source.Local_Internal
		))).toBe(true)
		await expect.poll(() => countCollection.toArray.some((row) => (
			row[EntityMetaKey.ParentIdKey] === entityIdKey(fixtureEntityDefinition, {
				id: 'parent',
			})
			&& row[EntityMetaKey.Source] === Source.Local_Internal
			&& row[EntityMetaKey.Value] === 3
		))).toBe(true)
		expect(context.entityFieldCollections[EntityType.Network].$$networks.toArray.some((row) => (
			row[EntityMetaKey.ParentIdKey] === entityIdKey(fixtureEntityDefinition, {
				slug: 'parent-slug',
			})
			&& row[EntityMetaKey.Source] === Source.Local_Internal
		))).toBe(false)
		expect(calls.map((call) => [
			call.definitionIndex,
			call.projectionName,
		])).toEqual(expect.arrayContaining([
			[
				0,
				'slug',
			],
			[
				0,
				'id',
			],
		]))
		fieldSubscription.unsubscribe()
		countSubscription.unsubscribe()
	})

	it('resolves lookup subscribe requests through durable parent aliases', async () => {
		const { context, calls } = await createFixtureContext()
		const result = await subscribeEntity(context, EntityType.Network, {
			slug: 'parent-slug',
		}, {
			fields: {
				$$networks: {
					sources: [
						Source.Blockscout_Rest,
					],
					count: true,
				},
			},
		})

		expect(networkNames(result)).toEqual(expect.arrayContaining([
			'Network B',
			'Network A',
			'Network C',
		]))
		expect(networkNames(result)).toHaveLength(3)
		expect(result.fields.$$networks.totalCount).toBe(3)
		expect(context.entityFieldCollections[EntityType.Network].$$networks.toArray.some((row) => (
			row[EntityMetaKey.ParentIdKey] === entityIdKey(fixtureEntityDefinition, {
				id: 'parent',
			})
			&& row[EntityMetaKey.Source] === Source.Blockscout_Rest
		))).toBe(true)
		expect(context.entityFieldCollections[EntityType.Network].$$networks.toArray.some((row) => (
			row[EntityMetaKey.ParentIdKey] === entityIdKey(fixtureEntityDefinition, {
				slug: 'parent-slug',
			})
			&& row[EntityMetaKey.Source] === Source.Blockscout_Rest
		))).toBe(false)
		expect(calls.map((call) => [
			call.definitionIndex,
			call.projectionName,
		])).toEqual(expect.arrayContaining([
			[
				0,
				'slug',
			],
			[
				4,
				'id',
			],
		]))
	})

	it('returns complete empty field and count results for incompatible parent projections', async () => {
		const { context, calls } = await createFixtureContext()
		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				$$networks: {
					sources: [
						Source.Dune_Rest,
					],
					count: true,
				},
			},
		})

		expect(result.fields.$$networks.values).toEqual([])
		expect(result.fields.$$networks.totalCount).toBeUndefined()
		expect(context.entityFieldCollections[EntityType.Network].$$networks.toArray.some((row) => (
			row[EntityMetaKey.Source] === Source.Dune_Rest
		))).toBe(false)
		expect(context.entityFieldCountCollections[EntityType.Network].$$networks?.toArray.some((row) => (
			row[EntityMetaKey.Source] === Source.Dune_Rest
		))).toBe(false)
		expect(calls.map((call) => [
			call.definitionIndex,
			call.projectionName,
		])).toContainEqual([
			9,
			'id',
		])
	})

	it('uses field-local source priority for scalar entity and field rows', async () => {
		const { context } = await createFixtureContext()
		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			sources: [
				Source.Local_Internal,
			],
			fields: {
				name: {
					sources: [
						Source.Constants_Internal,
						Source.Local_Internal,
					],
				},
			},
		})

		expect(result.fields.name).toBe('Constants Parent')
		expect(context.entityCollections[EntityType.Network].toArray.some((entity) => (
			entity[EntityMetaKey.Source] === Source.Constants_Internal
			&& entity[EntityMetaKey.IdKey] === entityIdKey(fixtureEntityDefinition, {
				id: 'parent',
			})
		))).toBe(false)
	})

	it('falls through missing higher-priority scalar values', async () => {
		const { context, calls } = await createFixtureContext()
		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			sources: [
				Source.Constants_Internal,
			],
			fields: {
				kind: {
					sources: [
						Source.MetadataVision_Rest,
						Source.Local_Internal,
					],
				},
			},
		})

		expect(result.fields.kind).toBe('enabled')
		expect(calls.map((call) => [
			call.definitionIndex,
			call.projectionName,
		])).toEqual(expect.arrayContaining([
			[
				10,
				'id',
			],
			[
				0,
				'id',
			],
		]))
	})

	it('uses source priority for counts without summing providers', async () => {
		const { context } = await createFixtureContext()
		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				$$networks: {
					sources: [
						Source.Constants_Internal,
						Source.Local_Internal,
					],
					count: true,
				},
			},
		})

		expect(result.fields.$$networks.totalCount).toBe(2)
		expect(context.entityFieldCountCollections[EntityType.Network].$$networks?.toArray.map((row) => [
			row[EntityMetaKey.Source],
			row[EntityMetaKey.Value],
		])).toEqual(expect.arrayContaining([
			[
				Source.Constants_Internal,
				2,
			],
			[
				Source.Local_Internal,
				3,
			],
		]))
	})

	it('keeps Source Priority as merge semantics while preserving TanStack sort and window order', async () => {
		const { context, calls } = await createFixtureContext()
		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				tags: {
					sources: [
						Source.Local_Internal,
					],
					orderBy: [
						[
							({ fieldRow }) => fieldRow.valueKey,
							'desc',
						],
					],
					offset: 1,
					limit: 2,
				},
			},
		})

		expect(result.fields.tags.values).toEqual([
			'green',
			'blue',
		])
		expect(calls.some((call) => (
			call.context.pagination.offset === 0
			&& call.context.pagination.limit === 3
			&& call.context.sorts.some((sort) => (
				sort.fieldPath.join('.') === 'valueKey'
				&& sort.direction === 'desc'
			))
		))).toBe(true)
	})

	it('keeps complete-superset fallback subordinate to TanStack filtering', async () => {
		const { context, calls } = await createFixtureContext()
		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				$$networks: {
					sources: [
						Source.Local_Internal,
					],
					where: fieldWhere(context, '$$networks'),
				},
			},
		})

		expect(networkNames(result)).toEqual([
			'Network A',
			'Network C',
		])
		expect(context.entityFieldCollections[EntityType.Network].$$networks.toArray.some((row) => (
			row[EntityMetaKey.Source] === Source.Local_Internal
			&& row.category === 'private'
		))).toBe(true)
		expect(calls.some((call) => call.context.filters.some((filter) => (
			filter.fieldPath.join('.') === 'category'
			&& filter.operator === 'eq'
			&& filter.value === 'public'
		)))).toBe(true)
	})

	it('keeps supported provider pushdown subordinate to the same TanStack field query', async () => {
		const { context, calls } = await createFixtureContext()
		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			sources: [
				Source.Blockscout_Rest,
			],
			fields: {
				$$networks: {
					sources: [
						Source.Blockscout_Rest,
					],
					where: fieldWhere(context, '$$networks'),
				},
			},
		})

		expect(networkNames(result)).toEqual([
			'Network A',
			'Network C',
		])
		expect(context.entityFieldCollections[EntityType.Network].$$networks.toArray.some((row) => (
			row[EntityMetaKey.Source] === Source.Blockscout_Rest
			&& row.category === 'private'
		))).toBe(false)
		expect(calls.some((call) => (
			call.definitionIndex === 4
			&& call.context.filters.some((filter) => (
				filter.fieldPath.join('.') === 'category'
				&& filter.operator === 'eq'
				&& filter.value === 'public'
			))
		))).toBe(true)
	})

	it('fails explicitly when a provider cannot push down and will not return a complete superset', async () => {
		const { context } = await createFixtureContext()
		const where = fieldWhere(context, '$$networks')
		if (where == null)
			throw new Error('expected fixture field filter')

		const subscription = context.entityFieldCollections[EntityType.Network].$$networks.subscribeChanges(() => {}, {
			includeInitialState: true,
			where: (fieldRow) => and(
				eq(fieldRow[EntityMetaKey.ParentIdKey], entityIdKey(fixtureEntityDefinition, {
					id: 'parent',
				})),
				inArray(fieldRow[EntityMetaKey.Source], [
					Source.Etherscan_Rest,
				]),
				where,
			),
		})

		await expect.poll(() => context.queryClient.getQueryCache().getAll().some((query) => (
			String(query.state.error).includes('unsupported category filter')
		))).toBe(true)
		subscription.unsubscribe()
	})

	it('treats no compatible entity resolver as complete empty', async () => {
		const { context, calls } = await createFixtureContext()
		const subscription = context.entityCollections[EntityType.Network].subscribeChanges(() => {}, {
			includeInitialState: true,
			where: (entity) => and(
				eq(entity[EntityMetaKey.IdKey], entityIdKey(fixtureEntityDefinition, {
					id: 'parent',
				})),
				inArray(entity[EntityMetaKey.Source], [
					Source.Amboss_Graphql,
				]),
			),
		})

		await expect.poll(() => context.events.collectionSync.some((event) => (
			event.collection.kind === 'Entity'
		))).toBe(true)
		expect(context.entityCollections[EntityType.Network].toArray.some((entity) => (
			entity[EntityMetaKey.Source] === Source.Amboss_Graphql
		))).toBe(false)
		expect(calls.some((call) => call.source === Source.Amboss_Graphql)).toBe(false)
		subscription.unsubscribe()
	})

	it('uses successful entity resolvers when a compatible entity resolver fails', async () => {
		const { context, calls } = await createFixtureContext()
		const subscription = context.entityCollections[EntityType.Network].subscribeChanges(() => {}, {
			includeInitialState: true,
			where: (entity) => and(
				eq(entity[EntityMetaKey.IdKey], entityIdKey(fixtureEntityDefinition, {
					id: 'parent',
				})),
				inArray(entity[EntityMetaKey.Source], [
					Source.Local_Internal,
					Source.Defillama_Rest,
				]),
			),
		})

		await expect.poll(() => context.entityCollections[EntityType.Network].toArray.some((entity) => (
			entity[EntityMetaKey.Source] === Source.Local_Internal
			&& entity.name === 'Parent'
		))).toBe(true)
		expect(calls.some((call) => call.definitionIndex === 6)).toBe(true)
		expect(context.queryClient.getQueryCache().getAll().some((query) => (
			String(query.state.error).includes('all compatible Resolver Definitions failed')
		))).toBe(false)
		subscription.unsubscribe()
	})

	it('fails when all attempted compatible entity resolvers fail', async () => {
		const { context, calls } = await createFixtureContext()
		const subscription = context.entityCollections[EntityType.Network].subscribeChanges(() => {}, {
			includeInitialState: true,
			where: (entity) => and(
				eq(entity[EntityMetaKey.IdKey], entityIdKey(fixtureEntityDefinition, {
					id: 'parent',
				})),
				inArray(entity[EntityMetaKey.Source], [
					Source.Defillama_Rest,
				]),
			),
		})

		await expect.poll(() => context.queryClient.getQueryCache().getAll().some((query) => (
			String(query.state.error).includes('all compatible Resolver Definitions failed')
		))).toBe(true)
		expect(calls.some((call) => call.definitionIndex === 6)).toBe(true)
		subscription.unsubscribe()
	})

	it('treats no compatible field facet as complete empty', async () => {
		const { context } = await createFixtureContext()
		const subscription = context.entityFieldCollections[EntityType.Network].$$networks.subscribeChanges(() => {}, {
			includeInitialState: true,
			where: (fieldRow) => and(
				eq(fieldRow[EntityMetaKey.ParentIdKey], entityIdKey(fixtureEntityDefinition, {
					id: 'parent',
				})),
				inArray(fieldRow[EntityMetaKey.Source], [
					Source.Amboss_Graphql,
				]),
			),
		})

		await expect.poll(() => context.events.collectionSync.some((event) => (
			event.collection.kind === 'Field'
		))).toBe(true)
		expect(context.entityFieldCollections[EntityType.Network].$$networks.toArray.some((row) => (
			row[EntityMetaKey.Source] === Source.Amboss_Graphql
		))).toBe(false)
		subscription.unsubscribe()
	})

	it('uses successful field facets when a compatible field facet fails', async () => {
		const { context } = await createFixtureContext()
		const subscription = context.entityFieldCollections[EntityType.Network].$$networks.subscribeChanges(() => {}, {
			includeInitialState: true,
			where: (fieldRow) => and(
				eq(fieldRow[EntityMetaKey.ParentIdKey], entityIdKey(fixtureEntityDefinition, {
					id: 'parent',
				})),
				inArray(fieldRow[EntityMetaKey.Source], [
					Source.Local_Internal,
					Source.Allium_Rest,
				]),
			),
		})

		await expect.poll(() => context.entityFieldCollections[EntityType.Network].$$networks.toArray.some((row) => (
			row[EntityMetaKey.Source] === Source.Local_Internal
			&& row.name === 'Network A'
		))).toBe(true)
		expect(context.queryClient.getQueryCache().getAll().some((query) => (
			String(query.state.error).includes('all compatible Field Facets failed')
		))).toBe(false)
		subscription.unsubscribe()
	})

	it('fails when all attempted compatible field facets fail', async () => {
		const { context } = await createFixtureContext()
		const subscription = context.entityFieldCollections[EntityType.Network].$$networks.subscribeChanges(() => {}, {
			includeInitialState: true,
			where: (fieldRow) => and(
				eq(fieldRow[EntityMetaKey.ParentIdKey], entityIdKey(fixtureEntityDefinition, {
					id: 'parent',
				})),
				inArray(fieldRow[EntityMetaKey.Source], [
					Source.Allium_Rest,
				]),
			),
		})

		await expect.poll(() => context.queryClient.getQueryCache().getAll().some((query) => (
			String(query.state.error).includes('all compatible Field Facets failed')
		))).toBe(true)
		subscription.unsubscribe()
	})

	it('treats no compatible count facet as complete empty', async () => {
		const { context } = await createFixtureContext()
		const countCollection = context.entityFieldCountCollections[EntityType.Network].$$networks
		if (countCollection == null)
			throw new Error('expected fixture count collection')

		const subscription = countCollection.subscribeChanges(() => {}, {
			includeInitialState: true,
			where: (count) => and(
				eq(count[EntityMetaKey.ParentIdKey], entityIdKey(fixtureEntityDefinition, {
					id: 'parent',
				})),
				inArray(count[EntityMetaKey.Source], [
					Source.Amboss_Graphql,
				]),
			),
		})

		await expect.poll(() => context.events.collectionSync.some((event) => (
			event.collection.kind === 'Count'
		))).toBe(true)
		expect(countCollection.toArray.some((row) => (
			row[EntityMetaKey.Source] === Source.Amboss_Graphql
		))).toBe(false)
		subscription.unsubscribe()
	})

	it('uses successful count facets when a compatible count facet fails', async () => {
		const { context } = await createFixtureContext()
		const countCollection = context.entityFieldCountCollections[EntityType.Network].$$networks
		if (countCollection == null)
			throw new Error('expected fixture count collection')

		const subscription = countCollection.subscribeChanges(() => {}, {
			includeInitialState: true,
			where: (count) => and(
				eq(count[EntityMetaKey.ParentIdKey], entityIdKey(fixtureEntityDefinition, {
					id: 'parent',
				})),
				inArray(count[EntityMetaKey.Source], [
					Source.Local_Internal,
					Source.CoinMarketCap_Rest,
				]),
			),
		})

		await expect.poll(() => countCollection.toArray.some((row) => (
			row[EntityMetaKey.Source] === Source.Local_Internal
			&& row[EntityMetaKey.Value] === 3
		))).toBe(true)
		expect(context.queryClient.getQueryCache().getAll().some((query) => (
			String(query.state.error).includes('all compatible Count Facets failed')
		))).toBe(false)
		subscription.unsubscribe()
	})

	it('fails when all attempted compatible count facets fail', async () => {
		const { context } = await createFixtureContext()
		const countCollection = context.entityFieldCountCollections[EntityType.Network].$$networks
		if (countCollection == null)
			throw new Error('expected fixture count collection')

		const subscription = countCollection.subscribeChanges(() => {}, {
			includeInitialState: true,
			where: (count) => and(
				eq(count[EntityMetaKey.ParentIdKey], entityIdKey(fixtureEntityDefinition, {
					id: 'parent',
				})),
				inArray(count[EntityMetaKey.Source], [
					Source.CoinMarketCap_Rest,
				]),
			),
		})

		await expect.poll(() => context.queryClient.getQueryCache().getAll().some((query) => (
			String(query.state.error).includes('all compatible Count Facets failed')
		))).toBe(true)
		expect(countCollection.toArray.some((row) => (
			row[EntityMetaKey.Source] === Source.CoinMarketCap_Rest
		))).toBe(false)
		subscription.unsubscribe()
	})

	it('applies source priority to duplicate identities without collapsing duplicate resolver parts', async () => {
		const { context, calls } = await createFixtureContext()
		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			sources: [
				Source.Local_Internal,
				Source.Constants_Internal,
			],
			fields: {
				$$networks: {
					sources: [
						Source.Local_Internal,
						Source.Constants_Internal,
					],
				},
			},
		})

		expect(networkNames(result)).toContain('Network A')
		expect(networkNames(result)).not.toContain('Constants Network A')
		expect(networkNames(result)).toContain('Duplicate Part')
		expect(new Set(calls.map((call) => call.definitionIndex))).toEqual(new Set([
			0,
			1,
			3,
		]))
	})

	it('uses known-length count fallback for complete unwindowed value facets', async () => {
		const { context } = await createFixtureContext()
		const countCollection = context.entityFieldCountCollections[EntityType.Network].tags
		if (countCollection == null)
			throw new Error('expected fixture count collection')

		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				tags: {
					sources: [
						Source.Local_Internal,
					],
					count: true,
				},
			},
		})

		expect(result.fields.tags.values).toHaveLength(3)
		expect(result.fields.tags.values).toEqual(expect.arrayContaining([
			'red',
			'green',
			'blue',
		]))
		expect(result.fields.tags.totalCount).toBe(3)
		expect(countCollection.toArray.some((row) => (
			row[EntityMetaKey.Source] === Source.Local_Internal
			&& row[EntityMetaKey.Value] === 3
		))).toBe(true)
	})

	it('uses known-length count fallback for filtered complete value facets', async () => {
		const { context } = await createFixtureContext()
		const countCollection = context.entityFieldCountCollections[EntityType.Network].$$networks
		if (countCollection == null)
			throw new Error('expected fixture count collection')

		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				$$networks: {
					sources: [
						Source.Blockscout_Rest,
					],
					where: fieldWhere(context, '$$networks'),
					count: true,
				},
			},
		})

		expect(networkNames(result)).toEqual([
			'Network A',
			'Network C',
		])
		expect(result.fields.$$networks.totalCount).toBe(2)
		expect(countCollection.toArray.some((row) => (
			row[EntityMetaKey.Source] === Source.Blockscout_Rest
			&& row[EntityMetaKey.Value] === 2
		))).toBe(true)
	})

	it('does not use known-length count fallback for limited value facets', async () => {
		const { context } = await createFixtureContext()
		const countCollection = context.entityFieldCountCollections[EntityType.Network].tags
		if (countCollection == null)
			throw new Error('expected fixture count collection')

		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				tags: {
					sources: [
						Source.Local_Internal,
					],
					count: true,
					limit: 2,
				},
			},
		})

		expect(result.fields.tags.values).toEqual([
			'blue',
			'green',
		])
		expect(result.fields.tags.totalCount).toBeUndefined()
		expect(countCollection.toArray.some((row) => (
			row[EntityMetaKey.Source] === Source.Local_Internal
		))).toBe(false)
	})

	it('does not use known-length count fallback for offset value facets', async () => {
		const { context } = await createFixtureContext()
		const countCollection = context.entityFieldCountCollections[EntityType.Network].tags
		if (countCollection == null)
			throw new Error('expected fixture count collection')

		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				tags: {
					sources: [
						Source.Local_Internal,
					],
					count: true,
					offset: 1,
				},
			},
		})

		expect(result.fields.tags.values).toHaveLength(2)
		expect(result.fields.tags.totalCount).toBeUndefined()
		expect(countCollection.toArray.some((row) => (
			row[EntityMetaKey.Source] === Source.Local_Internal
		))).toBe(false)
	})

	it('does not use known-length count fallback for cursor value facets', async () => {
		const { context } = await createFixtureContext()
		const countCollection = context.entityFieldCountCollections[EntityType.Network].tags
		if (countCollection == null)
			throw new Error('expected fixture count collection')

		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				tags: {
					sources: [
						Source.Local_Internal,
					],
					count: true,
					cursor: {
						whereFrom: eq(1, 1),
						whereCurrent: eq(1, 1),
						lastKey: 'tag-cursor',
					},
				},
			},
		})

		expect(result.fields.tags.values).toHaveLength(3)
		expect(result.fields.tags.totalCount).toBeUndefined()
		expect(countCollection.toArray.some((row) => (
			row[EntityMetaKey.Source] === Source.Local_Internal
		))).toBe(false)
	})

	it('does not use known-length count fallback for partial value facets', async () => {
		const { context } = await createFixtureContext()
		const countCollection = context.entityFieldCountCollections[EntityType.Network].tags
		if (countCollection == null)
			throw new Error('expected fixture count collection')

		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				tags: {
					sources: [
						Source.NostrBand_Rest,
					],
					count: true,
				},
			},
		})

		expect(result.fields.tags.values).toHaveLength(2)
		expect(result.fields.tags.values).toEqual(expect.arrayContaining([
			'red',
			'green',
		]))
		expect(result.fields.tags.totalCount).toBeUndefined()
		expect(countCollection.toArray.some((row) => (
			row[EntityMetaKey.Source] === Source.NostrBand_Rest
		))).toBe(false)
	})

	it('does not use known-length count fallback when a compatible value facet fails', async () => {
		const { context } = await createFixtureContext()
		const countCollection = context.entityFieldCountCollections[EntityType.Network].tags
		if (countCollection == null)
			throw new Error('expected fixture count collection')

		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				tags: {
					sources: [
						Source.Local_Internal,
						Source.Primal_Rest,
					],
					count: true,
				},
			},
		})

		expect(result.fields.tags.values).toHaveLength(3)
		expect(result.fields.tags.values).toEqual(expect.arrayContaining([
			'red',
			'green',
			'blue',
		]))
		expect(result.fields.tags.totalCount).toBeUndefined()
		expect(countCollection.toArray.some((row) => (
			row[EntityMetaKey.Source] === Source.Local_Internal
			|| row[EntityMetaKey.Source] === Source.Primal_Rest
		))).toBe(false)
		expect(context.queryClient.getQueryCache().getAll().some((query) => (
			String(query.state.error).includes('all compatible Field Facets failed')
		))).toBe(false)
	})

	it('keeps subscribed subscribeEntity resources live over collection writes', async () => {
		const { context } = await createFixtureContext()
		const resource = subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				name: true,
			},
		})

		await resource
		let notifications = 0
		const unsubscribe = resource.subscribe(() => {
			notifications += 1
		})
		const row = context.entityCollections[EntityType.Network].toArray.find((entity) => (
			entity[EntityMetaKey.Source] === Source.Local_Internal
			&& entity[EntityMetaKey.IdKey] === entityIdKey(fixtureEntityDefinition, {
				id: 'parent',
			})
		))
		expect(row).toBeDefined()
		if (row == null)
			throw new Error('expected Local_Internal parent row')

		context.entityCollections[EntityType.Network].utils.writeUpsert({
			...row,
			[EntityMetaKey.Source]: row[EntityMetaKey.Source],
			[EntityMetaKey.IdKey]: row[EntityMetaKey.IdKey],
			[EntityMetaKey.Fields]: {
				...row[EntityMetaKey.Fields],
				name: 'Live Parent',
			},
			name: 'Live Parent',
		})
		expect(context.entityCollections[EntityType.Network].toArray.find((entity) => (
			entity[EntityMetaKey.Source] === Source.Local_Internal
			&& entity[EntityMetaKey.IdKey] === row[EntityMetaKey.IdKey]
		))?.name).toBe('Live Parent')
		await expect.poll(() => resource.current?.fields.name).toBe('Live Parent')
		unsubscribe()

		expect(notifications).toBeGreaterThan(1)
	})

	it('starts root live publishers from field collection demand and cleans up on final unsubscribe', async () => {
		const {
			context,
			liveStarts,
			rootLiveStarts,
			liveCleanups,
		} = await createFixtureContext()
		const resource = subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				$$networks: {
					sources: [
						Source.Farcaster_Rest,
					],
					count: true,
				},
			},
		})
		const unsubscribe = resource.subscribe(() => {})

		await resource
		await expect.poll(() => rootLiveStarts.length).toBe(1)
		await expect.poll(() => liveStarts.filter((start) => start.source === Source.Farcaster_Rest).length).toBe(1)
		expect(context.liveSubscriptions.size).toBe(2)
		expect(rootLiveStarts[0].signal.aborted).toBe(false)
		expect(liveStarts[0].signal.aborted).toBe(false)

		unsubscribe()

		await expect.poll(() => context.liveSubscriptions.size).toBe(0)
		expect(context.startedLiveScopes.size).toBe(0)
		expect(rootLiveStarts[0].signal.aborted).toBe(true)
		expect(liveStarts[0].signal.aborted).toBe(true)
		expect(liveCleanups).toEqual(expect.arrayContaining([
			`${Source.Farcaster_Rest}:root`,
			`${Source.Farcaster_Rest}:field`,
		]))
		expect(context.events.live.some((event) => event.action === 'cleanup')).toBe(true)
	})

	it('keeps duplicate same-source field live parts distinct by materialized resolver position', async () => {
		const {
			context,
			liveStarts,
			liveCleanups,
		} = await createFixtureContext()
		const resource = subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				$$networks: {
					sources: [
						Source.Reddit_Rest,
					],
				},
			},
		})
		const unsubscribe = resource.subscribe(() => {})

		await resource
		await expect.poll(() => liveStarts.filter((start) => start.source === Source.Reddit_Rest).length).toBe(2)
		expect(context.liveSubscriptions.size).toBe(2)
		expect(new Set([...context.liveSubscriptions.keys()]).size).toBe(2)

		unsubscribe()

		await expect.poll(() => context.liveSubscriptions.size).toBe(0)
		expect(liveCleanups).toEqual(expect.arrayContaining([
			`${Source.Reddit_Rest}:field:16`,
			`${Source.Reddit_Rest}:field:17`,
		]))
	})

	it('projects live field and count writes into an initially empty subscribed resource', async () => {
		const {
			context,
			liveStarts,
		} = await createFixtureContext()
		const resource = subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				$$networks: {
					sources: [
						Source.Farcaster_Rest,
					],
					count: true,
				},
			},
		})
		const unsubscribe = resource.subscribe(() => {})

		await resource
		await expect.poll(() => liveStarts.filter((start) => start.source === Source.Farcaster_Rest).length).toBe(1)
		expect(resource.ready).toBe(true)
		expect(resource.current?.fields.$$networks.values).toEqual([])
		expect(resource.current?.fields.$$networks.totalCount).toBeUndefined()

		liveStarts[0].field.replaceRows([
			{
				source: Source.Farcaster_Rest,
				value: fixtureReference('network-live', 'Live Network', 0),
			},
		])
		liveStarts[0].field.count.replaceRows([
			{
				source: Source.Farcaster_Rest,
				value: 1,
			},
		])

		expect(context.entityFieldCollections[EntityType.Network].$$networks.toArray.some((row) => (
			row[EntityMetaKey.Source] === Source.Farcaster_Rest
			&& row[EntityMetaKey.Value].name === 'Live Network'
		))).toBe(true)
		expect(context.entityFieldCountCollections[EntityType.Network].$$networks?.toArray.some((row) => (
			row[EntityMetaKey.Source] === Source.Farcaster_Rest
			&& row[EntityMetaKey.Value] === 1
		))).toBe(true)
		expect(context.entityFieldCountCollections[EntityType.Network].$$networks?.toArray.map((row) => row.filterKey)).toEqual([
			stringify({}),
		])
		await expect.poll(() => resource.current?.fields.$$networks.values.map((value: FixtureNetworkReference) => value.name)).toEqual([
			'Live Network',
		])
		await expect.poll(() => resource.current?.fields.$$networks.totalCount).toBe(1)
		expect(context.events.live.map((event) => event.action)).toEqual(expect.arrayContaining([
			'writeFieldRows',
			'writeFieldCounts',
		]))
		unsubscribe()
	})

	it('invalidates only matching live field and count collection subsets', async () => {
		const { context, liveStarts } = await createFixtureContext()
		await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				$$networks: {
					sources: [
						Source.Farcaster_Rest,
					],
					where: fieldWhere(context, '$$networks'),
					count: true,
				},
			},
		})
		await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				$$networks: {
					sources: [
						Source.Farcaster_Rest,
					],
					where: fieldWhere(context, '$$networks', 'private'),
				},
			},
		})
		await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				$$networks: {
					sources: [
						Source.Blockscout_Rest,
					],
					where: fieldWhere(context, '$$networks'),
				},
			},
		})
		await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				tags: {
					sources: [
						Source.Local_Internal,
					],
					count: true,
				},
			},
		})
		await expect.poll(() => context.queryClient.isFetching()).toBe(0)
		expect(liveStarts).toHaveLength(1)
		const liveStart = liveStarts[0]

		const syncCount = (
			kind: 'Field' | 'Count',
			fieldName: '$$networks' | 'tags',
		) => context.events.collectionSync.filter((event) => (
			event.collection.kind === kind
			&& event.collection.fieldName === fieldName
		)).length
		const beforeFieldNetworks = syncCount('Field', '$$networks')
		const beforeCountNetworks = syncCount('Count', '$$networks')
		const beforeFieldTags = syncCount('Field', 'tags')
		const beforeCountTags = syncCount('Count', 'tags')

		liveStart.field.invalidate()
		await expect.poll(() => syncCount('Field', '$$networks')).toBe(beforeFieldNetworks + 1)
		await expect.poll(() => context.queryClient.isFetching()).toBe(0)
		expect(syncCount('Count', '$$networks')).toBe(beforeCountNetworks)
		expect(syncCount('Field', 'tags')).toBe(beforeFieldTags)
		expect(syncCount('Count', 'tags')).toBe(beforeCountTags)

		liveStart.field.count.invalidate()
		await expect.poll(() => syncCount('Count', '$$networks')).toBe(beforeCountNetworks + 1)
		await expect.poll(() => context.queryClient.isFetching()).toBe(0)
		expect(syncCount('Field', '$$networks')).toBe(beforeFieldNetworks + 1)
		expect(syncCount('Field', 'tags')).toBe(beforeFieldTags)
		expect(syncCount('Count', 'tags')).toBe(beforeCountTags)
	})

	it('recursively composes nested scalar references with child field source priority', async () => {
		const { context } = await createFixtureContext()
		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				$primaryNetwork: {
					sources: [
						Source.Local_Internal,
					],
					fields: {
						name: {
							sources: [
								Source.Constants_Internal,
								Source.Local_Internal,
							],
						},
						tags: {
							sources: [
								Source.Local_Internal,
							],
							count: true,
						},
						conditionalText: {
							sources: [
								Source.Local_Internal,
							],
						},
					},
				},
			},
		})

		expect(result.fields.$primaryNetwork.value[EntityMetaKey.Id]).toEqual({
			id: 'network-a',
		})
		expect(result.fields.$primaryNetwork.entity.fields.name).toBe('Constants Parent')
	})

	it('recursively composes nested scalar references with child counts and conditionals', async () => {
		const { context } = await createFixtureContext()
		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				$primaryNetwork: {
					sources: [
						Source.Local_Internal,
					],
					fields: {
						tags: {
							sources: [
								Source.Local_Internal,
							],
							count: true,
						},
						conditionalText: {
							sources: [
								Source.Local_Internal,
							],
						},
					},
				},
			},
		})

		expect(result.fields.$primaryNetwork.entity.fields.tags.totalCount).toBe(2)
		expect(result.fields.$primaryNetwork.entity.fields.conditionalText).toBe('child condition matched')
	})

	it('recursively composes nested many-reference selections with child counts', async () => {
		const { context } = await createFixtureContext()
		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				$$networks: {
					sources: [
						Source.Blockscout_Rest,
					],
					fields: {
						name: {
							sources: [
								Source.Local_Internal,
							],
						},
						tags: {
							sources: [
								Source.Local_Internal,
							],
							count: true,
						},
					},
				},
			},
		})

		expect(result.fields.$$networks.entities).toHaveLength(3)
		expect(result.fields.$$networks.entities.map((entity) => [
			entity.entityId.id,
			entity.fields.name,
			entity.fields.tags.totalCount,
		])).toEqual(expect.arrayContaining([
			[
				'network-a',
				'Network A',
				2,
			],
			[
				'network-b',
				'Network B',
				1,
			],
			[
				'network-c',
				'Network C',
				0,
			],
		]))
	})

	it('prefixes nested selection errors with the parent field path', async () => {
		const { context } = await createFixtureContext()
		const resource = subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				$primaryNetwork: {
					sources: [
						Source.Local_Internal,
					],
					fields: {
						conditionalText: {
							sources: [
								Source.Atproto_Xrpc,
							],
						},
					},
				},
			},
		})
		expect(resource.loading).toBe(true)
		const error = [
			expect.objectContaining({
				selectorAddress: [
					EntityType.Network,
					'$primaryNetwork',
					EntityType.Network,
					'conditionalText',
				],
				dimension: 'field',
				entityType: EntityType.Network,
				entityId: {
					id: 'network-a',
				},
				fieldName: 'conditionalText',
				message: expect.stringContaining('discriminator unresolved'),
			}),
		]
		await expect(resource).rejects.toEqual(error)
		expect(resource.error).toEqual(error)
		expect(resource.loading).toBe(false)
		expect(resource.ready).toBe(false)
	})

	it('prefixes nested count errors with the parent field path', async () => {
		const { context } = await createFixtureContext()
		await expect(subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				$primaryNetwork: {
					sources: [
						Source.Local_Internal,
					],
					fields: {
						$$networks: {
							sources: [
								Source.CoinMarketCap_Rest,
							],
							count: true,
						},
					},
				},
			},
		})).rejects.toEqual([
			expect.objectContaining({
				selectorAddress: [
					EntityType.Network,
					'$primaryNetwork',
					EntityType.Network,
					'$$networks',
				],
				dimension: 'count',
				entityType: EntityType.Network,
				entityId: {
					id: 'network-a',
				},
				fieldName: '$$networks',
				message: expect.stringContaining('all compatible Count Facets failed'),
			}),
		])
	})

	it('reports invalid nested references with a nested error dimension', async () => {
		const { context } = await createFixtureContext()
		const collection = context.entityFieldCollections[EntityType.Network].$primaryNetwork
		const subscription = collection.subscribeChanges(() => {}, {
			includeInitialState: true,
			where: (fieldRow) => and(
				eq(fieldRow[EntityMetaKey.ParentIdKey], entityIdKey(fixtureEntityDefinition, {
					id: 'parent',
				})),
				inArray(fieldRow[EntityMetaKey.Source], [
					Source.Amboss_Graphql,
				]),
			),
		})

		await expect.poll(() => collection.status).toBe('ready')
		collection.utils.writeUpsert({
			fieldName: '$primaryNetwork',
			[EntityMetaKey.ParentId]: {
				id: 'parent',
			},
			[EntityMetaKey.ParentIdKey]: entityIdKey(fixtureEntityDefinition, {
				id: 'parent',
			}),
			[EntityMetaKey.Source]: Source.Amboss_Graphql,
			[EntityMetaKey.Value]: 'not-a-reference',
			valueKey: stringify('not-a-reference'),
		})

		await expect(subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				$primaryNetwork: {
					sources: [
						Source.Amboss_Graphql,
					],
					fields: {
						name: true,
					},
				},
			},
		})).rejects.toEqual([
			expect.objectContaining({
				selectorAddress: [
					EntityType.Network,
					'$primaryNetwork',
				],
				dimension: 'nested',
				entityType: EntityType.Network,
				entityId: {
					id: 'parent',
				},
				fieldName: '$primaryNetwork',
				message: expect.stringContaining('invalid nested entity reference'),
			}),
		])
		subscription.unsubscribe()
	})

	it('rejects invalid resolver references before collection persistence', async () => {
		const { context } = await createFixtureContext()
		await expect(subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				$primaryNetwork: {
					sources: [
						Source.Beacon_Rest,
					],
				},
			},
		})).rejects.toEqual([
			expect.objectContaining({
				selectorAddress: [
					EntityType.Network,
					'$primaryNetwork',
				],
				dimension: 'field',
				entityType: EntityType.Network,
				entityId: {
					id: 'parent',
				},
				fieldName: '$primaryNetwork',
				message: expect.stringContaining('all compatible Resolver Definitions failed'),
			}),
		])
		expect(context.entityFieldCollections[EntityType.Network].$primaryNetwork.toArray.filter((row) => (
			row[EntityMetaKey.Source] === Source.Beacon_Rest
		))).toEqual([])
	})

	it('resolves conditional fields through parent id discriminators', async () => {
		const { context } = await createFixtureContext()
		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				idConditionalText: {
					sources: [
						Source.Neynar_Rest,
					],
				},
			},
		})

		expect(result.fields.idConditionalText).toBe('parent id matched without field hydration')
	})

	it('resolves conditional fields through hydrated parent fields', async () => {
		const { context } = await createFixtureContext()
		const matched = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				conditionalText: true,
			},
		})
		const mismatched = await subscribeEntity(context, EntityType.Network, {
			id: 'disabled',
		}, {
			fields: {
				conditionalText: true,
			},
		})
		expect(matched.fields.conditionalText).toBe('condition matched')
		expect(mismatched.fields.conditionalText).toBeUndefined()
	})

	it('uses resolver discriminator facets for item-index condition keys and treats missing items as mismatch', async () => {
		const { context } = await createFixtureContext()
		const matched = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				indexedConditionalText: true,
			},
		})
		const mismatched = await subscribeEntity(context, EntityType.Network, {
			id: 'disabled',
		}, {
			fields: {
				indexedConditionalText: true,
			},
		})
		const missing = await subscribeEntity(context, EntityType.Network, {
			id: 'missing-label',
		}, {
			fields: {
				indexedConditionalText: true,
			},
		})

		expect(matched.fields.indexedConditionalText).toBe('indexed condition matched')
		expect(mismatched.fields.indexedConditionalText).toBeUndefined()
		expect(missing.fields.indexedConditionalText).toBeUndefined()
		expect(missing.errors).toEqual([])
	})

	it('resolves conditional fields through existing field rows', async () => {
		const { context } = await createFixtureContext()
		await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				kind: {
					sources: [
						Source.Local_Internal,
					],
				},
			},
		})
		context.entityFieldCollections[EntityType.Network].kind.utils.writeUpsert({
			fieldName: 'kind',
			[EntityMetaKey.ParentId]: {
				id: 'parent',
			},
			[EntityMetaKey.ParentIdKey]: entityIdKey(fixtureEntityDefinition, {
				id: 'parent',
			}),
			[EntityMetaKey.Source]: Source.Neynar_Rest,
			[EntityMetaKey.Value]: 'enabled',
			valueKey: stringify('enabled'),
		})
		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				conditionalText: {
					sources: [
						Source.Neynar_Rest,
					],
				},
			},
		})

		expect(result.fields.conditionalText).toBe('field row condition matched')
	})

	it('fails unresolved conditional discriminators explicitly', async () => {
		const { context } = await createFixtureContext()
		await expect(subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				conditionalText: {
					sources: [
						Source.Atproto_Xrpc,
					],
				},
			},
		})).rejects.toEqual([
			expect.objectContaining({
				selectorAddress: [
					EntityType.Network,
					'conditionalText',
				],
				dimension: 'field',
				entityType: EntityType.Network,
				entityId: {
					id: 'parent',
				},
				fieldName: 'conditionalText',
				message: expect.stringContaining('discriminator unresolved'),
			}),
		])
	})

	it('returns complete empty conditional count results on discriminator mismatch', async () => {
		const { context } = await createFixtureContext()
		const countCollection = context.entityFieldCountCollections[EntityType.Network].conditionalTags
		if (countCollection == null)
			throw new Error('expected fixture count collection')

		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'disabled',
		}, {
			fields: {
				conditionalTags: {
					sources: [
						Source.Local_Internal,
					],
					count: true,
				},
			},
		})

		expect(result.fields.conditionalTags.values).toEqual([])
		expect(result.fields.conditionalTags.totalCount).toBe(0)
		expect(countCollection.toArray.some((row) => (
			row[EntityMetaKey.ParentIdKey] === entityIdKey(fixtureEntityDefinition, {
				id: 'disabled',
			})
			&& row[EntityMetaKey.Source] === Source.Local_Internal
			&& row[EntityMetaKey.Value] === 0
		))).toBe(true)
	})
})
