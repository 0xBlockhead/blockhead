import {
	QueryClient,
	type QueryFunctionContext,
	type QueryKey,
} from '@tanstack/query-core'
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
	type Collection,
	type CollectionConfig,
	createCollection,
	type LoadSubsetOptions,
	parseLoadSubsetOptions,
	parseOrderByExpression,
	type SyncConfig,
} from '@tanstack/svelte-db'
import { stringify, parse } from 'devalue'

import { assertResolverValuePartResult } from '$/collections/assertLoadedCollectionRows.ts'

import {
	type EntityDefinition,
	type EntityFieldCondition,
	EntityFieldCardinality,
	type EntityFieldDefinition,
	entityFieldDefinitions,
	entityIdProjectionNameForId,
	entityIdentityIdsFromFields,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
import type {
	EntityFieldDefinition as SchemaEntityFieldDefinition,
	EntityFieldName,
	EntityFieldValue,
	EntityFieldValues,
	EntityId,
	EntityType,
	Schema,
} from '$/schema/$schema.ts'
import type {
	ResolverContext,
	ResolverPart,
	ResolverSort,
	ResolveLiveContext,
	SourceResolverDefinition,
} from '$/resolvers/$resolvers.ts'
import { schema as appSchema } from '$/schema/index.ts'
import { Source } from '$/sources/$Source.ts'
import { resolverPublicEnvBySource } from '$/sources/index.ts'


const resolverSnapshotOrdinalByDefinition = new WeakMap<SourceResolverDefinition, number>()
let resolverSnapshotOrdinal = 0


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

type EntityFieldCountCollectionUtils<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_EntityFieldName extends EntityFieldName<_Schema, _EntityType>,
> = QueryCollectionUtils<
	EntityFieldCountCollectionItem<_Schema, _EntityType, _EntityFieldName>,
	string | number,
	EntityFieldCountCollectionItem<_Schema, _EntityType, _EntityFieldName>,
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

export const entityFieldCountCollectionItemKey = (entityFieldCountItem: {
	[EntityMetaKey.Source]: Source
	[EntityMetaKey.ParentIdKey]: string
	filterKey: string
}) => (
	[
		entityFieldCountItem[EntityMetaKey.Source],
		entityFieldCountItem[EntityMetaKey.ParentIdKey],
		entityFieldCountItem.filterKey,
	]
		.join('\x1E')
)

const entityFieldCollectionValue = <_Value>(
	value: _Value,
): EntityFieldCollectionValue<_Value> => (
	value != null
	&& typeof value === 'object'
	&& hasEntityValueId(value) ?
		({
			[EntityMetaKey.Id]: value[EntityMetaKey.Id],
			[EntityMetaKey.IdKey]: stringify(value[EntityMetaKey.Id]),
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

export type EntityFieldCountCollectionItem<
	_Schema extends Schema,
	_ParentEntityType extends EntityType<_Schema>,
	_EntityFieldName extends EntityFieldName<_Schema, _ParentEntityType>,
> = {
	[EntityMetaKey.ParentId]: EntityId<_Schema, _ParentEntityType>
	[EntityMetaKey.ParentIdKey]: string
	[EntityMetaKey.Value]: number
	[EntityMetaKey.Source]: Source
	filterKey: string
	fieldName: _EntityFieldName
}

type EntityCollectionResult<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = ReturnType<typeof createEntityCollection<_Schema, _EntityType>>

type EntityFieldCollectionResult<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldDefinition extends EntityFieldDefinition,
> = ReturnType<typeof createEntityFieldCollection<_Schema, _EntityType, _FieldDefinition>>

type EntityFieldCountCollectionResult<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldDefinition extends EntityFieldDefinition,
> = ReturnType<typeof createEntityFieldCountCollection<_Schema, _EntityType, _FieldDefinition>>

export type EntityCollections<_Schema extends Schema> = {
	[_EntityType in EntityType<_Schema>]: EntityCollectionResult<_Schema, _EntityType>
}

export type EntityFieldCollections<_Schema extends Schema> = {
	[_EntityType in EntityType<_Schema>]: {
		[_EntityFieldName in EntityFieldName<_Schema, _EntityType>]: EntityFieldCollectionResult<
			_Schema,
			_EntityType,
			SchemaEntityFieldDefinition<_Schema, _EntityType, _EntityFieldName>
		>
	}
}

export type EntityFieldCountCollections<_Schema extends Schema> = {
	[_EntityType in EntityType<_Schema>]: Partial<{
		[_EntityFieldName in EntityFieldName<_Schema, _EntityType>]: EntityFieldCountCollectionResult<
			_Schema,
			_EntityType,
			SchemaEntityFieldDefinition<_Schema, _EntityType, _EntityFieldName>
		>
	}>
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
		const reasons = settled
			.filter((r): r is PromiseRejectedResult => r.status === 'rejected')
			.map((r) => r.reason)
		throw new AggregateError(
			reasons,
			[
				allFailedMessage,
				...reasons.map((reason) => (
					reason instanceof Error ?
						reason.message
					:
						String(reason)
				)),
			].join(': '),
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

const entityDefinitionAcceptsEntityId = (
	entityDefinition: EntityDefinition,
	projectionNames: readonly string[],
	entityId: unknown,
) => projectionNames.includes(entityIdProjectionNameForId(entityDefinition, entityId) ?? '')

const resolverProjectionNameForEntityId = (
	entityDefinition: EntityDefinition,
	resolver: SourceResolverDefinition,
	entityId: unknown,
) => {
	const projectionName = entityIdProjectionNameForId(entityDefinition, entityId)
	return (
		projectionName != null
		&& resolver.resolve[projectionName] != null ?
			projectionName
		:
			undefined
	)
}

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
type SubsetSort = ParsedLoadSubset['sorts'][number]
type CollectionQueryKey = (string | {
	filters: {
		field: string[]
		operator: string
		value: unknown
	}[]
	limit: number | undefined
	sorts: ParsedLoadSubset['sorts']
})[]
type PersistOnDemandSubsetSync<
	_Row extends object,
	_Key extends string | number,
> = SyncConfig<_Row, _Key>
type PersistOnDemandSubsetCollection<
	_Row extends object,
	_Key extends string | number,
> = Parameters<PersistOnDemandSubsetSync<_Row, _Key>['sync']>[0]['collection']
const queryFnCompletenessByCollectionIdAndLoadedKey = new Map<string, Map<string, boolean>>()

const subsetFilterValues = (
	clause: SubsetFilter,
) => (
	clause.operator === 'eq' ?
		[clause.value]
	: Array.isArray(clause.value) ?
		clause.value
	:
		[clause.value]
)

const resolverSortFromSubsetSort = (
	sort: SubsetSort,
): ResolverSort => ({
	fieldPath: sort.field,
	direction: (
		'direction' in sort
		&& sort.direction === 'desc' ?
			'desc'
		:
			'asc'
	),
})

const resolverContextFromSubset = (
	subsetBase: ParsedLoadSubset,
	source: Source,
): ResolverContext => ({
	Filters: subsetBase.filters.map((clause) => ({
		fieldPath: clause.field,
		operator: clause.operator,
		value: clause.value,
	})),
	Sorts: subsetBase.sorts.map(resolverSortFromSubsetSort),
	Pagination: {
		limit: subsetBase.limit,
	},
	IdentityFilter: subsetBase.filters
		.filter((clause) => (
			clause.field[clause.field.length - 1] === EntityMetaKey.IdKey
			&& (clause.operator === 'eq' || clause.operator === 'in')
		))
		.flatMap((clause) => subsetFilterValues(clause).map((value) => String(value))),
	ParentIdentityFilter: subsetBase.filters
		.filter((clause) => (
			clause.field[clause.field.length - 1] === EntityMetaKey.ParentIdKey
			&& (clause.operator === 'eq' || clause.operator === 'in')
		))
		.flatMap((clause) => subsetFilterValues(clause).map((value) => String(value))),
	SourceFilter: subsetBase.filters
		.filter((clause) => (
			clause.field[clause.field.length - 1] === EntityMetaKey.Source
			&& (clause.operator === 'eq' || clause.operator === 'in')
		))
		.flatMap((clause) => subsetFilterValues(clause) as Source[]),
	publicEnv: resolverPublicEnvBySource.get(source) ?? {},
})

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
		'blockhead:loaded-subset:v2',
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

const countSubsetMetadataKey = (loadSubsetOptions: LoadSubsetOptions | undefined) => (
	[
		'blockhead:field-count-subset:v1',
		stringify({
			filters: parseLoadSubsetForQueryFn(loadSubsetOptions).filters.map((filter) => ({
				field: filter.field.map((part) => String(part)),
				operator: filter.operator,
				value: filter.value,
			})),
		}),
	]
		.join(':')
)

const defaultFieldCountFilterKey = countSubsetMetadataKey(undefined)

type ResolveLiveFunction = (
	context: ResolveLiveContext<typeof appSchema, EntityType<typeof appSchema>>
) => void | (() => void) | Promise<void | (() => void)>

type SharedResolveLiveSubscription = {
	dispose: () => void
}

const sharedResolveLiveSubscriptionsByQueryClient = new WeakMap<
	QueryClient,
	Map<string, SharedResolveLiveSubscription>
>()

const entityFieldCollectionForName = <
	_EntityType extends EntityType<typeof appSchema>,
>(
	entityFieldCollections: EntityFieldCollections<typeof appSchema>,
	entityType: _EntityType,
	fieldName: string,
) => (
	(
		entityFieldCollections[entityType] as Partial<Record<
			string,
			Collection<
				EntityFieldCollectionItem<typeof appSchema, _EntityType, EntityFieldName<typeof appSchema, _EntityType>>,
				string | number
			>
		>>
	)[fieldName]
)

const entityFieldCountCollectionForName = <
	_EntityType extends EntityType<typeof appSchema>,
>(
	entityFieldCountCollections: EntityFieldCountCollections<typeof appSchema>,
	entityType: _EntityType,
	fieldName: string,
) => (
	(
		entityFieldCountCollections[entityType] as Partial<Record<
			string,
			Collection<
				EntityFieldCountCollectionItem<typeof appSchema, _EntityType, EntityFieldName<typeof appSchema, _EntityType>>,
				string | number
			>
		>>
	)[fieldName]
)

const deleteEntityFieldRowsForContext = <_EntityType extends EntityType<typeof appSchema>>({
	entityFieldCollections,
	entityType,
	fieldName,
	parentEntityIds,
	sources,
}: {
	entityFieldCollections: EntityFieldCollections<typeof appSchema>
	entityType: _EntityType
	fieldName: string
	parentEntityIds: readonly EntityId<typeof appSchema, _EntityType>[]
	sources?: readonly Source[]
}) => {
	const fieldCollection = entityFieldCollectionForName(
		entityFieldCollections,
		entityType,
		fieldName,
	)
	if (fieldCollection == null) return

	const parentIdKeys = new Set(parentEntityIds.map((id) => stringify(id)))
	const sourceKeys = sources == null ? null : new Set(sources.map(String))
	const keysToDelete = (
		[...fieldCollection.entries()]
			.flatMap(([rowKey, row]) => (
				parentIdKeys.has(String(row[EntityMetaKey.ParentIdKey]))
				&& (sourceKeys == null || sourceKeys.has(String(row[EntityMetaKey.Source]))) ?
					[rowKey]
				:
					[]
			))
	)
	if (keysToDelete.length === 0) return
	fieldCollection.utils.writeBatch(() => {
		for (const key of keysToDelete) {
			fieldCollection.utils.writeDelete(key)
		}
	})
}

const writeEntityFieldUpsertsForContext = <_EntityType extends EntityType<typeof appSchema>>({
	entityFieldCollections,
	entityType,
	fieldName,
	rows,
	defaultParentEntityId,
}: {
	entityFieldCollections: EntityFieldCollections<typeof appSchema>
	entityType: _EntityType
	fieldName: string
	rows: readonly {
		parentEntityId?: EntityId<typeof appSchema, _EntityType>
		parentIdKey?: string
		source: Source
		value: unknown
	}[]
	defaultParentEntityId: EntityId<typeof appSchema, _EntityType>
}) => {
	const fieldCollection = entityFieldCollectionForName(
		entityFieldCollections,
		entityType,
		fieldName,
	)
	if (fieldCollection == null || rows.length === 0) return
	fieldCollection.utils.writeBatch(() => {
		for (const row of rows) {
			const parentEntityId = row.parentEntityId ?? defaultParentEntityId
			fieldCollection.utils.writeUpsert({
				[EntityMetaKey.ParentId]: parentEntityId,
				[EntityMetaKey.ParentIdKey]: row.parentIdKey ?? stringify(parentEntityId),
				[EntityMetaKey.Source]: row.source,
				[EntityMetaKey.Value]: entityFieldCollectionValue(row.value),
			})
		}
	})
}

const deleteEntityFieldCountRowsForContext = <_EntityType extends EntityType<typeof appSchema>>({
	entityFieldCountCollections,
	entityType,
	fieldName,
	parentEntityIds,
	sources,
	filterKey = defaultFieldCountFilterKey,
}: {
	entityFieldCountCollections: EntityFieldCountCollections<typeof appSchema>
	entityType: _EntityType
	fieldName: string
	parentEntityIds: readonly EntityId<typeof appSchema, _EntityType>[]
	sources?: readonly Source[]
	filterKey?: string
}) => {
	const countCollection = entityFieldCountCollectionForName(
		entityFieldCountCollections,
		entityType,
		fieldName,
	)
	if (countCollection == null) return

	const parentIdKeys = new Set(parentEntityIds.map((id) => stringify(id)))
	const sourceKeys = sources == null ? null : new Set(sources.map(String))
	const keysToDelete = (
		[...countCollection.entries()]
			.flatMap(([rowKey, row]) => (
				parentIdKeys.has(String(row[EntityMetaKey.ParentIdKey]))
				&& row.filterKey === filterKey
				&& (sourceKeys == null || sourceKeys.has(String(row[EntityMetaKey.Source]))) ?
					[rowKey]
				:
					[]
			))
	)
	if (keysToDelete.length === 0) return
	countCollection.utils.writeBatch(() => {
		for (const key of keysToDelete) {
			countCollection.utils.writeDelete(key)
		}
	})
}

const writeEntityFieldCountUpsertsForContext = <_EntityType extends EntityType<typeof appSchema>>({
	entityFieldCountCollections,
	entityType,
	fieldName,
	rows,
	defaultParentEntityId,
}: {
	entityFieldCountCollections: EntityFieldCountCollections<typeof appSchema>
	entityType: _EntityType
	fieldName: string
	rows: readonly {
		parentEntityId?: EntityId<typeof appSchema, _EntityType>
		parentIdKey?: string
		source: Source
		value: number
		filterKey?: string
	}[]
	defaultParentEntityId: EntityId<typeof appSchema, _EntityType>
}) => {
	const countCollection = entityFieldCountCollectionForName(
		entityFieldCountCollections,
		entityType,
		fieldName,
	)
	if (countCollection == null || rows.length === 0) return
	countCollection.utils.writeBatch(() => {
		for (const row of rows) {
			const parentEntityId = row.parentEntityId ?? defaultParentEntityId
			const countRow = {
				[EntityMetaKey.ParentId]: parentEntityId,
				[EntityMetaKey.ParentIdKey]: row.parentIdKey ?? stringify(parentEntityId),
				[EntityMetaKey.Source]: row.source,
				[EntityMetaKey.Value]: row.value,
				filterKey: row.filterKey ?? defaultFieldCountFilterKey,
				fieldName,
			}
			countCollection.utils.writeUpsert(countRow, entityFieldCountCollectionItemKey(countRow))
		}
	})
}

const createSharedResolveLiveSubscription = ({
	entityFieldCollections,
	entityFieldCountCollections,
	entityType,
	parentEntityId,
	queryClient,
	resolveLive,
	scopeKey,
	source,
}: {
	entityFieldCollections: EntityFieldCollections<typeof appSchema>
	entityFieldCountCollections: EntityFieldCountCollections<typeof appSchema>
	entityType: EntityType<typeof appSchema>
	parentEntityId: EntityId<typeof appSchema, EntityType<typeof appSchema>>
	queryClient: QueryClient
	resolveLive: ResolveLiveFunction
	scopeKey: string
	source: Source
}) => {
	const sharedSubscriptionsByKey = (
		sharedResolveLiveSubscriptionsByQueryClient.get(queryClient)
		?? new Map<string, SharedResolveLiveSubscription>()
	)
	sharedResolveLiveSubscriptionsByQueryClient.set(queryClient, sharedSubscriptionsByKey)

	if (sharedSubscriptionsByKey.has(scopeKey)) return

	const ac = new AbortController()
	const cleanups = new Set<() => void>()
	let disposed = false
	const runCleanup = (cleanup: (() => void) | undefined) => {
		if (cleanup == null) return
		try {
			cleanup()
		} catch (error) {
			console.error('resolveLive cleanup failed', {
				entityType,
				parentEntityId,
				scopeKey,
				source,
			}, error)
		}
	}
	const dispose = () => {
		if (disposed) return
		disposed = true
		ac.abort()
		for (const cleanup of cleanups) {
			runCleanup(cleanup)
		}
		cleanups.clear()
		sharedSubscriptionsByKey.delete(scopeKey)
	}

	sharedSubscriptionsByKey.set(scopeKey, { dispose })

	void Promise.resolve(
		resolveLive({
			invalidateFields: (fieldNames) => {
				void Promise.all(fieldNames.map((fieldName) => (
					queryClient.invalidateQueries({
						queryKey: [entityFieldCollectionQueryKeyBase(String(entityType)), fieldName],
						refetchType: 'all',
					})
				)))
			},
			invalidateCounts: (fieldNames) => {
				void Promise.all(fieldNames.map((fieldName) => (
					queryClient.invalidateQueries({
						queryKey: [`EntityFieldCountCollection:${String(entityType)}:${fieldName}`],
						refetchType: 'all',
					})
				)))
			},
			writeFieldRows: (fieldName, rows) => {
				deleteEntityFieldRowsForContext({
					entityFieldCollections,
					entityType,
					fieldName,
					parentEntityIds: [parentEntityId],
					sources: rows.map((row) => row.source),
				})
				writeEntityFieldUpsertsForContext({
					entityFieldCollections,
					entityType,
					fieldName,
					rows,
					defaultParentEntityId: parentEntityId,
				})
			},
			writeFieldCounts: (fieldName, rows) => {
				deleteEntityFieldCountRowsForContext({
					entityFieldCountCollections,
					entityType,
					fieldName,
					parentEntityIds: [parentEntityId],
					sources: rows.map((row) => row.source),
				})
				writeEntityFieldCountUpsertsForContext({
					entityFieldCountCollections,
					entityType,
					fieldName,
					rows,
					defaultParentEntityId: parentEntityId,
				})
			},
			parentEntityId,
			queryClient,
			signal: ac.signal,
		}),
	)
		.then((cleanup) => {
			if (typeof cleanup !== 'function') return
			if (disposed) {
				runCleanup(cleanup)
				return
			}
			cleanups.add(cleanup)
		})
		.catch((error) => {
			if (ac.signal.aborted) return
			dispose()
			console.error('resolveLive failed', {
				entityType,
				parentEntityId,
				scopeKey,
				source,
			}, error)
		})
}

type BlockheadPersistenceProbeDecision = (
	| 'hydrated-rows'
	| 'loaded-marker'
	| 'snapshot'
	| 'remote'
)

type BlockheadPersistenceProbeEvent = (
	| {
		kind: 'loadSubset'
		collectionId: string
		decision: BlockheadPersistenceProbeDecision
		loadedKey: string
		at: number
	}
	| {
		kind: 'queryFn'
		collectionId: string
		loadedKey: string
		at: number
	}
	| {
		kind: 'markLoaded'
		collectionId: string
		loadedKey: string
		at: number
	}
)

const PERSISTENCE_PROBE_STORAGE_KEY = '__blockheadPersistenceProbe'
const PERSISTENCE_PROBE_MAX_EVENTS = 256

const trimPersistenceProbeEvents = (
	events: BlockheadPersistenceProbeEvent[],
): BlockheadPersistenceProbeEvent[] => (
	events.length > PERSISTENCE_PROBE_MAX_EVENTS ?
		events.slice(-PERSISTENCE_PROBE_MAX_EVENTS)
	:
		events
)

const readPersistenceProbeFromStorage = (): BlockheadPersistenceProbeEvent[] => {
	if (typeof sessionStorage === 'undefined') return []
	const stored = sessionStorage.getItem(PERSISTENCE_PROBE_STORAGE_KEY)
	if (stored == null || stored === '') return []
	try {
		return trimPersistenceProbeEvents(
			JSON.parse(stored) as BlockheadPersistenceProbeEvent[],
		)
	} catch {
		return []
	}
}

const writePersistenceProbeToStorage = (
	events: BlockheadPersistenceProbeEvent[],
) => {
	if (typeof sessionStorage === 'undefined') return
	const trimmed = trimPersistenceProbeEvents(events)
	try {
		sessionStorage.setItem(PERSISTENCE_PROBE_STORAGE_KEY, JSON.stringify(trimmed))
	} catch {
		try {
			sessionStorage.removeItem(PERSISTENCE_PROBE_STORAGE_KEY)
			sessionStorage.setItem(
				PERSISTENCE_PROBE_STORAGE_KEY,
				JSON.stringify(trimmed.slice(-32)),
			)
		} catch {
			// Quota full — keep in-memory probe only; must not break loadSubset.
		}
	}
}

const pushPersistenceProbeEvent = (
	event: BlockheadPersistenceProbeEvent,
) => {
	if (typeof window === 'undefined') return
	const windowWithProbe = window as typeof window & {
		__blockheadPersistenceProbe?: BlockheadPersistenceProbeEvent[]
	}
	const probe = trimPersistenceProbeEvents([
		...(
			windowWithProbe.__blockheadPersistenceProbe
			?? readPersistenceProbeFromStorage()
		),
		event,
	])
	windowWithProbe.__blockheadPersistenceProbe = probe
	writePersistenceProbeToStorage(probe)
}

const recordPersistenceLoadSubsetDecision = (
	collectionId: string,
	decision: BlockheadPersistenceProbeDecision,
	loadedKey: string,
) => {
	pushPersistenceProbeEvent({
		kind: 'loadSubset',
		collectionId,
		decision,
		loadedKey,
		at: Date.now(),
	})
}

const wrapQueryFnWithPersistenceProbe = <
	_QueryKey extends QueryKey,
	_Result,
>(
	collectionId: string,
	queryFn: (queryContext: QueryFunctionContext<_QueryKey>) => Promise<_Result>,
) => async (queryContext: QueryFunctionContext<_QueryKey>) => {
	const loadSubsetOptions = queryContext.meta?.loadSubsetOptions
	if (loadSubsetOptions != null)
		pushPersistenceProbeEvent({
			kind: 'queryFn',
			collectionId,
			loadedKey: loadedSubsetMetadataKey(loadSubsetOptions),
			at: Date.now(),
		})

	return queryFn(queryContext)
}

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

const persistOnDemandSubsets = <
	_Row extends object,
	_Key extends string | number,
	_Options extends { sync: PersistOnDemandSubsetSync<_Row, _Key> },
>(
	options: _Options,
	probeCollectionId: string,
) => {
	const outerSync = options.sync

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

						if (collectionHasHydratedSubset(params.collection, loadSubsetOptions)) {
							recordPersistenceLoadSubsetDecision(
								probeCollectionId,
								'hydrated-rows',
								loadedKey,
							)
							return true
						}
						if (
							params.metadata?.collection.get(loadedKey) === true
						) {
							recordPersistenceLoadSubsetDecision(
								probeCollectionId,
								'loaded-marker',
								loadedKey,
							)
							return true
						}

						const markLoaded = () => {
							if (params.metadata == null)
								return
							if (
								queryFnCompletenessByCollectionIdAndLoadedKey
									.get(probeCollectionId)
									?.get(loadedKey) === false
							)
								return
							const subsetComplete = (
								!subsetListsMultipleSources
								|| collectionHasHydratedSubset(params.collection, loadSubsetOptions)
								|| queryFnCompletenessByCollectionIdAndLoadedKey
									.get(probeCollectionId)
									?.get(loadedKey) === true
							)
							if (!subsetComplete)
								return
							params.begin()
							params.metadata.collection.set(loadedKey, true)
							params.commit()
							pushPersistenceProbeEvent({
								kind: 'markLoaded',
								collectionId: probeCollectionId,
								loadedKey,
								at: Date.now(),
							})
						}
						const loadRemoteAndMarkLoaded = () => {
							recordPersistenceLoadSubsetDecision(
								probeCollectionId,
								'remote',
								loadedKey,
							)
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
						if (hasSnapshotChanges && everyListedSourceHydrated) {
							recordPersistenceLoadSubsetDecision(
								probeCollectionId,
								'snapshot',
								loadedKey,
							)
							return true
						}

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
	resolverDefinitions,
	resolverPartsByResolver,
	entityType,
	entityDefinition,
	persistence,
	queryClient,
	schemaVersion,
}: {
	resolverDefinitions: SourceResolverDefinition[]
	resolverPartsByResolver: Map<SourceResolverDefinition, ResolverPart[]>
	entityType: _EntityType
	entityDefinition: EntityDefinition
	persistence: PersistedCollectionPersistence
	queryClient: QueryClient
	schemaVersion: number
}) => {
	const entityCollectionId = `EntityCollection:${entityType}`
	const collection = createCollection(
		persistedCollectionOptions<
			EntityCollectionItem<_Schema, _EntityType>,
			string | number,
			never,
			EntityCollectionUtils<_Schema, _EntityType>
		>({
			...persistOnDemandSubsets<
				EntityCollectionItem<_Schema, _EntityType>,
				string | number,
				CollectionConfig<
					EntityCollectionItem<_Schema, _EntityType>,
					string | number,
					never,
					EntityCollectionUtils<_Schema, _EntityType>
				>
			>(queryCollectionOptions<
				EntityCollectionItem<_Schema, _EntityType>,
				unknown,
				CollectionQueryKey,
				string | number
			>({
				queryKey: (loadSubsetOptions) => [
					`EntityCollection:${entityType}`,
					...(
						Object.keys(loadSubsetOptions).length === 0 ?
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

				queryFn: wrapQueryFnWithPersistenceProbe(
					entityCollectionId,
					async (queryContext) => {
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

						const resolvedEntityRows = await Promise.all(
							entityIds.map(async (entityId) => {
								const resolvers = (
									sources.size ?
										resolverDefinitions
											.filter((resolver) => (
												sources.has(resolver.source)
												&& resolverProjectionNameForEntityId(
													entityDefinition,
													resolver,
													entityId,
												) != null
											))
									:
										resolverDefinitions.filter((resolver) => (
											resolverProjectionNameForEntityId(
												entityDefinition,
												resolver,
												entityId,
											) != null
										))
								)

								const settled = await Promise.allSettled(
									resolvers
										.map(async (resolver) => {
											const projectionName = resolverProjectionNameForEntityId(
												entityDefinition,
												resolver,
												entityId,
											)!
											const context = resolverContextFromSubset(
												subsetBase,
												resolver.source,
											)
											const snapshot = await resolveSnapshot(
												resolver,
												projectionName,
												entityId as EntityId<typeof appSchema, EntityType<typeof appSchema>>,
												context,
												queryClient,
											)
											const fields = Object.fromEntries(
												(resolverPartsByResolver.get(resolver) ?? []).flatMap((resolverPart) => (
													resolverPart.select == null ?
														[]
													:
														[[
															resolverPart.fieldName,
															resolverPart.select(
																snapshot,
																entityId as EntityId<typeof appSchema, EntityType<typeof appSchema>>,
																context,
															),
														]]
												)),
											)

											const rowIdKeys = new Set<string>()
											return entityIdentityIdsFromFields(
												entityDefinition,
												entityId,
												fields,
											)
												.flatMap((resolvedEntityId) => {
													const rowIdKey = stringify(resolvedEntityId)
													if (rowIdKeys.has(rowIdKey))
														return []

													rowIdKeys.add(rowIdKey)
													return [{
														...fields,
														[EntityMetaKey.Id]: resolvedEntityId,
														[EntityMetaKey.IdKey]: rowIdKey,
														[EntityMetaKey.Source]: resolver.source,
														[EntityMetaKey.Fields]: fields,
													}]
												})
										}),
								)

								return {
									complete: (
										resolvers.length > 0
										&& settled.every((result) => result.status === 'fulfilled')
									),
									rows: fulfilledOrThrow(
										settled,
										`All ${settled.length} resolver(s) failed for ${stringify(entityId)}`,
									)
										.flat(),
								}
							}),
						)

						if (queryContext.meta?.loadSubsetOptions != null) {
							const loadedKey = loadedSubsetMetadataKey(queryContext.meta.loadSubsetOptions)
							queryFnCompletenessByCollectionIdAndLoadedKey.set(
								entityCollectionId,
								new Map([
									...(queryFnCompletenessByCollectionIdAndLoadedKey.get(entityCollectionId) ?? []),
									[
										loadedKey,
										entityIds.length > 0
										&& resolvedEntityRows.every((result) => result.complete),
									],
								]),
							)
						}

						return resolvedEntityRows.flatMap((result) => result.rows) as EntityCollectionItem<_Schema, _EntityType>[]
					},
				),

				getKey: (entityItem) => (
					[
						entityItem[EntityMetaKey.Source],
						entityItem[EntityMetaKey.IdKey],
					]
						.join('\x1E')
				),

				queryClient,
			}), entityCollectionId),

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
	_FieldDefinition extends EntityFieldDefinition,
>({
	allResolverValueParts,
	entityFieldCollections,
	entityFieldCountCollections,
	resolverDefinitions,
	resolverLiveParts,
	resolverRootLiveDefinitions,
	resolverValueParts,
	entityType,
	fieldDefinition,
	persistence,
	queryClient,
	schema,
	schemaVersion,
}: {
	allResolverValueParts: ResolverPart[]
	entityFieldCollections: () => EntityFieldCollections<typeof appSchema>
	entityFieldCountCollections: () => EntityFieldCountCollections<typeof appSchema>
	resolverDefinitions: SourceResolverDefinition[]
	resolverLiveParts: ResolverPart[]
	resolverRootLiveDefinitions: SourceResolverDefinition[]
	resolverValueParts: ResolverPart[]
	entityType: _EntityType
	fieldDefinition: _FieldDefinition
	persistence: PersistedCollectionPersistence
	queryClient: QueryClient
	schema: _Schema
	schemaVersion: number
}) => {
	const entityFieldCollectionId = `EntityFieldCollection:${entityType}:${fieldDefinition.name}`
	const entityDefinition = schema.find((definition) => definition.entityType === entityType)
	if (entityDefinition === undefined)
		throw new Error(`${String(entityType)} is not registered in schema`)

	const fieldDefinitionByName = Object.fromEntries(
		schema.map((entityDefinition) => [
			entityDefinition.entityType,
			Object.fromEntries(
				entityFieldDefinitions(entityDefinition).map((field) => [
					field.name,
					field,
				]),
			),
		]),
	)
	const discriminatorValueFromFieldValue = (
		condition: EntityFieldCondition<EntityFieldName<_Schema, _EntityType>>,
		value: unknown,
	): string | number | undefined => {
		const discriminatorValue = (
			condition.itemIndex == null ?
				value
			: Array.isArray(value) ?
				value[condition.itemIndex]
			:
				undefined
		)
		return (
			typeof discriminatorValue === 'string'
			|| typeof discriminatorValue === 'number' ?
				discriminatorValue
			:
				undefined
		)
	}
	const resolveDiscriminatorValue = async (
		parentEntityId: EntityId<_Schema, _EntityType>,
		condition: EntityFieldCondition<EntityFieldName<_Schema, _EntityType>>,
		subsetBase: ReturnType<typeof parseLoadSubsetForQueryFn>,
	): Promise<string | number> => {
		const { fieldName } = condition
		const discriminatorField = fieldDefinitionByName[entityType][fieldName]
		if ('when' in discriminatorField && discriminatorField.when != null) {
			throw new Error(`${String(entityType)}.${fieldDefinition.name}: discriminator field ${fieldName} cannot be conditional`)
		}
		if (
			parentEntityId != null
			&& typeof parentEntityId === 'object'
			&& fieldName in parentEntityId
		) {
			const discriminatorValue = discriminatorValueFromFieldValue(
				condition,
				parentEntityId[fieldName as keyof typeof parentEntityId],
			)
			if (discriminatorValue != null) {
				return discriminatorValue
			}
		}

		const entitySettled = await Promise.allSettled(
			resolverDefinitions.map(async (resolver) => {
				const projectionName = resolverProjectionNameForEntityId(
					entityDefinition,
					resolver,
					parentEntityId,
				)
				if (projectionName == null)
					return undefined

				const context = resolverContextFromSubset(
					subsetBase,
					resolver.source,
				)
				const snapshot = await resolveSnapshot(
					resolver,
					projectionName,
					parentEntityId as EntityId<typeof appSchema, EntityType<typeof appSchema>>,
					context,
					queryClient,
				)
				const valuePart = allResolverValueParts.find((resolverPart) => (
					resolverPart.resolver === resolver
					&& resolverPart.fieldName === fieldName
					&& resolverPart.select != null
				))
				return valuePart?.select == null ?
					undefined
				:
					discriminatorValueFromFieldValue(
						condition,
						valuePart.select(
							snapshot,
							parentEntityId as EntityId<typeof appSchema, EntityType<typeof appSchema>>,
							context,
						),
					)
			}),
		)
		for (const result of entitySettled) {
			if (
				result.status === 'fulfilled'
				&& result.value != null
			) {
				return result.value
			}
		}

		const fieldSettled = await Promise.allSettled(
			allResolverValueParts
				.filter((resolverPart) => (
					resolverPart.entityType === entityType
					&& resolverPart.fieldName === fieldName
					&& resolverPart.select != null
					&& resolverProjectionNameForEntityId(
						entityDefinition,
						resolverPart.resolver,
						parentEntityId,
					) != null
				))
				.map(async (resolverPart) => {
					const context = resolverContextFromSubset(
						subsetBase,
						resolverPart.source,
					)
					const snapshot = await resolveSnapshot(
						resolverPart.resolver,
						resolverProjectionNameForEntityId(
							entityDefinition,
							resolverPart.resolver,
							parentEntityId,
						)!,
						parentEntityId as EntityId<typeof appSchema, EntityType<typeof appSchema>>,
						context,
						queryClient,
					)
					return resolverPart.select!(
						snapshot,
						parentEntityId as EntityId<typeof appSchema, EntityType<typeof appSchema>>,
						context,
					)
				}),
		)
		for (const result of fieldSettled) {
			const discriminatorValue = (
				result.status === 'fulfilled' ?
					discriminatorValueFromFieldValue(condition, result.value)
				:
					undefined
			)
			if (
				discriminatorValue != null
			) {
				return discriminatorValue
			}
		}

		throw new Error(`${String(entityType)}.${fieldDefinition.name}: discriminator field ${fieldName} could not be resolved`)
	}
	const collection = createCollection(
		persistedCollectionOptions<
			EntityFieldCollectionItem<_Schema, _EntityType, _FieldDefinition['name']>,
			string | number,
			never,
			EntityFieldCollectionUtils<_Schema, _EntityType, _FieldDefinition['name']>
		>({
			...persistOnDemandSubsets<
				EntityFieldCollectionItem<_Schema, _EntityType, _FieldDefinition['name']>,
				string | number,
				CollectionConfig<
					EntityFieldCollectionItem<_Schema, _EntityType, _FieldDefinition['name']>,
					string | number,
					never,
					EntityFieldCollectionUtils<_Schema, _EntityType, _FieldDefinition['name']>
				>
			>(queryCollectionOptions<
				EntityFieldCollectionItem<_Schema, _EntityType, _FieldDefinition['name']>,
				unknown,
				CollectionQueryKey,
				string | number
			>({
				queryKey: (loadSubsetOptions) => [
					`EntityFieldCollection:${entityType}`,
					fieldDefinition.name,
					...(
						Object.keys(loadSubsetOptions).length === 0 ?
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

				queryFn: wrapQueryFnWithPersistenceProbe(
					entityFieldCollectionId,
					async (queryContext) => {
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
								:
									entityType === '_Global' && (
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

						for (const parentEntityId of parentsForResolvers) {
							for (const resolver of resolverRootLiveDefinitions.filter((resolverDefinition) => (
								resolverDefinition.entityType === entityType
								&& resolverDefinition.resolveLive?.fields.includes(fieldDefinition.name as EntityFieldName<typeof appSchema, EntityType<typeof appSchema>>)
								&& (sources.size === 0 || sources.has(resolverDefinition.source))
							))) {
								createSharedResolveLiveSubscription({
									entityFieldCollections: entityFieldCollections(),
									entityFieldCountCollections: entityFieldCountCollections(),
									entityType: entityType as EntityType<typeof appSchema>,
									parentEntityId: parentEntityId as EntityId<typeof appSchema, EntityType<typeof appSchema>>,
									queryClient,
									resolveLive: resolver.resolveLive!.run,
									scopeKey: [
										'root',
										String(resolver.definitionIndex),
										String(entityType),
										resolver.source,
										stringify(parentEntityId),
									].join('\x1E'),
									source: resolver.source,
								})
							}

							for (const resolverPart of resolverLiveParts.filter((part) => (
								part.entityType === entityType
								&& part.fieldName === fieldDefinition.name
								&& part.resolveLive != null
								&& (sources.size === 0 || sources.has(part.source))
							))) {
								createSharedResolveLiveSubscription({
									entityFieldCollections: entityFieldCollections(),
									entityFieldCountCollections: entityFieldCountCollections(),
									entityType: entityType as EntityType<typeof appSchema>,
									parentEntityId: parentEntityId as EntityId<typeof appSchema, EntityType<typeof appSchema>>,
									queryClient,
									resolveLive: resolverPart.resolveLive!,
									scopeKey: [
										'field',
										String(resolverPart.resolver.definitionIndex),
										String(resolverPart.partIndex),
										String(entityType),
										String(fieldDefinition.name),
										resolverPart.source,
										stringify(parentEntityId),
									].join('\x1E'),
									source: resolverPart.source,
								})
							}
						}

						const settledParentFieldRows = await Promise.allSettled(
							parentsForResolvers
								.map(async (parentEntityId) => {
									if ('when' in fieldDefinition && fieldDefinition.when != null) {
										const discriminatorValue = await resolveDiscriminatorValue(
											parentEntityId,
											fieldDefinition.when,
											subsetBase,
										)
										if (!fieldDefinition.when.values.includes(discriminatorValue)) {
											return {
												complete: true,
												rows: [],
											}
										}
									}

									const resolvers = (
										sources.size ?
											resolverValueParts.filter((resolverPart) => (
												sources.has(resolverPart.source)
												&& entityDefinitionAcceptsEntityId(
													entityDefinition,
													resolverPart.parentSelectors ?? Object.keys(resolverPart.resolver.resolve),
													parentEntityId,
												)
											))
										:
											resolverValueParts.filter((resolverPart) => (
												entityDefinitionAcceptsEntityId(
													entityDefinition,
													resolverPart.parentSelectors ?? Object.keys(resolverPart.resolver.resolve),
													parentEntityId,
												)
											))
									)

									const settled = await Promise.allSettled(
										resolvers
											.map(async (resolverPart) => {
												const context = resolverContextFromSubset(
													subsetBase,
													resolverPart.source,
												)
												const value = resolverPart.select!(
													await resolveSnapshot(
														resolverPart.resolver,
														resolverProjectionNameForEntityId(
															entityDefinition,
															resolverPart.resolver,
															parentEntityId,
														)!,
														parentEntityId as EntityId<typeof appSchema, EntityType<typeof appSchema>>,
														context,
														queryClient,
													),
													parentEntityId as EntityId<typeof appSchema, EntityType<typeof appSchema>>,
													context,
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
															assertResolverValuePartResult(
																String(entityType),
																fieldDefinition,
																row,
															),
															row
														)
													)({
													[EntityMetaKey.ParentId]: parentEntityId,
													[EntityMetaKey.ParentIdKey]: stringify(parentEntityId),
													[EntityMetaKey.Source]: resolverPart.source,
													[EntityMetaKey.Value]: entityFieldCollectionValue(innerValue),
												}))
											)
											}),
									)

									return {
										complete: (
											resolvers.length > 0
											&& settled.every((result) => result.status === 'fulfilled')
										),
										rows: fulfilledOrThrow(
											settled,
											`All ${settled.length} resolver(s) failed for parent ${stringify(parentEntityId)}`,
										)
											.flat(),
									}
								}),
						)
						const resolvedFieldRows = fulfilledOrThrow(
							settledParentFieldRows,
							`All ${settledParentFieldRows.length} parent id shape(s) failed for ${String(entityType)}.${fieldDefinition.name}`,
						)

						if (queryContext.meta?.loadSubsetOptions != null) {
							const loadedKey = loadedSubsetMetadataKey(queryContext.meta.loadSubsetOptions)
							queryFnCompletenessByCollectionIdAndLoadedKey.set(
								entityFieldCollectionId,
								new Map([
									...(queryFnCompletenessByCollectionIdAndLoadedKey.get(entityFieldCollectionId) ?? []),
									[
										loadedKey,
										parentsForResolvers.length > 0
										&& settledParentFieldRows.every((result) => (
											result.status === 'fulfilled'
											&& result.value.complete
										)),
									],
								]),
							)
						}

						return resolvedFieldRows.flatMap((result) => result.rows)
					},
				),

				getKey: (entityFieldItem) => entityFieldCollectionItemKey(entityFieldItem),

				queryClient,
			}), entityFieldCollectionId),

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

const entityFieldCardinalityIsMultiple = (
	cardinality: EntityFieldCardinality,
) => (
	cardinality === EntityFieldCardinality.Many
	|| cardinality === EntityFieldCardinality.ZeroOrMany
)

const createEntityFieldCountCollection = <
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldDefinition extends EntityFieldDefinition,
>({
	resolverCountParts,
	entityType,
	fieldDefinition,
	persistence,
	queryClient,
	schema,
	schemaVersion,
}: {
	resolverCountParts: ResolverPart[]
	entityType: _EntityType
	fieldDefinition: _FieldDefinition
	persistence: PersistedCollectionPersistence
	queryClient: QueryClient
	schema: _Schema
	schemaVersion: number
}) => {
	const entityFieldCountCollectionId = `EntityFieldCountCollection:${entityType}:${fieldDefinition.name}`
	const entityDefinition = schema.find((definition) => definition.entityType === entityType)
	if (entityDefinition === undefined)
		throw new Error(`${String(entityType)} is not registered in schema`)

	const collection = createCollection(
		persistedCollectionOptions<
			EntityFieldCountCollectionItem<_Schema, _EntityType, _FieldDefinition['name']>,
			string | number,
			never,
			EntityFieldCountCollectionUtils<_Schema, _EntityType, _FieldDefinition['name']>
		>({
			...persistOnDemandSubsets<
				EntityFieldCountCollectionItem<_Schema, _EntityType, _FieldDefinition['name']>,
				string | number,
				CollectionConfig<
					EntityFieldCountCollectionItem<_Schema, _EntityType, _FieldDefinition['name']>,
					string | number,
					never,
					EntityFieldCountCollectionUtils<_Schema, _EntityType, _FieldDefinition['name']>
				>
			>(queryCollectionOptions<
				EntityFieldCountCollectionItem<_Schema, _EntityType, _FieldDefinition['name']>,
				unknown,
				CollectionQueryKey,
				string | number
			>({
				queryKey: (loadSubsetOptions) => [
					entityFieldCountCollectionId,
					...(
						Object.keys(loadSubsetOptions).length === 0 ?
							[]
						:
							[
								{
									filters: parseLoadSubsetForQueryFn(loadSubsetOptions).filters.map((filter) => ({
										field: filter.field.map((part) => String(part)),
										operator: filter.operator,
										value: filter.value,
									})),
									limit: undefined,
									sorts: [],
								},
							]
					),
				],

				syncMode: 'on-demand',

				autoIndex: 'eager',
				defaultIndexType: BasicIndex,

				persistedGcTime: collectionPersistedGcTime,

				staleTime: collectionStaleTime,

				queryFn: wrapQueryFnWithPersistenceProbe(
					entityFieldCountCollectionId,
					async (queryContext) => {
						if (!entityFieldCardinalityIsMultiple(fieldDefinition.cardinality))
							return []

						const subsetBase = parseLoadSubsetForQueryFn(queryContext.meta?.loadSubsetOptions)
						const { filters } = subsetBase
						const filterKey = countSubsetMetadataKey(queryContext.meta?.loadSubsetOptions)

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
								: entityType === '_Global' ?
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

						const resolvedCountRows = (
							await Promise.all(
								parentsForResolvers.map(async (parentEntityId) => {
									const resolvers = (
										sources.size ?
											resolverCountParts.filter((resolverPart) => (
												sources.has(resolverPart.source)
												&& entityDefinitionAcceptsEntityId(
													entityDefinition,
													resolverPart.parentSelectors ?? Object.keys(resolverPart.resolver.resolve),
													parentEntityId,
												)
											))
										:
											resolverCountParts.filter((resolverPart) => (
												entityDefinitionAcceptsEntityId(
													entityDefinition,
													resolverPart.parentSelectors ?? Object.keys(resolverPart.resolver.resolve),
													parentEntityId,
												)
											))
									)
									const settled = await Promise.allSettled(
										resolvers.map(async (resolverPart) => {
											const context = resolverContextFromSubset(
												{
													...subsetBase,
													sorts: [],
												},
												resolverPart.source,
											)
											const count = resolverPart.resolveCount!(
												await resolveSnapshot(
													resolverPart.resolver,
													resolverProjectionNameForEntityId(
														entityDefinition,
														resolverPart.resolver,
														parentEntityId,
													)!,
													parentEntityId as EntityId<typeof appSchema, EntityType<typeof appSchema>>,
													context,
													queryClient,
												),
												parentEntityId as EntityId<typeof appSchema, EntityType<typeof appSchema>>,
												context,
											)
											if (!Number.isInteger(count) || count < 0)
												throw new Error(`${String(entityType)}.${fieldDefinition.name}: count resolver returned ${count.toString()}`)

											return {
												[EntityMetaKey.ParentId]: parentEntityId,
												[EntityMetaKey.ParentIdKey]: stringify(parentEntityId),
												[EntityMetaKey.Source]: resolverPart.source,
												[EntityMetaKey.Value]: count,
												filterKey,
												fieldName: fieldDefinition.name,
											}
										}),
									)

									return fulfilledOrThrow(
										settled,
										`All ${settled.length} count resolver(s) failed for parent ${stringify(parentEntityId)}`,
									)
								}),
							)
						)
						return resolvedCountRows.flat() as EntityFieldCountCollectionItem<
							_Schema,
							_EntityType,
							_FieldDefinition['name']
						>[]
					},
				),

				getKey: (entityFieldCountItem) => entityFieldCountCollectionItemKey(entityFieldCountItem),

				queryClient,
			}), entityFieldCountCollectionId),

			id: entityFieldCountCollectionId,

			persistence,
			schemaVersion,
		}),
	)

	collection.createIndex(
		(entityFieldCountItem) => entityFieldCountItem[EntityMetaKey.ParentIdKey],
		{ name: `${collection.id}:parentIdKey` },
	)

	collection.createIndex(
		(entityFieldCountItem) => entityFieldCountItem[EntityMetaKey.Source],
		{ name: `${collection.id}:source` },
	)

	collection.createIndex(
		(entityFieldCountItem) => entityFieldCountItem.filterKey,
		{ name: `${collection.id}:filterKey` },
	)

	return collection
}

const resolverSnapshotQueryKey = (
	resolver: SourceResolverDefinition,
	projectionName: string,
	entityId: unknown,
	context: ResolverContext,
) => [
	'ResolverSnapshot',
	(() => {
		let ordinal = resolverSnapshotOrdinalByDefinition.get(resolver)
		if (ordinal === undefined) {
			ordinal = resolverSnapshotOrdinal++
			resolverSnapshotOrdinalByDefinition.set(resolver, ordinal)
		}

		return ordinal
	})(),
	projectionName,
	stringify(entityId),
	stringify({
		Filters: context.Filters,
		Sorts: context.Sorts,
		Pagination: context.Pagination,
		IdentityFilter: context.IdentityFilter,
		ParentIdentityFilter: context.ParentIdentityFilter,
		SourceFilter: context.SourceFilter,
	}),
]

const resolveSnapshot = (
	resolver: SourceResolverDefinition,
	projectionName: string,
	entityId: EntityId<typeof appSchema, EntityType<typeof appSchema>>,
	context: ResolverContext,
	queryClient: QueryClient,
) => queryClient.fetchQuery({
	queryKey: resolverSnapshotQueryKey(
		resolver,
		projectionName,
		entityId,
		context,
	),
	queryFn: async () => (
		await resolver.resolve[projectionName]!(
			entityId,
			context,
		)
		?? null
	),
})

export const createCollectionsFromSchema = <
	_Schema extends Schema,
>({
	schema,
	resolverDefinitions,
	persistence,
	schemaVersion = 1,
}: {
	schema: _Schema
	resolverDefinitions: readonly SourceResolverDefinition[]
	persistence: PersistedCollectionPersistence
	schemaVersion?: number
}) => {
	const queryClient = new QueryClient()
	const resolverParts = resolverDefinitions.flatMap((resolver) => (
		Object.entries(resolver.fields)
			.flatMap(([fieldName, fieldSelector], partIndex) => {
				if (fieldSelector == null)
					return []

				const selector = (
					typeof fieldSelector === 'function' ?
						{
							select: fieldSelector,
						}
					:
						fieldSelector
				)

				return [{
					resolver,
					partIndex,
					source: resolver.source,
					entityType: resolver.entityType,
					fieldName: fieldName as EntityFieldName<typeof appSchema, EntityType<typeof appSchema>>,
					...selector,
				}]
			})
	))
	const resolverPartsByResolver = Map.groupBy(
		resolverParts,
		(resolverPart) => resolverPart.resolver,
	)
	const resolverValueParts = resolverParts.filter((resolverPart) => resolverPart.select != null)
	const resolverCountParts = resolverParts.filter((resolverPart) => resolverPart.resolveCount != null)
	const resolverLiveParts = resolverParts.filter((resolverPart) => resolverPart.resolveLive != null)
	const resolverRootLiveDefinitions = resolverDefinitions.filter((resolver) => resolver.resolveLive != null)

	const entityCollections: Partial<EntityCollections<_Schema>> = {}

	for (const definition of schema) {
		const entityType = definition.entityType
		let cached: EntityCollectionResult<_Schema, typeof entityType> | undefined

		Object.defineProperty(entityCollections, entityType, {
			get: () => (
				cached ??= createEntityCollection({
					resolverDefinitions: resolverDefinitions.filter((resolver) => (
						resolver.entityType === entityType
					)),
					resolverPartsByResolver,
					entityType,
					entityDefinition: definition,
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
	const entityFieldCountCollections: Partial<EntityFieldCountCollections<_Schema>> = {}

	for (const definition of schema) {
		const entityType = definition.entityType
		const fieldCollections: Partial<EntityFieldCollections<_Schema>[typeof entityType]> = {}
		const fieldCountCollections: EntityFieldCountCollections<_Schema>[typeof entityType] = {}

		for (const field of entityFieldDefinitions(definition)) {
			const fieldName = field.name
			let cached: EntityFieldCollectionResult<_Schema, typeof entityType, typeof field> | undefined
			let cachedCount: EntityFieldCountCollectionResult<_Schema, typeof entityType, typeof field> | undefined

			Object.defineProperty(fieldCollections, fieldName, {
				get: () => (
					cached ??= createEntityFieldCollection({
						allResolverValueParts: resolverValueParts,
						entityFieldCollections: () => entityFieldCollections as EntityFieldCollections<typeof appSchema>,
						entityFieldCountCollections: () => entityFieldCountCollections as EntityFieldCountCollections<typeof appSchema>,
						resolverDefinitions: resolverDefinitions.filter((resolver) => (
							resolver.entityType === entityType
						)),
						resolverLiveParts,
						resolverRootLiveDefinitions,
						resolverValueParts: resolverValueParts.filter((resolverPart) => (
							resolverPart.entityType === entityType
							&& resolverPart.fieldName === fieldName
						)),
						entityType,
						fieldDefinition: field,
						persistence,
						queryClient,
						schema,
						schemaVersion,
					})
				),
				enumerable: true,
				configurable: true,
			})

			if (entityFieldCardinalityIsMultiple(field.cardinality)) {
				Object.defineProperty(fieldCountCollections, fieldName, {
					get: () => (
						cachedCount ??= createEntityFieldCountCollection({
							resolverCountParts: resolverCountParts.filter((resolverPart) => (
								resolverPart.entityType === entityType
								&& resolverPart.fieldName === fieldName
							)),
							entityType,
							fieldDefinition: field,
							persistence,
							queryClient,
							schema,
							schemaVersion,
						})
					),
					enumerable: true,
					configurable: true,
				})
			}
		}

		entityFieldCollections[entityType as EntityType<_Schema>] = fieldCollections
		entityFieldCountCollections[entityType as EntityType<_Schema>] = fieldCountCollections
	}

	return {
		entityCollections: entityCollections as EntityCollections<_Schema>,
		entityFieldCollections: entityFieldCollections as EntityFieldCollections<_Schema>,
		entityFieldCountCollections: entityFieldCountCollections as EntityFieldCountCollections<_Schema>,
		queryClient,
	}
}

export const entityFieldCollectionQueryKeyBase = (entityType: string) => (
	`EntityFieldCollection:${entityType}`
)
