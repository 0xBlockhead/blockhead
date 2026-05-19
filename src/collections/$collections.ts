import { QueryClient } from '@tanstack/query-core'
import {
	queryCollectionOptions,
	type QueryCollectionUtils,
} from '@tanstack/query-db-collection'
import {
	persistedCollectionOptions,
	type PersistedCollectionPersistence,
} from '@tanstack/db-sqlite-persistence-core'
import {
	BasicIndex,
	createCollection,
	type LoadSubsetOptions,
	parseLoadSubsetOptions,
	parseOrderByExpression,
	type SyncConfig,
} from '@tanstack/svelte-db'
import { stringify, parse } from 'devalue'

import { assertEntityFieldResolverResult } from '$/collections/assertLoadedCollectionRows.ts'

import {
	EntityFieldCardinality,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
import type {
	EntityDefinitionForEntityType,
	EntityFieldDefinition,
	EntityFieldName,
	EntityFieldValue,
	EntityFieldValues,
	EntityId,
	EntityType,
	Schema,
} from '$/schema/$schema.ts'
import type {
	EntityFieldResolver,
	EntityResolver,
} from '$/resolvers/$resolvers.ts'
import { Source } from '$/sources/$Source.ts'
import { resolverPublicEnvBySource } from '$/sources/index.ts'


export type EntityCollectionItem<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = {
	[EntityMetaKey.Id]: EntityId<_Schema, _EntityType>
	[EntityMetaKey.IdKey]: string
	[EntityMetaKey.Fields]: Partial<EntityFieldValues<_Schema, _EntityType>>
	[EntityMetaKey.Source]: Source
} & Partial<EntityFieldValues<_Schema, _EntityType>>

export type EntityCollectionItemInsert<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = EntityCollectionItem<_Schema, _EntityType>

type EntityFieldCollectionValue<_Value> = (
	_Value extends { [EntityMetaKey.Id]: infer _EntityId } ?
		{
			[EntityMetaKey.Id]: _EntityId
			[EntityMetaKey.IdKey]: string
		}
	:
		_Value
)

type EntityFieldCollectionValueId<_Value> = (
	_Value extends { [EntityMetaKey.Id]: infer _EntityId } ?
		_EntityId
	:
		never
)

type EntityCollectionUtils<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = QueryCollectionUtils<
	EntityCollectionItem<_Schema, _EntityType>,
	string | number,
	EntityCollectionItem<_Schema, _EntityType>,
	unknown
>

type EntityFieldCollectionUtils<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_EntityFieldName extends EntityFieldName<_Schema, _EntityType>,
> = QueryCollectionUtils<
	EntityFieldCollectionItem<_Schema, _EntityType, _EntityFieldName>,
	string | number,
	EntityFieldCollectionItem<_Schema, _EntityType, _EntityFieldName>,
	unknown
>

const hasEntityValueId = <_Value extends object>(
	value: _Value,
): value is _Value & { [EntityMetaKey.Id]: EntityFieldCollectionValueId<_Value> } => (
	EntityMetaKey.Id in value
)

/** Stable row key for entity field collection items; must match `getKey` in `createEntityFieldCollection`. */
export const entityFieldCollectionItemKey = <_Value>(entityFieldItem: {
	[EntityMetaKey.Source]: Source
	[EntityMetaKey.ParentIdKey]: string
	[EntityMetaKey.Value]: _Value
}) => (
	[
		entityFieldItem[EntityMetaKey.Source],
		entityFieldItem[EntityMetaKey.ParentIdKey],
		stringify(
			entityFieldItem[EntityMetaKey.Value] != null
			&& typeof entityFieldItem[EntityMetaKey.Value] === 'object'
			&& hasEntityValueId(entityFieldItem[EntityMetaKey.Value]) ?
				entityFieldItem[EntityMetaKey.Value][EntityMetaKey.Id]
			:
				entityFieldItem[EntityMetaKey.Value],
		),
	]
		.join('\x1E')
)

/** Optional sort facets merged onto compact `Coin` refs for `$$coins` (see Coingecko `$$coins` resolver). */
const denormalizedCoinListSortKeys = [
	'marketCapRank',
	'marketCapUsd',
] as const

/** Latest catalog snapshot refs on compact `Currency` rows for `$$currencies` list sort. */
const denormalizedCurrencyListSnapshotKeys = [
	'$$timestamps',
] as const

/** OHLC bigints kept on compact `Market_TimeInterval_Timestamp` refs for charts and list rows. */
const denormalizedOhlcPrimitiveKeys = [
	'open',
	'high',
	'low',
	'close',
] as const

const entityFieldCollectionValue = <_Value>(
	value: _Value,
): EntityFieldCollectionValue<_Value> => (
	value != null
	&& typeof value === 'object'
	&& hasEntityValueId(value) ?
		({
			[EntityMetaKey.Id]: value[EntityMetaKey.Id],
			[EntityMetaKey.IdKey]: stringify(value[EntityMetaKey.Id]),
			...Object.fromEntries(
				[
					...denormalizedCoinListSortKeys.flatMap((sortKey) => {
						const raw = (value as Record<string, unknown>)[sortKey]
						return (
							typeof raw === 'number' && Number.isFinite(raw) ?
								[[sortKey, raw] as const]
							:
								[]
						)
					}),
					...denormalizedCurrencyListSnapshotKeys.flatMap((fieldName) => {
						const raw = (value as Record<string, unknown>)[fieldName]
						return (
							Array.isArray(raw) ?
								[[fieldName, raw] as const]
							:
								[]
						)
					}),
					...denormalizedOhlcPrimitiveKeys.flatMap((fieldName) => {
						const raw = (value as Record<string, unknown>)[fieldName]
						return (
							typeof raw === 'bigint' ?
								[[fieldName, raw] as const]
							:
								[]
						)
					}),
				],
			),
		} as EntityFieldCollectionValue<_Value>)
	:
		value as EntityFieldCollectionValue<_Value>
)

type EntityFieldCollectionInnerValue<
	_Schema extends Schema,
	_ParentEntityType extends EntityType<_Schema>,
	_EntityFieldName extends EntityFieldName<_Schema, _ParentEntityType>,
> = (
	Exclude<EntityFieldValue<_Schema, _ParentEntityType, _EntityFieldName>, undefined> extends infer _Value ?
		_Value extends readonly (infer _Element)[] ?
			_Element
		:
			_Value
	:
		never
)

export type EntityFieldCollectionItem<
	_Schema extends Schema,
	_ParentEntityType extends EntityType<_Schema>,
	_EntityFieldName extends EntityFieldName<_Schema, _ParentEntityType>,
> = {
	[EntityMetaKey.ParentId]: EntityId<_Schema, _ParentEntityType>
	[EntityMetaKey.ParentIdKey]: string
	[EntityMetaKey.Value]: EntityFieldCollectionValue<EntityFieldCollectionInnerValue<_Schema, _ParentEntityType, _EntityFieldName>>
	[EntityMetaKey.Source]: Source
}

type EntityCollectionResult<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = ReturnType<typeof createEntityCollection<_Schema, _EntityType>>

type EntityFieldCollectionResult<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldDefinition extends EntityDefinitionForEntityType<_Schema, _EntityType>['fields'][number],
> = ReturnType<typeof createEntityFieldCollection<_Schema, _EntityType, _FieldDefinition>>

export type EntityCollections<_Schema extends Schema> = {
	[_EntityType in EntityType<_Schema>]: EntityCollectionResult<_Schema, _EntityType>
}

export type EntityFieldCollections<_Schema extends Schema> = {
	[_EntityType in EntityType<_Schema>]: {
		[_EntityFieldName in EntityFieldName<_Schema, _EntityType>]: EntityFieldCollectionResult<
			_Schema,
			_EntityType,
			EntityFieldDefinition<_Schema, _EntityType, _EntityFieldName>
		>
	}
}

export type EntityFieldCollectionForReference<
	_Schema extends Schema,
	_Reference,
> = (
	_Reference extends {
		entityType: infer _EntityType extends EntityType<_Schema>
	} ?
		_Reference extends {
			fieldName: infer _EntityFieldName extends EntityFieldName<_Schema, _EntityType>
		} ?
			EntityFieldCollections<_Schema>[_EntityType][_EntityFieldName]
		:
			never
	:
		never
)

export const entityFieldCollectionForReference = <
	_Schema extends Schema,
	_ListedEntity extends EntityType<_Schema>,
	_Reference extends EntityFieldReference<_Schema, _ListedEntity>,
>(
	entityFieldCollections: EntityFieldCollections<_Schema>,
	entityFieldReference: _Reference,
): EntityFieldCollectionForReference<_Schema, _Reference> => (
	entityFieldCollections[entityFieldReference.entityType][entityFieldReference.fieldName] as EntityFieldCollectionForReference<
		_Schema,
		_Reference
	>
)

const fulfilledOrThrow = <T>(
	settled: PromiseSettledResult<T>[],
	allFailedMessage: string,
): T[] => {
	const fulfilled = settled.filter((r): r is PromiseFulfilledResult<T> => (
		r.status === 'fulfilled'
	))

	if (settled.length > 0 && fulfilled.length === 0) {
		const reasons = settled.filter((r): r is PromiseRejectedResult => r.status === 'rejected').map((r) => r.reason)
		throw new AggregateError(
			reasons,
			`${allFailedMessage}: ${reasons.map((r) => (r instanceof Error ? r.message : String(r))).join(' | ')}`,
		)
	}

	return fulfilled.map((r) => r.value)
}

/** Live-query subset `eq` values: devalue strings and unwrap single-element arrays. */
const subsetFilterEntityId = (value: unknown): unknown => (
	typeof value === 'string' ?
		(() => {
			try {
				return subsetFilterEntityId(parse(value))
			} catch {
				return value
			}
		})()
	: Array.isArray(value) && value.length === 1 ?
		subsetFilterEntityId(value[0])
	:
		value
)

/**
 * `persistOnDemandSubsets` short-circuits warm-reload `loadSubset` calls when OPFS rows
 * (or the loaded-subset metadata marker) cover the request. Keeping `staleTime` infinite
 * prevents TanStack Query from triggering its own background refetch path that bypasses
 * the wrapper; manual refreshes still flow through resolvers.
 */
const collectionStaleTime = Number.POSITIVE_INFINITY

/** Keep persisted rows in OPFS until schema/version changes so revisits hydrate without re-fetching upstream. */
const collectionPersistedGcTime = Number.POSITIVE_INFINITY


type ParsedLoadSubset = ReturnType<typeof parseLoadSubsetOptions>
type SubsetFilter = ParsedLoadSubset['filters'][number]
type PersistOnDemandSubsetSync<
	_Row extends object,
	_Key extends string | number,
> = SyncConfig<_Row, _Key>
type PersistOnDemandSubsetCollection<
	_Row extends object,
	_Key extends string | number,
> = Parameters<PersistOnDemandSubsetSync<_Row, _Key>['sync']>[0]['collection']

const comparisonsFromWhereLenient = (where: unknown): ParsedLoadSubset['filters'] => {
	const expr = (
		typeof where === 'object'
		&& where != null
		&& 'expression' in where ?
			(where as { expression: unknown }).expression
		:
			where
	)
	const out: ParsedLoadSubset['filters'] = []
	const visit = (e: unknown) => {
		if (!e || typeof e !== 'object') return
		const node = e as { type?: string, name?: string, args?: unknown[] }
		if (node.type !== 'func' || !Array.isArray(node.args)) return
		if (node.name === 'and') {
			node.args.forEach(visit)
			return
		}
		if (node.name === 'eq') {
			const [l, r] = node.args
			const leftPath = (
				l
				&& typeof l === 'object'
				&& (l as { type: string }).type === 'ref' ?
					(l as { path: string[] }).path
				:
					null
			)
			const rightVal = (
				r
				&& typeof r === 'object'
				&& (r as { type: string }).type === 'val' ?
					(r as { value: unknown }).value
				:
					undefined
			)
			if (leftPath && rightVal !== undefined) {
				out.push({
					field: leftPath,
					operator: 'eq',
					value: rightVal,
				})
			}
			return
		}
		if (node.name === 'in' || node.name === 'inArray') {
			const [l, r] = node.args
			const leftPath = (
				l
				&& typeof l === 'object'
				&& (l as { type: string }).type === 'ref' ?
					(l as { path: string[] }).path
				:
					null
			)
			const rightVal = (
				r
				&& typeof r === 'object'
				&& (r as { type: string }).type === 'val' ?
					(r as { value: unknown }).value
				:
					undefined
			)
			if (leftPath && rightVal !== undefined) {
				out.push({
					field: leftPath,
					operator: 'in',
					value: rightVal,
				})
			}
		}
	}
	visit(expr)
	return out
}

const parseLoadSubsetForQueryFn = (
	options: Parameters<typeof parseLoadSubsetOptions>[0],
): ParsedLoadSubset => {
	try {
		return parseLoadSubsetOptions(options)
	} catch {
		if (!options) {
			return { filters: [], sorts: [] }
		}
		return {
			filters: comparisonsFromWhereLenient(options.where),
			sorts: (
				(() => {
					try {
						return parseOrderByExpression(options.orderBy)
					} catch {
						return []
					}
				})()
			),
			limit: options.limit,
		}
	}
}

const loadedSubsetMetadataKey = (loadSubsetOptions: LoadSubsetOptions) => (
	[
		'blockhead:loaded-subset',
		stringify({
			filters: parseLoadSubsetForQueryFn(loadSubsetOptions).filters.map((filter) => ({
				field: filter.field.map((part) => String(part)),
				operator: filter.operator,
				value: filter.value,
			})),
			limit: loadSubsetOptions.limit,
			sorts: parseLoadSubsetForQueryFn(loadSubsetOptions).sorts,
		}),
	]
		.join(':')
)

const valueAtPath = (value: unknown, path: readonly unknown[]): unknown => (
	path.reduce<unknown>((current, part) => (
		current != null && typeof current === 'object' ?
			(current as Record<string, unknown>)[String(part)]
		:
			undefined
	), value)
)

const subsetValuesEqual = (left: unknown, right: unknown) => (
	Object.is(left, right)
	|| stringify(left) === stringify(right)
)

const rowMatchesSubsetFilter = (row: unknown, filter: SubsetFilter) => (
	filter.operator === 'eq' ?
		subsetValuesEqual(valueAtPath(row, filter.field), filter.value)
	: filter.operator === 'in' ?
		(
			Array.isArray(filter.value) ?
				filter.value
			:
				[filter.value]
		)
			.some((value) => subsetValuesEqual(valueAtPath(row, filter.field), value))
	:
		false
)

const collectionHasHydratedSubset = <
	_Row extends object,
	_Key extends string | number,
>(
	collection: PersistOnDemandSubsetCollection<_Row, _Key>,
	loadSubsetOptions: LoadSubsetOptions,
) => {
	if (collection.size === 0) return false
	const filters = parseLoadSubsetForQueryFn(loadSubsetOptions).filters
	// Unfiltered subsets (like Global `$$networks`) need either the loaded-subset marker
	// or a real remote load. Any random hydrated row is not enough to prove completeness.
	if (filters.length === 0) return false
	const sourceFilter = filters.find((filter) => (
		filter.operator === 'in'
		&& filter.field.length === 1
		&& String(filter.field[0]) === EntityMetaKey.Source
	))
	if (sourceFilter != null) {
		return (
			(
				Array.isArray(sourceFilter.value) ?
					sourceFilter.value
				:
					[sourceFilter.value]
			)
				.every((source) => (
					[...collection.values()].some((row) => (
						filters.every((filter) => (
							filter === sourceFilter ?
								subsetValuesEqual(valueAtPath(row, filter.field), source)
							:
								rowMatchesSubsetFilter(row, filter)
						))
					))
				))
		)
	}
	return [...collection.values()].some((row) => (
		filters.every((filter) => rowMatchesSubsetFilter(row, filter))
	))
}

const collectionSnapshotHasChanges = <
	_Row extends object,
	_Key extends string | number,
>(
	collection: PersistOnDemandSubsetCollection<_Row, _Key>,
	loadSubsetOptions: LoadSubsetOptions,
): boolean | undefined => {
	const snapshotOpts = (
		loadSubsetOptions.orderBy != null ?
			{
				where: loadSubsetOptions.where,
				orderBy: loadSubsetOptions.orderBy,
				...(loadSubsetOptions.limit != null && { limit: loadSubsetOptions.limit }),
			}
		:
			{
				where: loadSubsetOptions.where,
			}
	)
	let localChanges: unknown
	try {
		localChanges = collection.currentStateAsChanges(snapshotOpts)
	} catch {
		return undefined
	}
	if (Array.isArray(localChanges) && localChanges.length > 0)
		return true
	if (
		localChanges != null
		&& (!Array.isArray(localChanges) || localChanges.length > 0)
	)
		return false
	if (loadSubsetOptions.where == null)
		return false

	return [
		{ where: loadSubsetOptions.where },
		...(
			loadSubsetOptions.orderBy != null ?
				[
					{
						where: loadSubsetOptions.where,
						orderBy: loadSubsetOptions.orderBy,
					},
				]
			:
				[]
		),
	]
		.some((opts) => {
			try {
				const broader = collection.currentStateAsChanges(opts)
				return Array.isArray(broader) && broader.length > 0
			} catch {
				return false
			}
		})
}

const persistOnDemandSubsets = <_Options>(options: _Options) => {
	const outerSync = (options as _Options & {
		sync: PersistOnDemandSubsetSync<object, string | number>
	}).sync

	return {
		...options,
		sync: {
			...outerSync,
			sync: (params: Parameters<typeof outerSync.sync>[0]) => {
				const syncResult = outerSync.sync(params)

				if (syncResult == null || typeof syncResult === 'function')
					return syncResult

				return {
					...syncResult,
					loadSubset: (loadSubsetOptions: LoadSubsetOptions) => {
						const loadedKey = loadedSubsetMetadataKey(loadSubsetOptions)
						const subsetFilters = parseLoadSubsetForQueryFn(loadSubsetOptions).filters
						const sourceInFilter = subsetFilters.find((filter) => (
							filter.operator === 'in'
							&& filter.field.length === 1
							&& String(filter.field[0]) === EntityMetaKey.Source
						))
						const subsetListsMultipleSources = sourceInFilter != null
						const everyListedSourceHydrated = (
							!subsetListsMultipleSources
							|| collectionHasHydratedSubset(params.collection, loadSubsetOptions)
						)

						if (collectionHasHydratedSubset(params.collection, loadSubsetOptions))
							return true
						if (
							params.metadata?.collection.get(loadedKey) === true
							&& everyListedSourceHydrated
						)
							return true

						const markLoaded = () => {
							if (params.begin == null || params.commit == null || params.metadata == null)
								return
							const subsetComplete = (
								!subsetListsMultipleSources
								|| collectionHasHydratedSubset(params.collection, loadSubsetOptions)
							)
							if (!subsetComplete)
								return
							params.begin()
							params.metadata.collection.set(loadedKey, true)
							params.commit()
						}
						const loadRemoteAndMarkLoaded = () => {
							const remote = syncResult.loadSubset?.(loadSubsetOptions)
							if (remote != null && typeof remote === 'object' && 'then' in remote)
								return remote.then(() => {
									markLoaded()
								})

							markLoaded()
							return remote ?? true
						}

						const hasSnapshotChanges = collectionSnapshotHasChanges(
							params.collection,
							loadSubsetOptions,
						)

						if (hasSnapshotChanges === undefined)
							return loadRemoteAndMarkLoaded()
						if (hasSnapshotChanges && everyListedSourceHydrated)
							return true

						return loadRemoteAndMarkLoaded()
					},
				}
			},
		},
	} as _Options
}

const createEntityCollection = <
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
>({
	entityResolvers,
	entityType,
	persistence,
	queryClient,
	schemaVersion,
}: {
	entityResolvers: EntityResolver<_Schema, _EntityType>[]
	entityType: _EntityType
	persistence: PersistedCollectionPersistence
	queryClient: QueryClient
	schemaVersion: number
}) => {
	const collection = createCollection(
		persistedCollectionOptions<
			EntityCollectionItem<_Schema, _EntityType>,
			string | number,
			never,
			EntityCollectionUtils<_Schema, _EntityType>
		>({
			...persistOnDemandSubsets(queryCollectionOptions({
				queryKey: (loadSubsetOptions) => [
					`EntityCollection:${entityType}`,
					...(
						loadSubsetOptions == null || Object.keys(loadSubsetOptions).length === 0 ?
							[]
						:
							[
								{
									filters: parseLoadSubsetForQueryFn(loadSubsetOptions).filters.map((filter) => ({
										field: filter.field.map((part) => String(part)),
										operator: filter.operator,
										value: filter.value,
									})),
									limit: loadSubsetOptions.limit,
									sorts: parseLoadSubsetForQueryFn(loadSubsetOptions).sorts,
								},
							]
					),
				],

				syncMode: 'on-demand',

				autoIndex: 'eager',
				defaultIndexType: BasicIndex,

				persistedGcTime: collectionPersistedGcTime,

				staleTime: collectionStaleTime,

				queryFn: async (queryContext) => {
					const subsetBase = parseLoadSubsetForQueryFn(queryContext.meta?.loadSubsetOptions)

					const { filters } = subsetBase

					const sources = new Set(
						[
							...(
								filters
									.filter((clause) => (
										clause.field[clause.field.length - 1] === EntityMetaKey.Source
										&& (clause.operator === 'in' || clause.operator === 'eq')
									))
									.flatMap((clause) => (
										clause.operator === 'eq' ?
											[clause.value]
										: Array.isArray(clause.value) ?
											clause.value
										:
											[clause.value]
									))
							) as Source[],
						],
					)
					const idKeyFilterValues = new Set(
						filters
							.filter((clause) => (
								clause.field[clause.field.length - 1] === EntityMetaKey.IdKey
								&& (clause.operator === 'eq' || clause.operator === 'in')
							))
							.flatMap((clause) => (
								clause.operator === 'eq' ?
									[clause.value]
								: Array.isArray(clause.value) ?
									clause.value
								:
									[clause.value]
							))
					)
					const entityIds = (
						[...idKeyFilterValues]
							.map((value) => (
								subsetFilterEntityId(value) as EntityId<_Schema, _EntityType>
							))
					)

					return (
						(await Promise.all(
							entityIds.map(async (entityId) => {
								const resolvers = (
									sources.size ?
										entityResolvers
											.filter((entityResolver) => sources.has(entityResolver.source))
									:
										entityResolvers
								)

								const settled = await Promise.allSettled(
									resolvers
										.map(async (entityResolver) => {
											const fields = await entityResolver.resolve(
												entityId,
												{
													filters: subsetBase.filters,
													sorts: subsetBase.sorts,
													limit: subsetBase.limit,
													publicEnv: resolverPublicEnvBySource.get(entityResolver.source) ?? {},
												},
											)

											return {
												...(
													fields != null && typeof fields === 'object' && !Array.isArray(fields) ?
														fields
													:
														{}
												),
												[EntityMetaKey.Id]: entityId,
												[EntityMetaKey.IdKey]: stringify(entityId),
												[EntityMetaKey.Source]: entityResolver.source,
												[EntityMetaKey.Fields]: fields,
											}
										}),
								)

								return fulfilledOrThrow(
									settled,
									`All ${settled.length} resolver(s) failed for ${stringify(entityId)}`,
								)
							}),
						))
							.flat()
					) as EntityCollectionItem<_Schema, _EntityType>[]
				},

				getKey: (entityItem) => (
					[
						entityItem[EntityMetaKey.Source],
						entityItem[EntityMetaKey.IdKey],
					]
						.join('\x1E')
				),

				queryClient,
			})),

			id: `EntityCollection:${entityType}`,

			persistence,
			schemaVersion,
		}),
	)

	return collection
}


const createEntityFieldCollection = <
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldDefinition extends EntityDefinitionForEntityType<_Schema, _EntityType>['fields'][number],
>({
	entityFieldResolvers,
	entityType,
	fieldDefinition,
	persistence,
	queryClient,
	schemaVersion,
}: {
	entityFieldResolvers: EntityFieldResolver<_Schema, _EntityType, _FieldDefinition['name']>[]
	entityType: _EntityType
	fieldDefinition: _FieldDefinition
	persistence: PersistedCollectionPersistence
	queryClient: QueryClient
	schemaVersion: number
}) => {
	const collection = createCollection(
		persistedCollectionOptions<
			EntityFieldCollectionItem<_Schema, _EntityType, _FieldDefinition['name']>,
			string | number,
			never,
			EntityFieldCollectionUtils<_Schema, _EntityType, _FieldDefinition['name']>
		>({
			...persistOnDemandSubsets(queryCollectionOptions({
				queryKey: (loadSubsetOptions) => [
					`EntityFieldCollection:${entityType}`,
					fieldDefinition.name,
					...(
						loadSubsetOptions == null || Object.keys(loadSubsetOptions).length === 0 ?
							[]
						:
							[
								{
									filters: parseLoadSubsetForQueryFn(loadSubsetOptions).filters.map((filter) => ({
										field: filter.field.map((part) => String(part)),
										operator: filter.operator,
										value: filter.value,
									})),
									limit: loadSubsetOptions.limit,
									sorts: parseLoadSubsetForQueryFn(loadSubsetOptions).sorts,
								},
							]
					),
				],

				syncMode: 'on-demand',

				autoIndex: 'eager',
				defaultIndexType: BasicIndex,

				persistedGcTime: collectionPersistedGcTime,

				staleTime: collectionStaleTime,

				queryFn: async (queryContext) => {
					const subsetBase = parseLoadSubsetForQueryFn(queryContext.meta?.loadSubsetOptions)

					const { filters } = subsetBase

					const sources = new Set(
						[
							...(
								filters
									.filter((clause) => (
										clause.field[clause.field.length - 1] === EntityMetaKey.Source
										&& (clause.operator === 'in' || clause.operator === 'eq')
									))
									.flatMap((clause) => (
										clause.operator === 'eq' ?
											[clause.value]
										: Array.isArray(clause.value) ?
											clause.value
										:
											[clause.value]
									))
							) as Source[],
						],
					)
					const parentIdKeyFilterValues = new Set(
						filters
							.filter((clause) => (
								String(clause.field[clause.field.length - 1] ?? '') === EntityMetaKey.ParentIdKey
								&& (clause.operator === 'eq' || clause.operator === 'in')
							))
							.flatMap((clause) => (
								clause.operator === 'eq' ?
									[clause.value]
								: Array.isArray(clause.value) ?
									clause.value
								:
									[clause.value]
							))
					)

					const globalRootIdKey = stringify({})

					const parentEntityIds = (
						[...parentIdKeyFilterValues]
							.map((value) => (
								subsetFilterEntityId(value) as EntityId<_Schema, _EntityType>
							))
					)

					const parentsForResolvers = (
						(
							parentEntityIds.length > 0 ?
								parentEntityIds
							: entityType === '_Global' && (
								fieldDefinition.cardinality === EntityFieldCardinality.Many
								|| fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrMany
							) ?
								[{} as EntityId<_Schema, _EntityType>]
							:
								parentEntityIds
						)
							.map((parentEntityId) => (
								entityType === '_Global'
								&& typeof parentEntityId === 'string'
								&& parentEntityId === globalRootIdKey ?
									({} as EntityId<_Schema, _EntityType>)
								:
									parentEntityId
							))
					)

					const loadedRows = (
						(await Promise.all(
							parentsForResolvers
								.map(async (parentEntityId) => {
									const resolvers = (
										sources.size ?
											entityFieldResolvers.filter((fieldResolver) => (
												sources.has(fieldResolver.source)
											))
										:
											entityFieldResolvers
									)

									const settled = await Promise.allSettled(
										resolvers
											.map(async (fieldResolver) => {
												const value = await fieldResolver.resolve(
													parentEntityId,
													{
														filters: subsetBase.filters,
														sorts: subsetBase.sorts,
														limit: subsetBase.limit,
														publicEnv: resolverPublicEnvBySource.get(fieldResolver.source) ?? {},
													},
												)

												const innerValues = (
													fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrMany
													|| fieldDefinition.cardinality === EntityFieldCardinality.Many ?
														Array.isArray(value) ?
															value
														:
															[]
													: value == null ?
														[]
													:
														[value]
												) as EntityFieldCollectionInnerValue<
													_Schema,
													_EntityType,
													_FieldDefinition['name']
												>[]

												return (
													innerValues.map((innerValue) => (
														(row) => (
															assertEntityFieldResolverResult(
																String(entityType),
																fieldDefinition,
																row,
															),
															row
														)
													)({
														[EntityMetaKey.ParentId]: parentEntityId,
														[EntityMetaKey.ParentIdKey]: stringify(parentEntityId),
														[EntityMetaKey.Source]: fieldResolver.source,
														[EntityMetaKey.Value]: entityFieldCollectionValue(innerValue),
													}))
												)
											}),
									)

									return fulfilledOrThrow(
										settled,
										`All ${settled.length} resolver(s) failed for parent ${stringify(parentEntityId)}`,
									)
										.flat()
								}),
						))
							.flat()
					)

					return loadedRows
				},

				getKey: (entityFieldItem) => entityFieldCollectionItemKey(entityFieldItem),

				queryClient,
			})),

			id: `EntityFieldCollection:${entityType}:${fieldDefinition.name}`,

			persistence,
			schemaVersion,
		}),
	)

	collection.createIndex(
		(entityFieldItem) => entityFieldItem[EntityMetaKey.ParentIdKey],
		{ name: `${collection.id}:parentIdKey` },
	)

	collection.createIndex(
		(entityFieldItem) => entityFieldItem[EntityMetaKey.Source],
		{ name: `${collection.id}:source` },
	)

	return collection
}

export const createCollectionsFromSchema = <
	_Schema extends Schema,
>({
	schema,
	entityResolvers,
	entityFieldResolvers,
	persistence,
	schemaVersion = 1,
}: {
	schema: _Schema
	entityResolvers: {
		[_ResolvedEntityType in EntityType<_Schema>]: EntityResolver<_Schema, _ResolvedEntityType>
	}[EntityType<_Schema>][]
	entityFieldResolvers: {
		[_ResolvedEntityType in EntityType<_Schema>]: EntityFieldResolver<
			_Schema,
			_ResolvedEntityType,
			EntityFieldName<_Schema, _ResolvedEntityType>
		>
	}[EntityType<_Schema>][]
	persistence: PersistedCollectionPersistence
	schemaVersion?: number
}) => {
	const queryClient = new QueryClient()

	const entityCollections: Partial<EntityCollections<_Schema>> = {}

	for (const definition of schema) {
		const entityType = definition.entityType
		let cached: EntityCollectionResult<_Schema, typeof entityType> | undefined

		Object.defineProperty(entityCollections, entityType, {
			get: () => (
				cached ??= createEntityCollection({
					entityResolvers: entityResolvers.filter((entityResolver) => (
						entityResolver.entityType === entityType
					)),
					entityType,
					persistence,
					queryClient,
					schemaVersion,
				})
			),
			enumerable: true,
			configurable: true,
		})
	}

	const entityFieldCollections: {
		[_EntityType in EntityType<_Schema>]?: Partial<EntityFieldCollections<_Schema>[_EntityType]>
	} = {}

	for (const definition of schema) {
		const entityType = definition.entityType
		const fieldCollections: Partial<EntityFieldCollections<_Schema>[typeof entityType]> = {}

		for (const field of definition.fields) {
			const fieldName = field.name
			let cached: EntityFieldCollectionResult<_Schema, typeof entityType, typeof field> | undefined

			Object.defineProperty(fieldCollections, fieldName, {
				get: () => (
					cached ??= createEntityFieldCollection({
						entityFieldResolvers: entityFieldResolvers.filter((
							entityFieldResolver,
						): entityFieldResolver is EntityFieldResolver<
							_Schema,
							typeof entityType,
							typeof fieldName
						> => (
							entityFieldResolver.entityType === entityType
							&& entityFieldResolver.fieldName === fieldName
						)),
						entityType,
						fieldDefinition: field,
						persistence,
						queryClient,
						schemaVersion,
					})
				),
				enumerable: true,
				configurable: true,
			})
		}

		entityFieldCollections[entityType as EntityType<_Schema>] = fieldCollections
	}

	return {
		entityCollections: entityCollections as EntityCollections<_Schema>,
		entityFieldCollections: entityFieldCollections as EntityFieldCollections<_Schema>,
		queryClient,
	}
}

export const entityFieldCollectionQueryKeyBase = (entityType: string) => (
	`EntityFieldCollection:${entityType}`
)
