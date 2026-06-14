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
	type SubscribeResult,
} from '$/client/$client.svelte.ts'
import {
	EntityFieldCardinality,
	EntityFieldType,
	EntityMetaKey,
	conditionalOn,
	entitySelectorKey,
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


type FixtureEntitySelector = (
	| {
		readonly id: string
	}
	| {
		readonly slug: string
	}
)

enum FixtureNetworkSelector {
	Id = 'id',
	Slug = 'slug',
}

enum FixtureKind {
	Enabled = 'enabled',
	Disabled = 'disabled',
}

const fixtureDiscriminatorFields = [
	{
		name: 'id',
		type: EntityFieldType.Primitive,
		primitiveType: arktype('string'),
		cardinality: EntityFieldCardinality.One,
	},
	{
		name: 'kind',
		type: EntityFieldType.Primitive,
		primitiveType: arktype.valueOf(FixtureKind),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Local_Internal,
		],
	},
	{
		name: 'labels',
		type: EntityFieldType.Primitive,
		primitiveType: arktype('string'),
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
] as const

type FixtureSnapshot = {
	readonly id: string
	readonly slug: string
	readonly name: string
	readonly kind: FixtureKind
	readonly labels: readonly string[]
	readonly tags: readonly string[]
	readonly networks: readonly FixtureNetworkReference[]
	readonly primaryNetwork?: FixtureNetworkReference
	readonly conditionalText?: string
	readonly indexedConditionalText?: string
}

type FixtureNetworkReference = {
	readonly [EntityMetaKey.Selector]: {
		readonly id: string
	}
	readonly [EntityMetaKey.SelectorKey]: string
	readonly slug: string
	readonly name: string
	readonly rank: number
	readonly category: string
}

type ResolverCall = {
	readonly definitionIndex: number
	readonly source: Source
	readonly selectorName: string
	readonly context: ResolverContext
}

const fixtureEntityDefinition = {
	entityType: EntityType.Network,
	label: 'Fixture Network',
	labelPlural: 'Fixture Networks',
	selectors: [
		{
			name: FixtureNetworkSelector.Id,
			fields: [
				FixtureNetworkSelector.Id,
			],
		},
		{
			name: FixtureNetworkSelector.Slug,
			fields: [
				FixtureNetworkSelector.Slug,
			],
		},
	],
	fields: [
		fixtureDiscriminatorFields[0],
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
		fixtureDiscriminatorFields[1],
		fixtureDiscriminatorFields[2],
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
			name: '$absentNetwork',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.Zero,
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
			when: conditionalOn(
				fixtureDiscriminatorFields,
				'kind',
				[
					FixtureKind.Enabled,
				],
			),
		},
		{
			name: 'idConditionalText',
			type: EntityFieldType.Primitive,
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			when: conditionalOn(
				fixtureDiscriminatorFields,
				'id',
				[
					'parent',
				],
			),
		},
		{
			name: 'indexedConditionalText',
			type: EntityFieldType.Primitive,
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			when: conditionalOn(
				fixtureDiscriminatorFields,
				'labels',
				[
					'target',
				],
				{
					itemIndex: 1,
				},
			),
		},
		{
			name: 'conditionalTags',
			type: EntityFieldType.Primitive,
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.ZeroOrMany,
			when: conditionalOn(
				fixtureDiscriminatorFields,
				'kind',
				[
					FixtureKind.Enabled,
				],
			),
		},
	],
} as const satisfies EntityDefinition

const fixtureSchema = [
	fixtureEntityDefinition,
] as const satisfies Schema

const assertConditionalResultUnion = (
	result: SubscribeResult<typeof fixtureSchema, EntityType.Network, {
		readonly fields: {
			readonly conditionalTags: {
				readonly count: true
			}
		}
	}>,
) => {
	if (result.fields.kind === FixtureKind.Enabled) {
		const totalCount: number | undefined = result.fields.conditionalTags.totalCount
		return totalCount
	}

	// @ts-expect-error nonmatching conditional branches do not expose conditional field values
	return result.fields.conditionalTags.values
}

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
	[EntityMetaKey.Selector]: {
		id,
	},
	[EntityMetaKey.SelectorKey]: entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
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
		kind: FixtureKind.Enabled,
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
		kind: FixtureKind.Enabled,
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
		kind: FixtureKind.Disabled,
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
		kind: FixtureKind.Enabled,
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
		kind: FixtureKind.Disabled,
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
		kind: FixtureKind.Enabled,
		labels: [
			'other',
		],
		tags: [],
		networks: [],
		indexedConditionalText: 'should not appear',
	},
} as const satisfies Record<string, FixtureSnapshot>

const snapshotForEntitySelector = (
	entitySelector: FixtureEntitySelector,
) => (
	'id' in entitySelector ?
		Object.values(fixtureSnapshots).find((snapshot) => snapshot.id === entitySelector.id)
	:
		Object.values(fixtureSnapshots).find((snapshot) => snapshot.slug === entitySelector.slug)
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
	selectorName: string,
	mode?: 'fail' | 'unsupported' | 'where',
) => async (
	entitySelector: FixtureEntitySelector,
	context: ResolverContext,
) => {
	calls.push({
		definitionIndex,
		source,
		selectorName,
		context,
	})
	if (mode === 'fail')
		throw new Error(`${source} primary resolve failed`)

	const snapshot = snapshotForEntitySelector(entitySelector)
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
			[FixtureNetworkSelector.Id]: createResolve(calls, 0, Source.Local_Internal, FixtureNetworkSelector.Id),
			[FixtureNetworkSelector.Slug]: createResolve(calls, 0, Source.Local_Internal, FixtureNetworkSelector.Slug),
		}, {
			id: (snapshot: FixtureSnapshot) => snapshot.id,
			slug: (snapshot: FixtureSnapshot) => snapshot.slug,
			name: (snapshot: FixtureSnapshot) => snapshot.name,
			kind: (snapshot: FixtureSnapshot) => snapshot.kind,
			labels: (snapshot: FixtureSnapshot) => snapshot.labels,
			tags: (snapshot: FixtureSnapshot) => snapshot.tags,
			$primaryNetwork: (snapshot: FixtureSnapshot) => snapshot.primaryNetwork,
			$absentNetwork: () => undefined,
			$$networks: {
				parentSelectors: [
					FixtureNetworkSelector.Id,
				],
				select: (snapshot: FixtureSnapshot) => snapshot.networks,
				resolveCount: (snapshot: FixtureSnapshot) => snapshot.networks.length,
			},
			conditionalText: (snapshot: FixtureSnapshot) => snapshot.conditionalText,
			indexedConditionalText: (snapshot: FixtureSnapshot) => snapshot.indexedConditionalText,
			conditionalTags: () => [],
		}),
		createResolver(calls, 1, Source.Constants_Internal, {
			[FixtureNetworkSelector.Id]: createResolve(calls, 1, Source.Constants_Internal, FixtureNetworkSelector.Id),
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
			[FixtureNetworkSelector.Slug]: createResolve(calls, 2, Source.Coingecko_Rest, FixtureNetworkSelector.Slug),
		}, {
			id: (snapshot: FixtureSnapshot) => snapshot.id,
			slug: (snapshot: FixtureSnapshot) => snapshot.slug,
			name: (snapshot: FixtureSnapshot) => `Slug ${snapshot.name}`,
		}),
		createResolver(calls, 3, Source.Local_Internal, {
			[FixtureNetworkSelector.Id]: createResolve(calls, 3, Source.Local_Internal, FixtureNetworkSelector.Id),
		}, {
			slug: (snapshot: FixtureSnapshot) => snapshot.slug,
			name: (snapshot: FixtureSnapshot) => snapshot.name,
			$$networks: () => [
				fixtureReference('network-duplicate', 'Duplicate Part', 5, 'duplicate'),
			],
		}),
		createResolver(calls, 4, Source.Blockscout_Rest, {
			[FixtureNetworkSelector.Id]: createResolve(calls, 4, Source.Blockscout_Rest, FixtureNetworkSelector.Id, 'where'),
		}, {
			$$networks: {
				parentSelectors: [
					FixtureNetworkSelector.Id,
				],
				select: (snapshot: FixtureSnapshot) => snapshot.networks,
			},
		}),
		createResolver(calls, 5, Source.Etherscan_Rest, {
			[FixtureNetworkSelector.Id]: createResolve(calls, 5, Source.Etherscan_Rest, FixtureNetworkSelector.Id, 'unsupported'),
		}, {
			$$networks: {
				parentSelectors: [
					FixtureNetworkSelector.Id,
				],
				select: (snapshot: FixtureSnapshot) => snapshot.networks,
			},
		}),
		createResolver(calls, 6, Source.Defillama_Rest, {
			[FixtureNetworkSelector.Id]: createResolve(calls, 6, Source.Defillama_Rest, FixtureNetworkSelector.Id, 'fail'),
		}, {
			name: (snapshot: FixtureSnapshot) => snapshot.name,
		}),
		createResolver(calls, 7, Source.Allium_Rest, {
			[FixtureNetworkSelector.Id]: createResolve(calls, 7, Source.Allium_Rest, FixtureNetworkSelector.Id),
		}, {
			$$networks: {
				parentSelectors: [
					FixtureNetworkSelector.Id,
				],
				select: () => {
					throw new Error('field facet failed')
				},
			},
		}),
		createResolver(calls, 8, Source.CoinMarketCap_Rest, {
			[FixtureNetworkSelector.Id]: createResolve(calls, 8, Source.CoinMarketCap_Rest, FixtureNetworkSelector.Id),
		}, {
			$$networks: {
				parentSelectors: [
					FixtureNetworkSelector.Id,
				],
				select: (snapshot: FixtureSnapshot) => snapshot.networks,
				resolveCount: () => {
					throw new Error('count facet failed')
				},
			},
		}),
		createResolver(calls, 9, Source.Dune_Rest, {
			[FixtureNetworkSelector.Id]: createResolve(calls, 9, Source.Dune_Rest, FixtureNetworkSelector.Id),
		}, {
			$$networks: {
				parentSelectors: [
					FixtureNetworkSelector.Slug,
				],
				select: (snapshot: FixtureSnapshot) => snapshot.networks,
				resolveCount: (snapshot: FixtureSnapshot) => snapshot.networks.length,
			},
		}),
		createResolver(calls, 10, Source.MetadataVision_Rest, {
			[FixtureNetworkSelector.Id]: createResolve(calls, 10, Source.MetadataVision_Rest, FixtureNetworkSelector.Id),
		}, {
			kind: () => undefined,
		}),
		createResolver(calls, 11, Source.NostrBand_Rest, {
			[FixtureNetworkSelector.Id]: createResolve(calls, 11, Source.NostrBand_Rest, FixtureNetworkSelector.Id),
		}, {
			tags: {
				partial: true,
				select: (snapshot: FixtureSnapshot) => snapshot.tags.slice(0, 2),
			},
		}),
		createResolver(calls, 12, Source.Primal_Rest, {
			[FixtureNetworkSelector.Id]: createResolve(calls, 12, Source.Primal_Rest, FixtureNetworkSelector.Id),
		}, {
			tags: {
				select: () => {
					throw new Error('tags field facet failed')
				},
			},
		}),
		createResolver(calls, 13, Source.Neynar_Rest, {
			[FixtureNetworkSelector.Id]: createResolve(calls, 13, Source.Neynar_Rest, FixtureNetworkSelector.Id),
		}, {
			idConditionalText: () => 'parent id matched without field hydration',
			conditionalText: () => 'field row condition matched',
		}),
		createResolver(calls, 14, Source.Atproto_Xrpc, {
			[FixtureNetworkSelector.Id]: createResolve(calls, 14, Source.Atproto_Xrpc, FixtureNetworkSelector.Id),
		}, {
			conditionalText: () => 'should not resolve',
		}),
		{
			...createResolver(calls, 15, Source.Farcaster_Rest, {
				[FixtureNetworkSelector.Id]: createResolve(calls, 15, Source.Farcaster_Rest, FixtureNetworkSelector.Id),
			}, {
				$$networks: {
					parentSelectors: [
						FixtureNetworkSelector.Id,
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
			[FixtureNetworkSelector.Id]: createResolve(calls, 16, Source.Reddit_Rest, FixtureNetworkSelector.Id),
		}, {
			$$networks: {
				parentSelectors: [
					FixtureNetworkSelector.Id,
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
			[FixtureNetworkSelector.Id]: createResolve(calls, 17, Source.Reddit_Rest, FixtureNetworkSelector.Id),
		}, {
			$$networks: {
				parentSelectors: [
					FixtureNetworkSelector.Id,
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
			[FixtureNetworkSelector.Id]: createResolve(calls, 18, Source.Beacon_Rest, FixtureNetworkSelector.Id),
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
		queryClient: new QueryClient({
			defaultOptions: {
				queries: {
					gcTime: 0,
				},
			},
		}),
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

const networkIds = (
	result: Awaited<ReturnType<typeof subscribeEntity<typeof fixtureSchema, EntityType.Network, {
		readonly fields: {
			readonly $$networks: true
		}
	}>>>,
) => result.fields.$$networks.values.map((value) => value[EntityMetaKey.Selector].id)


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

	it('starts collection work from resource getter reads', async () => {
		const { context } = await createFixtureContext()
		const resource = subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				name: true,
			},
		})

		expect(resource.current).toBeUndefined()
		await expect.poll(() => context.queryClient.getQueryCache().getAll().some((query) => (
			query.queryKey[0] === `Field:${EntityType.Network}:name`
		))).toBe(true)
		await resource
		expect(resource.current?.fields.name).toBe('Parent')
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
				entitySelector: {
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

	it('selects resolver definitions by requested selector and records derived selectors', async () => {
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
			call.selectorName,
		])).toContainEqual([
			2,
			FixtureNetworkSelector.Slug,
		])
		expect(
			context.entityCollections[EntityType.Network].toArray.find((entity) => (
				entity[EntityMetaKey.SelectorKey] === entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
					slug: 'parent-slug',
				})
			)),
		).toMatchObject({
			[EntityMetaKey.Source]: Source.Coingecko_Rest,
			name: 'Slug Parent',
		})
	})

	it('reuses derived selector rows for later selector-equivalent entity requests', async () => {
		const { context, calls } = await createFixtureContext()
		await subscribeEntity(context, EntityType.Network, {
			slug: 'parent-slug',
		}, {
			sources: [
				Source.Coingecko_Rest,
			],
			fields: {
				name: true,
			},
		})
		await expect.poll(() => context.queryClient.isFetching()).toBe(0)
		calls.splice(0)
		context.events.collectionSync.splice(0)

		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			sources: [
				Source.Coingecko_Rest,
			],
			fields: {
				name: true,
			},
		})
		await expect.poll(() => context.queryClient.isFetching()).toBe(0)

		expect(result.fields.name).toBe('Slug Parent')
		expect(calls).toEqual([])
		expect(context.events.collectionSync.map((event) => event.collection.kind)).toEqual(expect.arrayContaining([
			'Entity',
			'Field',
		]))
		expect(context.entityCollections[EntityType.Network].toArray).toEqual(expect.arrayContaining([
			expect.objectContaining({
				[EntityMetaKey.Source]: Source.Coingecko_Rest,
				[EntityMetaKey.Selector]: {
					id: 'parent',
				},
			}),
			expect.objectContaining({
				[EntityMetaKey.Source]: Source.Coingecko_Rest,
				[EntityMetaKey.Selector]: {
					slug: 'parent-slug',
				},
			}),
		]))
	})

	it('projects multi-value field rows from hydrated entity snapshots without resolver work', async () => {
		const { context, calls } = await createFixtureContext()
		await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			sources: [
				Source.Local_Internal,
			],
			fields: {
				name: true,
			},
		})
		context.entityCollections[EntityType.Network].utils.writeUpsert({
			...fixtureSnapshots.parent,
			[EntityMetaKey.Fields]: {
				id: fixtureSnapshots.parent.id,
				slug: fixtureSnapshots.parent.slug,
				name: fixtureSnapshots.parent.name,
				kind: fixtureSnapshots.parent.kind,
				labels: fixtureSnapshots.parent.labels,
				tags: fixtureSnapshots.parent.tags,
			},
			[EntityMetaKey.Selector]: {
				id: fixtureSnapshots.parent.id,
			},
			[EntityMetaKey.SelectorKey]: entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
				id: fixtureSnapshots.parent.id,
			}),
			[EntityMetaKey.Source]: Source.Local_Internal,
		})
		await expect.poll(() => context.queryClient.isFetching()).toBe(0)
		calls.splice(0)
		context.events.collectionSync.splice(0)

		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			sources: [
				Source.Local_Internal,
			],
			fields: {
				tags: {
					sources: [
						Source.Local_Internal,
					],
				},
			},
		})
		await expect.poll(() => context.queryClient.isFetching()).toBe(0)

		expect(result.fields.tags.values).toEqual(expect.arrayContaining([
			'red',
			'green',
			'blue',
		]))
		expect(result.fields.tags.values).toHaveLength(3)
		expect(calls).toEqual([])
		expect(context.entityFieldCollections[EntityType.Network].tags.toArray.map((row) => row[EntityMetaKey.Value])).toEqual(expect.arrayContaining([
			'red',
			'green',
			'blue',
		]))
		expect(context.events.collectionSync.map((event) => event.collection.kind)).toEqual(expect.arrayContaining([
			'Field',
		]))
	})

	it('projects selector-equivalent multi-value fields from hydrated entity snapshots', async () => {
		const { context, calls } = await createFixtureContext()
		await subscribeEntity(context, EntityType.Network, {
			slug: 'parent-slug',
		}, {
			sources: [
				Source.Local_Internal,
			],
			fields: {
				name: true,
			},
		})
		context.entityCollections[EntityType.Network].utils.writeUpsert({
			...fixtureSnapshots.parent,
			[EntityMetaKey.Fields]: {
				id: fixtureSnapshots.parent.id,
				slug: fixtureSnapshots.parent.slug,
				name: fixtureSnapshots.parent.name,
				kind: fixtureSnapshots.parent.kind,
				labels: fixtureSnapshots.parent.labels,
				tags: fixtureSnapshots.parent.tags,
			},
			[EntityMetaKey.Selector]: {
				slug: fixtureSnapshots.parent.slug,
			},
			[EntityMetaKey.SelectorKey]: entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
				slug: fixtureSnapshots.parent.slug,
			}),
			[EntityMetaKey.Source]: Source.Local_Internal,
		})
		await expect.poll(() => context.queryClient.isFetching()).toBe(0)
		calls.splice(0)

		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			sources: [
				Source.Local_Internal,
			],
			fields: {
				tags: {
					sources: [
						Source.Local_Internal,
					],
				},
			},
		})
		await expect.poll(() => context.queryClient.isFetching()).toBe(0)

		expect(result.fields.tags.values).toEqual(expect.arrayContaining([
			'red',
			'green',
			'blue',
		]))
		expect(result.fields.tags.values).toHaveLength(3)
		expect(calls).toEqual([])
		expect(context.entityFieldCollections[EntityType.Network].tags.toArray.some((row) => (
			row[EntityMetaKey.ParentSelectorKey] === entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
				id: 'parent',
			})
			&& row[EntityMetaKey.Source] === Source.Local_Internal
			&& row[EntityMetaKey.Value] === 'green'
		))).toBe(true)
	})

	it('reuses persisted empty subset markers for repeated empty many fields and counts', async () => {
		const { context, calls } = await createFixtureContext()
		const first = await subscribeEntity(context, EntityType.Network, {
			id: 'network-c',
		}, {
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
			},
		})
		await expect.poll(() => context.queryClient.isFetching()).toBe(0)

		expect(first.fields.tags.values).toEqual([])
		expect(first.fields.tags.totalCount).toBe(0)
		expect(context.loadedSubsets.size).toBeGreaterThan(0)
		const loadedSubsetCount = context.loadedSubsets.size
		calls.splice(0)
		context.events.collectionSync.splice(0)

		const second = await subscribeEntity(context, EntityType.Network, {
			id: 'network-c',
		}, {
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
			},
		})
		await expect.poll(() => context.queryClient.isFetching()).toBe(0)

		expect(second.fields.tags.values).toEqual([])
		expect(second.fields.tags.totalCount).toBe(0)
		expect(calls).toEqual([])
		expect(context.loadedSubsets.size).toBe(loadedSubsetCount)
	})

	it('does not let nonempty loaded markers hide missing persisted field rows', async () => {
		const firstContext = await createFixtureContext()
		await subscribeEntity(firstContext.context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				$$networks: {
					sources: [
						Source.Local_Internal,
					],
				},
			},
		})
		await expect.poll(() => firstContext.context.queryClient.isFetching()).toBe(0)

		const loadedSubset = firstContext.context.loadedSubsets.toArray.find((row) => (
			row.collectionId === `Field:${EntityType.Network}:$$networks`
			&& row.rowCount > 0
		))
		if (loadedSubset == null)
			throw new Error('expected nonempty loaded subset marker')

		expect(loadedSubset.rowCount).toBeGreaterThan(0)

		const { context, calls } = await createFixtureContext()
		await context.loadedSubsets.insert(loadedSubset).isPersisted.promise
		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				$$networks: {
					sources: [
						Source.Local_Internal,
					],
				},
			},
		})
		await expect.poll(() => context.queryClient.isFetching()).toBe(0)

		expect(networkIds(result)).toEqual(expect.arrayContaining([
			'network-a',
		]))
		expect(calls.length).toBeGreaterThan(0)
	})

	it('resolves requested selectors through derived parent selectors at the field and count collection boundary', async () => {
		const { context, calls } = await createFixtureContext()
		const fieldSubscription = context.entityFieldCollections[EntityType.Network].$$networks.subscribeChanges(() => {}, {
			includeInitialState: true,
			where: (fieldRow) => and(
				inArray(fieldRow[EntityMetaKey.ParentSelectorKey], [
					entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
						slug: 'parent-slug',
					}),
					entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
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
				inArray(count[EntityMetaKey.ParentSelectorKey], [
					entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
						slug: 'parent-slug',
					}),
					entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
						id: 'parent',
					}),
				]),
				inArray(count[EntityMetaKey.Source], [
					Source.Local_Internal,
				]),
			),
		})

		await expect.poll(() => context.entityFieldCollections[EntityType.Network].$$networks.toArray.some((row) => (
			row[EntityMetaKey.ParentSelectorKey] === entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
				id: 'parent',
			})
			&& row[EntityMetaKey.Source] === Source.Local_Internal
		))).toBe(true)
		await expect.poll(() => countCollection.toArray.some((row) => (
			row[EntityMetaKey.ParentSelectorKey] === entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
				id: 'parent',
			})
			&& row[EntityMetaKey.Source] === Source.Local_Internal
			&& row[EntityMetaKey.Value] === 3
		))).toBe(true)
		expect(context.entityFieldCollections[EntityType.Network].$$networks.toArray.some((row) => (
			row[EntityMetaKey.ParentSelectorKey] === entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
				slug: 'parent-slug',
			})
			&& row[EntityMetaKey.Source] === Source.Local_Internal
		))).toBe(false)
		expect(calls.map((call) => [
			call.definitionIndex,
			call.selectorName,
		])).toEqual(expect.arrayContaining([
			[
				0,
				FixtureNetworkSelector.Slug,
			],
			[
				0,
				FixtureNetworkSelector.Id,
			],
		]))
		fieldSubscription.unsubscribe()
		countSubscription.unsubscribe()
	})

	it('resolves subscribe requests through derived parent selectors', async () => {
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

		expect(networkIds(result)).toEqual(expect.arrayContaining([
			'network-b',
			'network-a',
			'network-c',
		]))
		expect(networkIds(result)).toHaveLength(3)
		expect(result.fields.$$networks.totalCount).toBe(3)
		expect(context.entityFieldCollections[EntityType.Network].$$networks.toArray.some((row) => (
			row[EntityMetaKey.ParentSelectorKey] === entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
				id: 'parent',
			})
			&& row[EntityMetaKey.Source] === Source.Blockscout_Rest
		))).toBe(true)
		expect(context.entityFieldCollections[EntityType.Network].$$networks.toArray.some((row) => (
			row[EntityMetaKey.ParentSelectorKey] === entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
				slug: 'parent-slug',
			})
			&& row[EntityMetaKey.Source] === Source.Blockscout_Rest
		))).toBe(false)
		expect(calls.map((call) => [
			call.definitionIndex,
			call.selectorName,
		])).toEqual(expect.arrayContaining([
			[
				0,
				FixtureNetworkSelector.Slug,
			],
			[
				4,
				FixtureNetworkSelector.Id,
			],
		]))
	})

	it('returns complete empty field and count results for incompatible parent selectors', async () => {
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
			call.selectorName,
		])).toContainEqual([
			9,
			FixtureNetworkSelector.Id,
		])
	})

	it('reuses loaded markers for complete multi-source subsets with partial source rows', async () => {
		const { context, calls } = await createFixtureContext()
		const first = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				$$networks: {
					sources: [
						Source.Constants_Internal,
						Source.Dune_Rest,
					],
					count: true,
				},
			},
		})
		await expect.poll(() => context.queryClient.isFetching()).toBe(0)

		expect(networkIds(first)).toEqual(expect.arrayContaining([
			'network-a',
			'network-d',
		]))
		expect(first.fields.$$networks.totalCount).toBe(2)
		expect(context.loadedSubsets.size).toBeGreaterThan(0)
		calls.splice(0)
		context.events.collectionSync.splice(0)

		const second = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				$$networks: {
					sources: [
						Source.Constants_Internal,
						Source.Dune_Rest,
					],
					count: true,
				},
			},
		})
		await expect.poll(() => context.queryClient.isFetching()).toBe(0)

		expect(networkIds(second)).toEqual(expect.arrayContaining([
			'network-a',
			'network-d',
		]))
		expect(second.fields.$$networks.totalCount).toBe(2)
		expect(calls).toEqual([])
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
			&& entity[EntityMetaKey.SelectorKey] === entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
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

		expect(result.fields.kind).toBe(FixtureKind.Enabled)
		expect(calls.map((call) => [
			call.definitionIndex,
			call.selectorName,
		])).toEqual(expect.arrayContaining([
			[
				10,
				FixtureNetworkSelector.Id,
			],
			[
				0,
				FixtureNetworkSelector.Id,
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

	it('loads missing higher-priority count sources instead of trusting lower-priority hydrated count rows', async () => {
		const { context, calls } = await createFixtureContext()
		const countCollection = context.entityFieldCountCollections[EntityType.Network].$$networks
		if (countCollection == null)
			throw new Error('expected fixture count collection')

		await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				$$networks: {
					sources: [
						Source.Local_Internal,
					],
					count: true,
				},
			},
		})
		await expect.poll(() => context.queryClient.isFetching()).toBe(0)
		expect(countCollection.toArray.some((row) => (
			row[EntityMetaKey.Source] === Source.Local_Internal
			&& row[EntityMetaKey.Value] === 3
		))).toBe(true)
		calls.splice(0)

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
		await expect.poll(() => context.queryClient.isFetching()).toBe(0)

		expect(result.fields.$$networks.totalCount).toBe(2)
		expect(countCollection.toArray).toEqual(expect.arrayContaining([
			expect.objectContaining({
				[EntityMetaKey.Source]: Source.Constants_Internal,
				[EntityMetaKey.Value]: 2,
			}),
			expect.objectContaining({
				[EntityMetaKey.Source]: Source.Local_Internal,
				[EntityMetaKey.Value]: 3,
			}),
		]))
		expect(calls.some((call) => call.source === Source.Constants_Internal)).toBe(true)
	})

	it('keeps Source Priority as merge semantics while preserving declarative display order and window', async () => {
		const { context } = await createFixtureContext()
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

		expect(networkIds(result)).toEqual([
			'network-a',
			'network-c',
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

		expect(networkIds(result)).toEqual([
			'network-a',
			'network-c',
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
				eq(fieldRow[EntityMetaKey.ParentSelectorKey], entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
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
				eq(entity[EntityMetaKey.SelectorKey], entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
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
				eq(entity[EntityMetaKey.SelectorKey], entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
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
				eq(entity[EntityMetaKey.SelectorKey], entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
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
				eq(fieldRow[EntityMetaKey.ParentSelectorKey], entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
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

	it('treats zero-cardinality resolver support as valid domain absence', async () => {
		const { context, calls } = await createFixtureContext()
		const subscription = context.entityFieldCollections[EntityType.Network].$absentNetwork.subscribeChanges(() => {}, {
			includeInitialState: true,
			where: (fieldRow) => and(
				eq(fieldRow[EntityMetaKey.ParentSelectorKey], entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
					id: 'parent',
				})),
				eq(fieldRow[EntityMetaKey.Source], Source.Local_Internal),
			),
		})

		await expect.poll(() => context.events.collectionSync.some((event) => (
			event.collection.kind === 'Field'
			&& event.collection.fieldName === '$absentNetwork'
		))).toBe(true)
		expect(calls.some((call) => (
			call.definitionIndex === 0
			&& call.source === Source.Local_Internal
		))).toBe(true)
		expect(context.entityFieldCollections[EntityType.Network].$absentNetwork.toArray).toEqual([])
		expect(context.queryClient.getQueryCache().getAll().some((query) => (
			String(query.state.error).includes('all compatible Field Facets failed')
		))).toBe(false)
		subscription.unsubscribe()
	})

	it('uses successful field facets when a compatible field facet fails', async () => {
		const { context } = await createFixtureContext()
		const subscription = context.entityFieldCollections[EntityType.Network].$$networks.subscribeChanges(() => {}, {
			includeInitialState: true,
			where: (fieldRow) => and(
				eq(fieldRow[EntityMetaKey.ParentSelectorKey], entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
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
			&& row[EntityMetaKey.Value][EntityMetaKey.Selector].id === 'network-a'
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
				eq(fieldRow[EntityMetaKey.ParentSelectorKey], entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
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
				eq(count[EntityMetaKey.ParentSelectorKey], entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
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
				eq(count[EntityMetaKey.ParentSelectorKey], entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
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
				eq(count[EntityMetaKey.ParentSelectorKey], entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
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

		expect(networkIds(result)).toContain('network-a')
		expect(networkIds(result)).toContain('network-duplicate')
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

		expect(networkIds(result)).toEqual([
			'network-a',
			'network-c',
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
			&& entity[EntityMetaKey.SelectorKey] === entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
				id: 'parent',
			})
		))
		expect(row).toBeDefined()
		if (row == null)
			throw new Error('expected Local_Internal parent row')

		context.entityCollections[EntityType.Network].utils.writeUpsert({
			...row,
			[EntityMetaKey.Source]: row[EntityMetaKey.Source],
			[EntityMetaKey.SelectorKey]: row[EntityMetaKey.SelectorKey],
			[EntityMetaKey.Fields]: {
				...row[EntityMetaKey.Fields],
				name: 'Live Parent',
			},
			name: 'Live Parent',
		})
		expect(context.entityCollections[EntityType.Network].toArray.find((entity) => (
			entity[EntityMetaKey.Source] === Source.Local_Internal
			&& entity[EntityMetaKey.SelectorKey] === row[EntityMetaKey.SelectorKey]
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
			&& row[EntityMetaKey.Value][EntityMetaKey.Selector].id === 'network-live'
		))).toBe(true)
		expect(context.entityFieldCountCollections[EntityType.Network].$$networks?.toArray.some((row) => (
			row[EntityMetaKey.Source] === Source.Farcaster_Rest
			&& row[EntityMetaKey.Value] === 1
		))).toBe(true)
		expect(context.entityFieldCountCollections[EntityType.Network].$$networks?.toArray.map((row) => row.filterKey)).toEqual([
			stringify({}),
		])
		await expect.poll(() => resource.current?.fields.$$networks.values.map((value) => value[EntityMetaKey.Selector].id)).toEqual([
			'network-live',
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
		await expect.poll(() => syncCount('Count', '$$networks')).toBe(beforeCountNetworks + 2)
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

		expect(result.fields.$primaryNetwork.value[EntityMetaKey.Selector]).toEqual({
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
			entity.entitySelector.id,
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
				entitySelector: {
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
				entitySelector: {
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
				eq(fieldRow[EntityMetaKey.ParentSelectorKey], entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
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
			[EntityMetaKey.ParentSelector]: {
				id: 'parent',
			},
			[EntityMetaKey.ParentSelectorKey]: entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
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
				entitySelector: {
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
				entitySelector: {
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
			[EntityMetaKey.ParentSelector]: {
				id: 'parent',
			},
			[EntityMetaKey.ParentSelectorKey]: entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
				id: 'parent',
			}),
			[EntityMetaKey.Source]: Source.Neynar_Rest,
			[EntityMetaKey.Value]: FixtureKind.Enabled,
			valueKey: stringify(FixtureKind.Enabled),
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

	it('uses selected sources before discriminator default sources', async () => {
		const { context } = await createFixtureContext()
		await subscribeEntity(context, EntityType.Network, {
			id: 'disabled',
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
			[EntityMetaKey.ParentSelector]: {
				id: 'disabled',
			},
			[EntityMetaKey.ParentSelectorKey]: entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
				id: 'disabled',
			}),
			[EntityMetaKey.Source]: Source.Neynar_Rest,
			[EntityMetaKey.Value]: FixtureKind.Enabled,
			valueKey: stringify(FixtureKind.Enabled),
		})
		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'disabled',
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

	it('uses discriminator defaults after selected field sources', async () => {
		const { context } = await createFixtureContext()
		const result = await subscribeEntity(context, EntityType.Network, {
			id: 'parent',
		}, {
			fields: {
				conditionalText: {
					sources: [
						Source.Atproto_Xrpc,
					],
				},
			},
		})

		expect(result.fields.conditionalText).toBe('should not resolve')
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

		expect(result.fields.kind).toBe(FixtureKind.Disabled)
		if (result.fields.kind === FixtureKind.Enabled)
			throw new Error('expected disabled conditional branch')

		expect(result.fields.conditionalTags.values).toEqual([])
		expect(result.fields.conditionalTags.totalCount).toBe(0)
		expect(countCollection.toArray.some((row) => (
			row[EntityMetaKey.ParentSelectorKey] === entitySelectorKey(fixtureSchema, fixtureEntityDefinition, {
				id: 'disabled',
			})
			&& row[EntityMetaKey.Source] === Source.Local_Internal
			&& row[EntityMetaKey.Value] === 0
		))).toBe(true)
	})
})
