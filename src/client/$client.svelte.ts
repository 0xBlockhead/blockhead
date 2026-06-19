import type { QueryClient } from '@tanstack/query-core'
import { BasicIndex, and, createCollection, createLiveQueryCollection, eq, inArray } from '@tanstack/db'
import type { ContextFromSource, OrderByCallback } from '@tanstack/db'
import type { Collection, LoadSubsetOptions, NonSingleResult } from '@tanstack/db'
import { SyncNotInitializedError, queryCollectionOptions } from '@tanstack/query-db-collection'
import type { QueryCollectionUtils } from '@tanstack/query-db-collection'
import { persistedCollectionOptions } from '@tanstack/db-sqlite-persistence-core'
import type { PersistedCollectionPersistence } from '@tanstack/db-sqlite-persistence-core'
import { type as arktype } from 'arktype'
import { parse, stringify } from 'devalue'

import {
	EntityFieldCardinality,
	EntityFieldType,
	EntityMetaKey,
	entityFieldCardinalityIsMultiple,
	entityFieldConditionKey,
	entityFieldDefinitions,
	entityFieldPrimitiveValueIsValid,
	entitySelectorKey,
	entitySelectorsFromFields,
	indexSchema,
	parseEntitySelector,
	validateEntitySelector,
	type EntityDefinition,
	type EntityDefinitionByType,
	type EntityDefinitionForEntityType,
	type EntityFieldDefinition,
	type EntityFieldDefinitionByEntityTypeAndName,
} from '$/schema/$schema.ts'
import type { EntityFieldCondition, EntityFieldDefinitionByName, EntityFieldName, EntityFieldResolvedValue, EntityFieldSingleResolvedValue, EntityFieldValues, EntitySelector, EntityType as EntityTypeName, Schema } from '$/schema/$schema.ts'
import { countLoadedSubsetKey, fieldLoadedSubsetKey, indexResolvers, parseResolverSubset } from '$/resolvers/$resolvers.ts'
import type { ResolverContext, ResolverFieldValue, ResolverObject, ResolverSubset, ResolverValue, ResolveLiveFields, ResolverIndexes, SourceResolverDefinition, SourceResolverModule } from '$/resolvers/$resolvers.ts'
import { indexSourceProviders, type SourceProviderDefinition } from '$/sources/$sources.ts'
import { createEntityProxy } from '$/client/$proxy.svelte.ts'
import { subscribeEntity } from '$/client/$subscribe.svelte.ts'
import type { SubscribeSelection } from '$/client/$subscribe.svelte.ts'
export { subscribeEntity } from '$/client/$subscribe.svelte.ts'
export type { SubscribeEntityResource, SubscribeError, SubscribeFieldSelection, SubscribeResult, SubscribeSelectedFields, SubscribeSelection } from '$/client/$subscribe.svelte.ts'

declare global {
	interface Window {
		__blockheadPersistenceProbe?: (
			| {
				kind: 'loadSubset'
				collectionId: string
				decision: 'hydrated-rows' | 'loaded-marker' | 'snapshot' | 'remote'
				loadedKey: string
				hydratedRowCount?: number
				loadedMarkerRowCount?: number
				loadedMarkerSourceRowCounts?: Record<string, number>
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
				rowCount: number
				sourceRowCounts: Record<string, number>
				at: number
			}
		)[]
	}
}

export type DeclarativeOrderBy<_FieldRow extends object> = readonly (readonly [
	orderBy: OrderByCallback<ContextFromSource<{
		fieldRow: Collection<_FieldRow, string> & NonSingleResult
	}>>,
	options?: 'asc' | 'desc' | {
		readonly direction?: 'asc' | 'desc'
	},
])[]

type EntityResolvedFields<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema> = EntityTypeName<_Schema>,
> = Partial<Record<string, ProductSingleFieldValue<_Schema>>>

type EntitySingleResolvedFields<
	_Schema extends Schema,
> = Partial<Record<string, ProductSingleFieldValue<_Schema>>>

type ResolverEntityReferenceValue<_Schema extends Schema> = {
	readonly [EntityMetaKey.Selector]: EntitySelector<_Schema, EntityTypeName<_Schema>>
	readonly [EntityMetaKey.SelectorKey]?: string
} & ResolverObject

type ProductSingleFieldValue<_Schema extends Schema> = EntityFieldSingleResolvedValue<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>

type ProductFieldValue<_Schema extends Schema> =
	| ProductSingleFieldValue<_Schema>
	| readonly ProductSingleFieldValue<_Schema>[]
	| null
	| undefined

export const isProductSingleFieldValue = <_Schema extends Schema>(
	value:
		| ProductFieldValue<_Schema>
		| EntityFieldResolvedValue<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>
): value is ProductSingleFieldValue<_Schema> => (
	value != null
	&& !Array.isArray(value)
)

type ProductQueryKey = readonly [
	collectionId: string,
] | readonly [
	collectionId: string,
	loadSubsetKey: ReturnType<typeof fieldLoadedSubsetKey> | ReturnType<typeof countLoadedSubsetKey>,
]

type ProductLoadedSubset = {
	collectionId: string
	loadedKey: string
	rowCount: number
	sourceRowCounts: Record<string, number>
}

type ProductSourceRow = {
	[EntityMetaKey.Source]: string
}

const sourceRowCountsFromRows = (
	rows: readonly ProductSourceRow[],
	sources: readonly string[]
) => (
	Object.fromEntries([...new Set([
		...sources,
		...rows.map((row) => row[EntityMetaKey.Source]),
	])].map((source) => [
		source,
		rows.filter((row) => row[EntityMetaKey.Source] === source).length,
	]))
)

const productRowValue = (
	row: ProductSourceRow,
	fieldPath: readonly string[]
) => fieldPath.reduce<unknown>((value, key) => (
	value != null && typeof value === 'object' && !(value instanceof Array) ?
		value[key as keyof typeof value]
	:
		undefined
), row)

const windowProductRows = <_Row extends ProductSourceRow>(
	rows: readonly _Row[],
	resolverSubset: ResolverSubset
) => {
	const sortedRows = resolverSubset.sorts.length === 0 ?
		[...rows]
	:
		rows.toSorted((left, right) => {
			for (const sort of resolverSubset.sorts) {
				const leftValue = productRowValue(left, sort.fieldPath)
				const rightValue = productRowValue(right, sort.fieldPath)
				const direction = sort.direction === 'desc' ? -1 : 1
				if (leftValue == null && rightValue == null)
					continue
				if (leftValue == null)
					return 1
				if (rightValue == null)
					return -1

				const comparison = String(leftValue).localeCompare(String(rightValue), undefined, {
					numeric: true,
				})
				if (comparison !== 0)
					return comparison * direction
			}
			return 0
		})
	const offset = resolverSubset.pagination.offset ?? 0
	const limit = resolverSubset.pagination.limit
	return sortedRows.slice(
		offset,
		limit == null ?
			undefined
		:
			offset + limit
	)
}

const completedSourcesFromResolverEvents = <_Schema extends Schema>(
	context: EntityCollectionsContext<_Schema>,
	resolverEventStartIndex: number,
	rows: readonly ProductSourceRow[],
	requestedCompatibleSources: readonly string[]
) => [
	...new Set([
		...(context.events.resolver.slice(resolverEventStartIndex).every((event) => event.outcome !== 'failed') ?
			requestedCompatibleSources
		:
			context.events.resolver.slice(resolverEventStartIndex).flatMap((event) => (
				event.outcome === 'failed' ?
					[]
				:
					[event.source]
			))
		),
		...rows.map((row) => row[EntityMetaKey.Source]),
	]),
]

const loadedSubsetMarkerCoversRows = (
	loadedMarker: ProductLoadedSubset | undefined,
	hydratedRows: readonly ProductSourceRow[],
	requestedCompatibleSources: readonly string[],
	allowZeroRowMarker: boolean
) => (
	loadedMarker != null
	&& (
		allowZeroRowMarker
		|| loadedMarker.rowCount > 0
	)
	&& hydratedRows.length >= loadedMarker.rowCount
	&& requestedCompatibleSources.every((source) => {
		const requiredRows = loadedMarker.sourceRowCounts[source]
		return (
			requiredRows != null
			&& hydratedRows.filter((row) => row[EntityMetaKey.Source] === source).length >= requiredRows
		)
	})
)

export type EntityCollectionItem<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
> = {
	[EntityMetaKey.Selector]: EntitySelector<_Schema, _EntityType>
	[EntityMetaKey.SelectorKey]: string
	[EntityMetaKey.Fields]: EntityResolvedFields<_Schema, _EntityType>
	[EntityMetaKey.Source]: string
}

export type EntityFieldCollectionItem<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
	_EntityFieldName extends EntityFieldName<_Schema, _EntityType>,
> = {
	[EntityMetaKey.ParentSelector]: object
	[EntityMetaKey.ParentSelectorKey]: string
	[EntityMetaKey.Value]: EntityFieldSingleResolvedValue<_Schema, _EntityType, _EntityFieldName>
	[EntityMetaKey.Source]: string
	fieldName: _EntityFieldName
	createdAt?: number
	localStatusId?: string
	marketCapRank?: number
	valueKey: string
}

export type EntityFieldCountCollectionItem<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
	_EntityFieldName extends EntityFieldName<_Schema, _EntityType>,
> = {
	[EntityMetaKey.ParentSelector]: object
	[EntityMetaKey.ParentSelectorKey]: string
	[EntityMetaKey.Value]: number
	[EntityMetaKey.Source]: string
	fieldName: _EntityFieldName
	filterKey: string
}

export type EntityCollectionsContext<_Schema extends Schema = Schema> = {
	schema: _Schema
	entityDefinitionByType: EntityDefinitionByType<_Schema>
	entityFieldDefinitionByEntityTypeAndName: EntityFieldDefinitionByEntityTypeAndName<_Schema>
	loadedSubsets: Collection<ProductLoadedSubset, string> & NonSingleResult
	entityCollections: Record<string, Collection<EntityCollectionItem<_Schema, EntityTypeName<_Schema>>, string> & NonSingleResult>
	entityFieldCollections: Record<string, Record<string, Collection<EntityFieldCollectionItem<
			_Schema,
			EntityTypeName<_Schema>,
			EntityFieldName<_Schema, EntityTypeName<_Schema>>
			>, string> & NonSingleResult>>
	entityFieldCountCollections: Record<string, Partial<Record<string, Collection<EntityFieldCountCollectionItem<
			_Schema,
			EntityTypeName<_Schema>,
			EntityFieldName<_Schema, EntityTypeName<_Schema>>
			>, string> & NonSingleResult>>>
	queryClient: QueryClient
	resolverIndexes: ResolverIndexes<_Schema>
	resolverPublicEnvBySource: ReadonlyMap<string, Record<string, string>>
	activeResourceSubscriptions: Set<symbol>
	startedLiveScopes: Set<string>
	liveSubscriptions: Map<string, {
		abortController: AbortController
		cleanup?: () => void
	}>
	events: {
		collectionSync: {
			collection:
				| {
					readonly kind: 'Entity'
					readonly entityType: EntityTypeName<_Schema>
					readonly id: string
				}
				| {
					readonly kind: 'Field' | 'Count'
					readonly entityType: EntityTypeName<_Schema>
					readonly fieldName: EntityFieldName<_Schema, EntityTypeName<_Schema>>
					readonly id: string
				}
			key: string
		}[]
		resolver: {
			source: string
			definitionIndex: number
			outcome: 'resolved' | 'empty' | 'failed'
			key: string
		}[]
		live: {
			action: string
			scope: string
		}[]
	}
}

const fieldRowFieldsFromValue = <_Schema extends Schema>(
	value: ResolverValue | ProductFieldValue<_Schema> | object
): ResolverObject => {
	if (value == null || typeof value !== 'object')
		return {}

	if (value instanceof Array)
		return {}

	return Object.fromEntries(Object.entries(value))
}

export const fieldResultValueKey = <_Schema extends Schema>(
	value: ResolverValue | ProductFieldValue<_Schema> | object
) => (
	value != null
	&& typeof value === 'object'
	&& !(value instanceof Array)
	&& EntityMetaKey.SelectorKey in value
	&& typeof value[EntityMetaKey.SelectorKey] === 'string' ?
		`Entity:${stringify(value[EntityMetaKey.SelectorKey])}`
	:
		`Value:${stringify(value)}`
)

const materializeResolverFieldValue = <
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
>(
	schema: _Schema,
	fieldDefinition: EntityFieldDefinition,
	value: ResolverValue | ProductFieldValue<_Schema>
): ProductFieldValue<_Schema> => {
	if (fieldDefinition.type === EntityFieldType.Primitive || value == null)
		return value as ProductFieldValue<_Schema>

	const referenceEntityDefinition = schema.find((entityDefinition) => entityDefinition.entityType === fieldDefinition.entityType)
	if (referenceEntityDefinition == null)
		throw new Error(`${fieldDefinition.name}: missing reference entity definition`)

	if (entityFieldCardinalityIsMultiple(fieldDefinition.cardinality)) {
		if (!Array.isArray(value))
			throw new Error(`${fieldDefinition.name}: multiple reference field requires array`)

		return value.map((item) => {
			if (
				item == null
				|| typeof item !== 'object'
				|| item instanceof Array
				|| !(EntityMetaKey.Selector in item)
				|| item[EntityMetaKey.Selector] == null
				|| typeof item[EntityMetaKey.Selector] !== 'object'
				|| item[EntityMetaKey.Selector] instanceof Array
			)
				throw new Error(`${fieldDefinition.name}: invalid entity reference`)

			return {
				...item,
				[EntityMetaKey.SelectorKey]: entitySelectorKey(schema, referenceEntityDefinition, item[EntityMetaKey.Selector]),
			}
		}) as ProductFieldValue<_Schema>
	}

	if (
		typeof value !== 'object'
		|| value instanceof Array
		|| !(EntityMetaKey.Selector in value)
		|| value[EntityMetaKey.Selector] == null
		|| typeof value[EntityMetaKey.Selector] !== 'object'
		|| value[EntityMetaKey.Selector] instanceof Array
	)
		throw new Error(`${fieldDefinition.name}: invalid entity reference`)

	return {
		...value,
		[EntityMetaKey.SelectorKey]: entitySelectorKey(
			schema,
			referenceEntityDefinition,
			value[EntityMetaKey.Selector]
		),
	} as ProductFieldValue<_Schema>
}

export const countFilterKey = (
	request: LoadSubsetOptions
) => {
	const filters = parseResolverSubset({
		where: request.where,
	}).filters.flatMap((filter) => (
		filter.fieldPath[0] === 'filterKey' ?
			[{
				fieldPath: filter.fieldPath,
				operator: filter.operator,
				value: (
					Array.isArray(filter.value) ?
						filter.value.toSorted((left, right) => String(left).localeCompare(String(right)))
					:
						filter.value
				),
			}]
		:
			[]
	)).toSorted((left, right) => (
		`${left.fieldPath.join('.')}:${left.operator}:${String(left.value)}`
			.localeCompare(`${right.fieldPath.join('.')}:${right.operator}:${String(right.value)}`)
	))
	return stringify(filters.length === 0 ? {} : { filters })
}

const recordPersistenceProbe = (
	event: NonNullable<Window['__blockheadPersistenceProbe']>[number]
) => {
	if (typeof window === 'undefined' || window.__blockheadPersistenceProbe == null)
		return

	window.__blockheadPersistenceProbe.push(event)
	if (window.__blockheadPersistenceProbe.length > 5_000)
		window.__blockheadPersistenceProbe.splice(0, window.__blockheadPersistenceProbe.length - 5_000)
}

export const validateResolverFieldValue = <_Schema extends Schema>(
	schema: _Schema,
	fieldDefinition: EntityFieldDefinition,
	value: ProductFieldValue<_Schema>
) => {
	if (entityFieldCardinalityIsMultiple(fieldDefinition.cardinality)) {
		if (!Array.isArray(value))
			throw new Error(`${fieldDefinition.name}: multiple field requires array`)
		for (const item of value) {
			if (fieldDefinition.type === EntityFieldType.Primitive) {
				if (!entityFieldPrimitiveValueIsValid(fieldDefinition, item))
					throw new Error(`${fieldDefinition.name}: invalid primitive value`)
				continue
			}

			if (
				typeof item !== 'object'
				|| Array.isArray(item)
				|| !('__selector' in item)
				|| !('__selectorKey' in item)
			)
				throw new Error(`${fieldDefinition.name}: invalid entity reference`)

			if (typeof item.__selector !== 'object' || item.__selector == null || Array.isArray(item.__selector))
				throw new Error(`${fieldDefinition.name}: invalid entity reference id`)

			const entityDefinition = schema.find((entityDefinition) => entityDefinition.entityType === fieldDefinition.entityType)
			if (entityDefinition == null)
				throw new Error(`${fieldDefinition.name}: missing reference entity definition`)

			validateEntitySelector(schema, entityDefinition, item[EntityMetaKey.Selector])
		}
		return
	}

	if (value == null) {
		if (fieldDefinition.cardinality === EntityFieldCardinality.One)
			throw new Error(`${fieldDefinition.name}: required value missing`)
		return
	}

	if (fieldDefinition.type === EntityFieldType.Primitive) {
		if (!entityFieldPrimitiveValueIsValid(fieldDefinition, value))
			throw new Error(`${fieldDefinition.name}: invalid primitive value`)
		return
	}

	if (
		typeof value !== 'object'
		|| Array.isArray(value)
		|| !('__selector' in value)
		|| !('__selectorKey' in value)
	)
		throw new Error(`${fieldDefinition.name}: invalid entity reference`)

	if (typeof value.__selector !== 'object' || value.__selector == null || Array.isArray(value.__selector))
		throw new Error(`${fieldDefinition.name}: invalid entity reference id`)

	const entityDefinition = schema.find((entityDefinition) => entityDefinition.entityType === fieldDefinition.entityType)
	if (entityDefinition == null)
		throw new Error(`${fieldDefinition.name}: missing reference entity definition`)

	validateEntitySelector(schema, entityDefinition, value[EntityMetaKey.Selector])
}

const resolveSnapshot = <
	_Schema extends Schema,
>(
	context: EntityCollectionsContext<_Schema>,
	resolver: SourceResolverDefinition<_Schema, string, EntityTypeName<_Schema>, ResolverContext, ResolverValue>,
	entitySelector: EntitySelector<_Schema, EntityTypeName<_Schema>>,
	selectorName: string,
	resolverSubset: ResolverSubset
) => {
	const resolve = resolver.resolve[selectorName]
	if (resolve == null)
		throw new Error(`${resolver.entityType}: Resolver does not support Selector ${selectorName}`)

	const key = stringify({
		source: resolver.source,
		definitionIndex: resolver.definitionIndex,
		selectorName,
		entitySelector,
		filters: resolverSubset.filters.filter((filter) => (
			filter.fieldPath[0] !== EntityMetaKey.SelectorKey
			&& filter.fieldPath[0] !== EntityMetaKey.ParentSelectorKey
			&& filter.fieldPath[0] !== EntityMetaKey.Source
		)),
		sorts: resolverSubset.sorts,
		pagination: resolverSubset.pagination,
	})
	return context.queryClient.fetchQuery({
		queryKey: [
			'ResolverSnapshot',
			key,
		],
		staleTime: Infinity,
		gcTime: Infinity,
		queryFn: async () => {
			try {
				const snapshot = await resolve(
					entitySelector,
					{
						...resolverSubset,
						publicEnv: context.resolverPublicEnvBySource.get(resolver.source) ?? {},
					}
				)
				context.events.resolver.push({
					source: resolver.source,
					definitionIndex: resolver.definitionIndex,
					outcome: snapshot == null ? 'empty' : 'resolved',
					key,
				})
				return snapshot ?? null
			} catch (error) {
				context.events.resolver.push({
					source: resolver.source,
					definitionIndex: resolver.definitionIndex,
					outcome: 'failed',
					key,
				})
				throw error
			}
		},
	})
}

const invalidateLoadedSubsets = <_Schema extends Schema>(
	context: EntityCollectionsContext<_Schema>,
	options: {
		readonly kind: 'Field' | 'Count'
		readonly entityType: EntityTypeName<_Schema>
		readonly fieldName: EntityFieldName<_Schema, EntityTypeName<_Schema>>
		readonly parentSelectorKey: string
		readonly source: string
	} & (
		| {
			readonly kind: 'Field'
			readonly loadOptions: LoadSubsetOptions
		}
		| {
			readonly kind: 'Count'
			readonly loadOptions: LoadSubsetOptions
		}
	)
) => {
	for (const query of context.queryClient.getQueryCache().getAll()) {
		if (query.queryKey[0] !== `${options.kind}:${options.entityType}:${options.fieldName}`)
			continue

		const resolverSubset = parseResolverSubset(query.meta?.loadSubsetOptions ?? {})
		const queriedCountFilterKey = resolverSubset.filters.find((filter) => filter.fieldPath[0] === 'filterKey')?.value ?? countFilterKey({})
		if (options.kind === 'Count' && typeof queriedCountFilterKey !== 'string')
			throw new Error('Count invalidation expected string filterKey')
		if (
			!resolverSubset.parentSelectorKeys.includes(options.parentSelectorKey)
			|| (
				resolverSubset.sources != null
				&& !resolverSubset.sources.includes(options.source)
			)
			|| (
				options.kind === 'Count'
				&& queriedCountFilterKey !== countFilterKey(options.loadOptions)
			)
			|| (
				options.kind === 'Field'
				&& stringify(fieldLoadedSubsetKey(query.meta?.loadSubsetOptions ?? {})) !== stringify(fieldLoadedSubsetKey(options.loadOptions))
			)
		)
			continue

		void context.queryClient.invalidateQueries({
			queryKey: query.queryKey,
			exact: true,
		})
	}
}

const successful = async <_Value>(
	values: readonly Promise<_Value>[],
	message: string
) => {
	const settled = await Promise.allSettled(values)
	const fulfilled = settled.flatMap((result) => result.status === 'fulfilled' ? [result.value] : [])
	if (settled.length > 0 && fulfilled.length === 0)
		throw new AggregateError(
			settled.flatMap((result) => result.status === 'rejected' ? [result.reason] : []),
			message
		)
	return fulfilled
}

const resolveEntity = async <
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
>(
	context: EntityCollectionsContext<_Schema>,
	entityDefinition: EntityDefinitionForEntityType<_Schema, _EntityType>,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	resolverSubset: ResolverSubset,
	options?: {
		readonly selectorSources?: readonly string[]
	}
) => {
	const selector = validateEntitySelector(context.schema, entityDefinition, entitySelector)
	if ((options?.selectorSources ?? resolverSubset.sources)?.length === 0)
		return []

	const entityRowFieldDefinitions = entityFieldDefinitions(entityDefinition).filter((fieldDefinition) => (
		fieldDefinition.when == null
		&& !entityFieldCardinalityIsMultiple(fieldDefinition.cardinality)
	))
	const resolvers = (context.resolverIndexes.resolverDefinitionsByEntityType[entityDefinition.entityType] ?? [])
		.filter((resolver) => (
			resolver.resolve[selector.name] != null
			&& ((options?.selectorSources ?? resolverSubset.sources) == null || (options?.selectorSources ?? resolverSubset.sources)?.includes(resolver.source))
			&& entityRowFieldDefinitions.some((fieldDefinition) => fieldDefinition.name in resolver.fields)
		))

	return successful(
		resolvers.map(async (resolver) => {
			const snapshot = await resolveSnapshot(
				context,
				resolver,
				entitySelector,
				selector.name,
				resolverSubset
			)
			const fields: EntityResolvedFields<_Schema> = {}
			for (const fieldDefinition of entityRowFieldDefinitions) {
				const fieldSelector = resolver.fields[fieldDefinition.name]
				const snapshotFieldValue = fieldDefinition.name in resolver.fields ?
					fieldRowFieldsFromValue(snapshot)[fieldDefinition.name]
				:
					undefined
					if (
					(
						fieldSelector == null
						|| (
							typeof fieldSelector !== 'function'
							&& fieldSelector.select == null
						)
					)
					&& snapshotFieldValue === undefined
				)
					continue

				const selectedValue = (
					typeof fieldSelector === 'function' ?
						fieldSelector(
							snapshot,
							entitySelector,
							{
								...resolverSubset,
								publicEnv: context.resolverPublicEnvBySource.get(resolver.source) ?? {},
							}
						)
					:
						fieldSelector?.select == null ?
							snapshotFieldValue
						:
							fieldSelector.select(
								snapshot,
								entitySelector,
								{
									...resolverSubset,
									publicEnv: context.resolverPublicEnvBySource.get(resolver.source) ?? {},
								}
						)
				)
				if (selectedValue == null) {
					validateResolverFieldValue(context.schema, fieldDefinition, undefined)
					continue
				}
				const value = materializeResolverFieldValue(
					context.schema,
					fieldDefinition,
					selectedValue
				)
				validateResolverFieldValue(context.schema, fieldDefinition, value)
				if (isProductSingleFieldValue(value))
					fields[fieldDefinition.name] = value
			}
			return [
				entitySelector,
				...entitySelectorsFromFields(context.schema, entityDefinition, entitySelector, fields),
			].map((resolvedEntitySelector) => ({
				...fields,
				[EntityMetaKey.Selector]: resolvedEntitySelector,
				[EntityMetaKey.SelectorKey]: entitySelectorKey(context.schema, entityDefinition, resolvedEntitySelector),
				[EntityMetaKey.Fields]: fields,
				[EntityMetaKey.Source]: resolver.source,
			}))
		}),
		`${entityDefinition.entityType}: all compatible Resolver Definitions failed`
	)
}

const loadCollectionSubset = async <_Schema extends Schema>(
	context: EntityCollectionsContext<_Schema>,
	collection:
		| {
			readonly kind: 'Entity'
			readonly entityType: EntityTypeName<_Schema>
		}
		| {
			readonly kind: 'Field' | 'Count'
			readonly entityType: EntityTypeName<_Schema>
			readonly fieldName: EntityFieldName<_Schema, EntityTypeName<_Schema>>
		},
	loadSubsetOptions: LoadSubsetOptions
) => {
	const resolverSubset = parseResolverSubset(loadSubsetOptions)
	if (
		collection.kind === 'Entity'
		&& resolverSubset.selectorKeys.length === 0
	)
		throw new Error(`Entity:${collection.entityType}: loadSubset requires ${EntityMetaKey.SelectorKey} filter`)
	if (
		collection.kind !== 'Entity'
		&& resolverSubset.parentSelectorKeys.length === 0
	)
		throw new Error(`${collection.kind}:${collection.entityType}:${collection.fieldName}: loadSubset requires ${EntityMetaKey.ParentSelectorKey} filter`)

	const countCollectionFilterKey = resolverSubset.filters.find((filter) => filter.fieldPath[0] === 'filterKey')?.value ?? countFilterKey({})
	if (typeof countCollectionFilterKey !== 'string')
		throw new Error(`${collection.kind}:${collection.entityType}: expected string filterKey`)
	const countCollectionFilterKeyPayload = (
		collection.kind === 'Count' ?
			parse(countCollectionFilterKey)
		:
			undefined
	)
	if (
		collection.kind === 'Count'
		&& (
			countCollectionFilterKeyPayload == null
			|| typeof countCollectionFilterKeyPayload !== 'object'
			|| countCollectionFilterKeyPayload instanceof Array
		)
	)
		throw new Error(`${collection.kind}:${collection.entityType}:${collection.fieldName}: expected object filterKey payload`)
	const fieldsByEntitySelectorKeyAndSource = new Map<string, EntitySingleResolvedFields<_Schema>>()
	const loadedEntities: EntityCollectionItem<_Schema, EntityTypeName<_Schema>>[] = []
	const loadedFields: EntityFieldCollectionItem<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>[] = []
	const loadedCounts: EntityFieldCountCollectionItem<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>[] = []
	if (collection.kind === 'Entity') {
		const entityDefinition = context.entityDefinitionByType[collection.entityType]
		if (entityDefinition == null)
			throw new Error(`${collection.entityType}: unknown entity type`)

		for (const entitySelector of resolverSubset.selectorKeys.map((selectorKey) => {
			const entitySelector = parseEntitySelector(context.schema, entityDefinition, parse(selectorKey))
			if (entitySelector instanceof arktype.errors)
					throw new Error(`${collection.entityType}: invalid entity selector ${selectorKey}`)

			return entitySelector
		}))
			for (const rowGroup of await resolveEntity(context, entityDefinition, entitySelector, resolverSubset))
				for (const row of rowGroup) {
					const fieldsKey = stringify([
						row[EntityMetaKey.SelectorKey],
						row[EntityMetaKey.Source],
					])
					const fieldsBySource = fieldsByEntitySelectorKeyAndSource.get(fieldsKey) ?? {}
					for (const [fieldName, value] of Object.entries(row[EntityMetaKey.Fields]))
							if (isProductSingleFieldValue(value))
								fieldsBySource[fieldName] = value
					fieldsByEntitySelectorKeyAndSource.set(fieldsKey, fieldsBySource)
					loadedEntities.push(row)
				}
	}
	if (collection.kind !== 'Entity') {
		const entityDefinition = context.entityDefinitionByType[collection.entityType]
		if (entityDefinition == null)
			throw new Error(`${collection.entityType}: unknown entity type`)

		const fieldLoadSubsetOptions = {
			where: collection.kind === 'Count' ? undefined : loadSubsetOptions.where,
			orderBy: loadSubsetOptions.orderBy,
			limit: collection.kind === 'Count' ? undefined : loadSubsetOptions.limit,
			offset: collection.kind === 'Count' ? undefined : loadSubsetOptions.offset,
			cursor: collection.kind === 'Count' ? undefined : loadSubsetOptions.cursor,
		} satisfies LoadSubsetOptions
		const fieldResolverSubset = (
			collection.kind === 'Count' ?
				{
					...parseResolverSubset(fieldLoadSubsetOptions),
					sources: resolverSubset.sources,
					parentSelectorKeys: resolverSubset.parentSelectorKeys,
				}
			:
				resolverSubset
		)
		const fieldEntitySelectors = resolverSubset.parentSelectorKeys.map((selectorKey) => {
			const entitySelector = parseEntitySelector(context.schema, entityDefinition, parse(selectorKey))
			if (entitySelector instanceof arktype.errors)
					throw new Error(`${collection.entityType}: invalid parent entity selector ${selectorKey}`)

			return entitySelector
		})
		const fieldDefinition = context.entityFieldDefinitionByEntityTypeAndName[collection.entityType]?.[collection.fieldName]
		if (fieldDefinition == null)
			throw new Error(`${collection.entityType}.${collection.fieldName}: unknown field`)

		const candidates: {
			entitySelector: EntitySelector<_Schema, EntityTypeName<_Schema>>
			selectorName: string
		}[] = []
		for (const fieldEntitySelector of fieldEntitySelectors) {
			const fieldEntitySelectorKey = entitySelectorKey(context.schema, entityDefinition, fieldEntitySelector)
			const fieldSelectorName = validateEntitySelector(context.schema, entityDefinition, fieldEntitySelector).name
			if (!candidates.some((candidate) => entitySelectorKey(context.schema, entityDefinition, candidate.entitySelector) === fieldEntitySelectorKey))
				candidates.push({
					entitySelector: fieldEntitySelector,
					selectorName: fieldSelectorName,
				})

			for (const rowGroup of await resolveEntity(context, entityDefinition, fieldEntitySelector, fieldResolverSubset, {
				selectorSources: [
					...new Set(context.resolverIndexes.resolverDefinitionsByEntityType[collection.entityType]
						?.filter((resolver) => (
							resolver.resolve[fieldSelectorName] != null
							&& (
								resolverSubset.sources == null
								|| resolverSubset.sources.includes(resolver.source)
								|| context.resolverIndexes.resolverParts.some((part) => (
									part.entityType === collection.entityType
									&& part.fieldName === collection.fieldName
									&& part.source === resolver.source
								))
							)
							&& context.resolverIndexes.resolverParts.some((part) => {
								if (
									part.entityType !== collection.entityType
									|| part.fieldName !== collection.fieldName
									|| part.resolver.resolve[fieldSelectorName] != null
									|| (
										resolverSubset.sources != null
										&& !resolverSubset.sources.includes(part.source)
									)
								)
									return false

								return (part.parentSelectors ?? Object.keys(part.resolver.resolve)).some((parentSelectorName) => (
									parentSelectorName !== fieldSelectorName
									&& entityDefinition.selectors.find((selector) => selector.name === parentSelectorName)?.fields.every((field) => field in resolver.fields) === true
								))
							})
						))
						.map((resolver) => resolver.source) ?? []),
				],
			}))
				for (const row of rowGroup) {
					const fieldsKey = stringify([
						row[EntityMetaKey.SelectorKey],
						row[EntityMetaKey.Source],
					])
					const fieldsBySource = fieldsByEntitySelectorKeyAndSource.get(fieldsKey) ?? {}
					for (const [fieldName, value] of Object.entries(row[EntityMetaKey.Fields]))
						if (isProductSingleFieldValue(value))
							fieldsBySource[fieldName] = value
					fieldsByEntitySelectorKeyAndSource.set(fieldsKey, fieldsBySource)
					if (!candidates.some((candidate) => entitySelectorKey(context.schema, entityDefinition, candidate.entitySelector) === entitySelectorKey(context.schema, entityDefinition, row[EntityMetaKey.Selector])))
						candidates.push({
							entitySelector: row[EntityMetaKey.Selector],
							selectorName: validateEntitySelector(context.schema, entityDefinition, row[EntityMetaKey.Selector]).name,
						})
					loadedEntities.push(row)
				}

			for (const row of context.entityCollections[collection.entityType].toArray) {
				if (
					row[EntityMetaKey.SelectorKey] !== fieldEntitySelectorKey
					&& !entitySelectorsFromFields(
						context.schema,
						entityDefinition,
						row[EntityMetaKey.Selector],
						row[EntityMetaKey.Fields]
						).some((selector) => (
						entitySelectorKey(context.schema, entityDefinition, selector) === fieldEntitySelectorKey
						))
				)
					continue

				const fieldsKey = stringify([
					row[EntityMetaKey.SelectorKey],
					row[EntityMetaKey.Source],
				])
				const fieldsBySource = fieldsByEntitySelectorKeyAndSource.get(fieldsKey) ?? {}
				for (const [fieldName, value] of Object.entries(row[EntityMetaKey.Fields]))
						if (isProductSingleFieldValue(value))
							fieldsBySource[fieldName] = value
				fieldsByEntitySelectorKeyAndSource.set(fieldsKey, fieldsBySource)
				if (!candidates.some((candidate) => entitySelectorKey(context.schema, entityDefinition, candidate.entitySelector) === entitySelectorKey(context.schema, entityDefinition, row[EntityMetaKey.Selector])))
					candidates.push({
						entitySelector: row[EntityMetaKey.Selector],
						selectorName: validateEntitySelector(context.schema, entityDefinition, row[EntityMetaKey.Selector]).name,
					})
				loadedEntities.push(row)
			}
		}

		const requestedParentSelectorKeys = new Set(fieldEntitySelectors.map((fieldEntitySelector) => (
			entitySelectorKey(context.schema, entityDefinition, fieldEntitySelector)
		)))
		for (const candidate of candidates) {
			const parentSelectorKey = entitySelectorKey(context.schema, entityDefinition, candidate.entitySelector)
			const replaceFieldRows = (
				source: string,
				targetFieldName: EntityFieldName<_Schema, EntityTypeName<_Schema>>,
				rows: readonly {
					source: string
					value: EntityFieldSingleResolvedValue<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>
				}[]
			) => {
				const fieldCollection = context.entityFieldCollections[collection.entityType][targetFieldName]
				const targetFieldDefinition = context.entityFieldDefinitionByEntityTypeAndName[collection.entityType]?.[targetFieldName]
				if (targetFieldDefinition == null)
					throw new Error(`${collection.entityType}.${targetFieldName}: unknown field`)
				try {
					const sources = new Set(rows.map((row) => row.source))
					if (sources.size === 0)
							sources.add(source)
					const referencedEntityDefinition = (
						targetFieldDefinition.type === EntityFieldType.EntityReference
							|| targetFieldDefinition.type === EntityFieldType.EntitiesReference ?
							context.schema.find((referencedDefinition) => referencedDefinition.entityType === targetFieldDefinition.entityType)
						:
							undefined
					)
					for (const row of fieldCollection.toArray) {
						if (
								row[EntityMetaKey.ParentSelectorKey] === parentSelectorKey
							&& sources.has(row[EntityMetaKey.Source])
						)
							fieldCollection.utils.writeDelete(fieldCollection.getKeyFromItem(row))
					}
					for (const row of rows) {
						try {
							validateResolverFieldValue(
								context.schema,
								targetFieldDefinition,
								entityFieldCardinalityIsMultiple(targetFieldDefinition.cardinality) ?
									[row.value]
								:
									row.value
									)
						} catch {
							continue
						}
						const valueFields = fieldRowFieldsFromValue(row.value)
						const fieldRow = {
							...valueFields,
							fieldName: targetFieldName,
							[EntityMetaKey.ParentSelector]: candidate.entitySelector,
							[EntityMetaKey.ParentSelectorKey]: parentSelectorKey,
							[EntityMetaKey.Source]: row.source,
							[EntityMetaKey.Value]: row.value,
							valueKey: fieldResultValueKey(row.value),
						}
						loadedFields.push(fieldRow)
						fieldCollection.utils.writeUpsert(fieldRow)
						if (referencedEntityDefinition != null) {
							const referencedSelector = parseEntitySelector(
								context.schema,
								referencedEntityDefinition,
								valueFields[EntityMetaKey.Selector]
								)
							if (!(referencedSelector instanceof arktype.errors)) {
								const fields: EntityResolvedFields<_Schema> = {}
								for (const fieldDefinition of entityFieldDefinitions(referencedEntityDefinition)) {
									const fieldValue = valueFields[fieldDefinition.name]
										if (
												fieldDefinition.when == null
												&& !entityFieldCardinalityIsMultiple(fieldDefinition.cardinality)
												&& isProductSingleFieldValue(fieldValue)
											) {
											const fieldValueWithSelectorKey = materializeResolverFieldValue(
												context.schema,
												fieldDefinition,
												fieldValue
											)
											if (isProductSingleFieldValue(fieldValueWithSelectorKey))
												fields[fieldDefinition.name] = fieldValueWithSelectorKey
										}
								}

								const entityRow = {
									...fields,
									[EntityMetaKey.Selector]: referencedSelector,
									[EntityMetaKey.SelectorKey]: entitySelectorKey(context.schema, referencedEntityDefinition, referencedSelector),
									[EntityMetaKey.Fields]: fields,
									[EntityMetaKey.Source]: row.source,
								}
								loadedEntities.push(entityRow)
								try {
									context.entityCollections[referencedEntityDefinition.entityType].utils.writeUpsert(entityRow)
								} catch (error) {
										if (error instanceof SyncNotInitializedError)
											context.entityCollections[referencedEntityDefinition.entityType].onFirstReady(() => {
												context.entityCollections[referencedEntityDefinition.entityType].utils.writeUpsert(entityRow)
											})
										else
											throw error
								}
							}
						}
					}
				} catch (error) {
				if (error instanceof SyncNotInitializedError)
						fieldCollection.onFirstReady(() => replaceFieldRows(source, targetFieldName, rows))
					else
						throw error
				}
				context.events.live.push({
					action: 'writeFieldRows',
					scope: `${source}:${collection.entityType}:${targetFieldName}`,
				})
			}
			const replaceFieldCounts = (
				source: string,
				targetFieldName: EntityFieldName<_Schema, EntityTypeName<_Schema>>,
				rows: readonly {
					source: string
					value: number
				}[]
			) => {
				const countCollection = context.entityFieldCountCollections[collection.entityType][targetFieldName]
				if (countCollection == null)
					throw new Error(`${collection.entityType}.${targetFieldName}: missing count collection`)

				try {
					const filterKey = (
						collection.kind === 'Count' ?
							countCollectionFilterKey
					: fieldResolverSubset.filters.some((filter) => (
							filter.fieldPath[0] !== EntityMetaKey.ParentSelectorKey
							&& filter.fieldPath[0] !== EntityMetaKey.Source
						)) ?
							countFilterKey(fieldLoadSubsetOptions)
						:
							countFilterKey({})
					)
					const sources = new Set(rows.map((row) => row.source))
					if (sources.size === 0)
						sources.add(source)
					for (const row of countCollection.toArray) {
						if (
							row[EntityMetaKey.ParentSelectorKey] === parentSelectorKey
							&& sources.has(row[EntityMetaKey.Source])
							&& row.filterKey === filterKey
						)
							countCollection.utils.writeDelete(countCollection.getKeyFromItem(row))
					}
					for (const row of rows) {
						const countRow = {
							[EntityMetaKey.ParentSelector]: candidate.entitySelector,
							[EntityMetaKey.ParentSelectorKey]: parentSelectorKey,
							[EntityMetaKey.Source]: row.source,
							[EntityMetaKey.Value]: row.value,
							fieldName: targetFieldName,
							filterKey,
						}
						loadedCounts.push(countRow)
						countCollection.utils.writeUpsert(countRow)
					}
				} catch (error) {
					if (error instanceof SyncNotInitializedError)
						countCollection.onFirstReady(() => replaceFieldCounts(source, targetFieldName, rows))
					else
						throw error
				}
				invalidateLoadedSubsets(context, {
					kind: 'Count',
					entityType: collection.entityType,
					fieldName: targetFieldName,
					parentSelectorKey,
					source,
					loadOptions: fieldLoadSubsetOptions,
				})
				context.events.live.push({
					action: 'writeFieldCounts',
					scope: `${source}:${collection.entityType}:${targetFieldName}`,
				})
			}
			const fieldsForSource = (source: string): ResolveLiveFields<_Schema, EntityTypeName<_Schema>> => new Proxy(Object.assign(Object.create(null), {
				invalidate: (fieldNames: readonly EntityFieldName<_Schema, EntityTypeName<_Schema>>[]) => {
					for (const fieldName of fieldNames)
						invalidateLoadedSubsets(context, {
							kind: 'Field',
							entityType: collection.entityType,
							fieldName,
							parentSelectorKey,
							source,
							loadOptions: fieldLoadSubsetOptions,
						})
					context.events.live.push({
						action: 'invalidateFields',
						scope: `root:${fieldNames.join(',')}`,
					})
				},
			}), {
				get: (target, property) => {
					if (property === 'invalidate')
						return target.invalidate

					const liveFieldDefinition = context.entityFieldDefinitionByEntityTypeAndName[collection.entityType]?.[String(property)]
					if (liveFieldDefinition == null)
						throw new Error(`${collection.entityType}.${String(property)}: unknown live field`)
					return {
						replaceRows: (rows: readonly {
							source: string
							value: EntityFieldSingleResolvedValue<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>
						}[]) => replaceFieldRows(
							source,
							liveFieldDefinition.name,
							rows
						),
						invalidate: () => {
							invalidateLoadedSubsets(context, {
								kind: 'Field',
								entityType: collection.entityType,
								fieldName: liveFieldDefinition.name,
								parentSelectorKey,
								source,
								loadOptions: fieldLoadSubsetOptions,
							})
							context.events.live.push({
								action: 'invalidateFields',
								scope: `root:${liveFieldDefinition.name}`,
							})
						},
						count: {
							replaceRows: (rows: readonly {
								source: string
								value: number
							}[]) => replaceFieldCounts(
								source,
								liveFieldDefinition.name,
								rows
							),
							invalidate: () => {
								invalidateLoadedSubsets(context, {
									kind: 'Count',
									entityType: collection.entityType,
									fieldName: liveFieldDefinition.name,
									parentSelectorKey,
									source,
									loadOptions: fieldLoadSubsetOptions,
								})
								context.events.live.push({
									action: 'invalidateCounts',
									scope: `root:${liveFieldDefinition.name}`,
								})
							},
						},
					}
				},
			})
			if (
				collection.kind === 'Field'
				&& requestedParentSelectorKeys.has(parentSelectorKey)
			) {
				for (const part of (context.resolverIndexes.resolverRootLivePartsByEntityType[collection.entityType] ?? [])
					.filter((part) => (
						part.publisher.publishes[collection.fieldName] === true
						&& (resolverSubset.sources == null || resolverSubset.sources.includes(part.source))
					))) {
						const equivalentParentSelectorKeys = new Set([
							parentSelectorKey,
						])
						for (const row of loadedEntities) {
							const rowParentSelectorKeys = [
								row[EntityMetaKey.SelectorKey],
								...entitySelectorsFromFields(
									context.schema,
									entityDefinition,
									row[EntityMetaKey.Selector],
									row[EntityMetaKey.Fields]
								).map((selector) => entitySelectorKey(context.schema, entityDefinition, selector)),
							]
							if (
								row[EntityMetaKey.SelectorKey] === parentSelectorKey
								|| rowParentSelectorKeys.includes(parentSelectorKey)
							)
								for (const rowParentSelectorKey of rowParentSelectorKeys)
									equivalentParentSelectorKeys.add(rowParentSelectorKey)
						}
						const scope = stringify({
							kind: 'Root ResolveLive',
							source: part.source,
							definitionIndex: part.resolver.definitionIndex,
							publisherName: part.publisherName,
							entityType: collection.entityType,
							parentSelectorKey,
						})
						if (context.activeResourceSubscriptions.size === 0)
							continue
						if ([...equivalentParentSelectorKeys].some((equivalentParentSelectorKey) => context.startedLiveScopes.has(stringify({
							kind: 'Root ResolveLive',
							source: part.source,
							definitionIndex: part.resolver.definitionIndex,
							publisherName: part.publisherName,
							entityType: collection.entityType,
							parentSelectorKey: equivalentParentSelectorKey,
						}))))
							continue

						if (context.startedLiveScopes.has(scope))
						continue
						context.startedLiveScopes.add(scope)
						for (const equivalentParentSelectorKey of equivalentParentSelectorKeys)
							context.startedLiveScopes.add(stringify({
								kind: 'Root ResolveLive',
								source: part.source,
								definitionIndex: part.resolver.definitionIndex,
								publisherName: part.publisherName,
								entityType: collection.entityType,
								parentSelectorKey: equivalentParentSelectorKey,
							}))
						const abortController = new AbortController()
						context.liveSubscriptions.set(scope, {
							abortController,
						})
						void Promise.resolve(part.publisher.start({
							parentEntitySelector: candidate.entitySelector,
							queryClient: context.queryClient,
							signal: abortController.signal,
							trigger: {
								...fieldResolverSubset,
								publicEnv: context.resolverPublicEnvBySource.get(part.source) ?? {},
								fieldName: collection.fieldName,
								sources: resolverSubset.sources,
							},
							fields: fieldsForSource(part.source),
						})).then((cleanup) => {
						if (cleanup == null)
							return

						const subscription = context.liveSubscriptions.get(scope)
						if (subscription == null) {
							cleanup()
							return
						}
						subscription.cleanup = cleanup
						})
					}
				for (const part of context.resolverIndexes.resolverParts
					.filter((part) => (
						part.entityType === collection.entityType
						&& part.fieldName === collection.fieldName
						&& part.resolver.resolve[candidate.selectorName] != null
						&& (part.parentSelectors ?? Object.keys(part.resolver.resolve)).includes(candidate.selectorName)
						&& (resolverSubset.sources == null || resolverSubset.sources.includes(part.source))
						&& part.resolveLive != null
					))) {
						const scope = stringify({
							kind: 'Field ResolveLive',
							source: part.source,
							definitionIndex: part.resolver.definitionIndex,
							partIndex: part.partIndex,
							entityType: collection.entityType,
							fieldName: collection.fieldName,
						})
						if (context.activeResourceSubscriptions.size === 0)
							continue
						if (context.startedLiveScopes.has(scope))
						continue
						context.startedLiveScopes.add(scope)
						if (part.resolveLive == null)
						continue

						const fields = fieldsForSource(part.source)
						const abortController = new AbortController()
						context.liveSubscriptions.set(scope, {
							abortController,
						})
						void Promise.resolve(part.resolveLive.start({
							parentEntitySelector: candidate.entitySelector,
							queryClient: context.queryClient,
							signal: abortController.signal,
							trigger: {
								...fieldResolverSubset,
								publicEnv: context.resolverPublicEnvBySource.get(part.source) ?? {},
								fieldName: collection.fieldName,
								sources: resolverSubset.sources,
							},
							fields,
							field: fields[collection.fieldName],
						})).then((cleanup) => {
						if (cleanup == null)
							return

						const subscription = context.liveSubscriptions.get(scope)
						if (subscription == null) {
							cleanup()
							return
						}
						subscription.cleanup = cleanup
						})
					}
			}

			const parts = context.resolverIndexes.resolverParts
				.filter((part) => (
					part.entityType === collection.entityType
					&& part.fieldName === collection.fieldName
					&& part.resolver.resolve[candidate.selectorName] != null
					&& (part.parentSelectors ?? Object.keys(part.resolver.resolve)).includes(candidate.selectorName)
					&& (resolverSubset.sources == null || resolverSubset.sources.includes(part.source))
					&& (
						part.select != null
						|| (
							fieldDefinition.cardinality === EntityFieldCardinality.Zero
							&& part.resolveCount == null
							&& part.resolveLive == null
						)
					)
				))
			if (!entityFieldCardinalityIsMultiple(fieldDefinition.cardinality))
				for (const source of resolverSubset.sources ?? [
					...new Set(context.resolverIndexes.resolverDefinitionsByEntityType[collection.entityType]
						?.filter((resolver) => resolver.resolve[candidate.selectorName] != null)
						.map((resolver) => resolver.source) ?? []),
				]) {
					const value = fieldsByEntitySelectorKeyAndSource.get(stringify([
						parentSelectorKey,
						source,
					]))?.[collection.fieldName]
					if (!isProductSingleFieldValue(value))
							continue

					loadedFields.push({
						...fieldRowFieldsFromValue(value),
						fieldName: collection.fieldName,
						[EntityMetaKey.ParentSelector]: candidate.entitySelector,
						[EntityMetaKey.ParentSelectorKey]: parentSelectorKey,
						[EntityMetaKey.Source]: source,
						[EntityMetaKey.Value]: value,
						valueKey: fieldResultValueKey(value),
					})
				}
			if (parts.length === 0)
				continue

			if (fieldDefinition.when != null) {
				const condition = fieldDefinition.when
				const conditionSources = [
					...new Set([
						...(resolverSubset.sources ?? []),
						...(context.entityFieldDefinitionByEntityTypeAndName[collection.entityType]?.[condition.fieldName]?.defaultSources ?? []),
						...parts.map((part) => part.source),
						...(context.resolverIndexes.resolverDiscriminatorPartsByEntityTypeAndConditionKey[
							entityDefinition.entityType
							]?.[entityFieldConditionKey(condition)] ?? [])
							.map((part) => part.source),
					]),
				]
				let conditionValue:
						| EntityFieldSingleResolvedValue<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>
						| ResolverValue
				let conditionResolved = false
				for (const source of conditionSources) {
					conditionValue = fieldsByEntitySelectorKeyAndSource.get(stringify([
						entitySelectorKey(context.schema, entityDefinition, candidate.entitySelector),
						source,
					]))?.[condition.fieldName]
					if (Array.isArray(conditionValue))
							continue
					if (conditionValue != null) {
						conditionResolved = true
						break
					}
					if (condition.itemIndex == null) {
						const conditionFieldRow = context.entityFieldCollections[collection.entityType][condition.fieldName].toArray.find((row) => (
							row[EntityMetaKey.ParentSelectorKey] === parentSelectorKey
							&& row[EntityMetaKey.Source] === source
						))
						if (conditionFieldRow != null) {
							conditionValue = conditionFieldRow[EntityMetaKey.Value]
							conditionResolved = true
							break
						}
					}
				}
				if (conditionResolved)
					conditionValue = condition.itemIndex == null ?
						conditionValue
					:
						Array.isArray(conditionValue) ?
							conditionValue[condition.itemIndex]
						:
							undefined

				if (!conditionResolved) {
					const conditionEntitySelectorValue = fieldRowFieldsFromValue(candidate.entitySelector)[condition.fieldName]
					if (conditionEntitySelectorValue !== undefined) {
						conditionValue = conditionEntitySelectorValue
						conditionResolved = true
					}
				}

				if (!conditionResolved) {
					for (const part of context.resolverIndexes.resolverDiscriminatorPartsByEntityTypeAndConditionKey[
						entityDefinition.entityType
						]?.[entityFieldConditionKey(condition)] ?? []) {
						const selectorName = validateEntitySelector(context.schema, entityDefinition, candidate.entitySelector).name
						if (
							!(part.parentSelectors ?? Object.keys(part.resolver.resolve)).includes(selectorName)
							|| part.resolver.resolve[selectorName] == null
							|| !conditionSources.includes(part.source)
						)
							continue

						if (part.select == null)
							continue

						const value = part.select(
							await resolveSnapshot(context, part.resolver, candidate.entitySelector, selectorName, fieldResolverSubset),
							candidate.entitySelector,
							{
								...fieldResolverSubset,
								publicEnv: context.resolverPublicEnvBySource.get(part.source) ?? {},
							}
						)
						if (value != null) {
							conditionValue = condition.itemIndex == null ?
								value
							:
								Array.isArray(value) ?
									value[condition.itemIndex]
								:
									undefined
									conditionResolved = true
							break
						}
						}
					if (!conditionResolved)
						throw new Error(`${entityDefinition.entityType}.${fieldDefinition.name}: discriminator unresolved`)
				}

				if (!condition.values.some((value) => value === conditionValue)) {
					if (
						collection.kind === 'Count'
						&& entityFieldCardinalityIsMultiple(fieldDefinition.cardinality)
					) {
						for (const source of resolverSubset.sources ?? parts.map((part) => part.source)) {
							loadedCounts.push({
								[EntityMetaKey.ParentSelector]: candidate.entitySelector,
								[EntityMetaKey.ParentSelectorKey]: parentSelectorKey,
								[EntityMetaKey.Source]: source,
								[EntityMetaKey.Value]: 0,
								fieldName: collection.fieldName,
								filterKey: countCollectionFilterKey,
							})
							break
						}
					}
					continue
				}
			}

			const settledRowGroups = parts.length === 0 ?
				[]
			:
				await Promise.allSettled(
					parts.map(async (part) => {
						if (part.select == null) {
							await resolveSnapshot(context, part.resolver, candidate.entitySelector, candidate.selectorName, fieldResolverSubset)
							return {
								requestedFieldRows: [],
								fieldRows: [],
							}
						}

						const snapshot = await resolveSnapshot(context, part.resolver, candidate.entitySelector, candidate.selectorName, fieldResolverSubset)
						const fieldRows = Object.keys(part.resolver.fields).flatMap((fieldName) => {
							const fieldSelector = part.resolver.fields[fieldName]
							const siblingFieldDefinition = context.entityFieldDefinitionByEntityTypeAndName[collection.entityType]?.[fieldName]
							if (
								siblingFieldDefinition == null
								|| fieldSelector == null
								|| (
									fieldName !== collection.fieldName
									&& !entityFieldCardinalityIsMultiple(fieldDefinition.cardinality)
								)
								|| (
									siblingFieldDefinition.when != null
									&& fieldName !== collection.fieldName
								)
							)
								return []

							if (
								(
									typeof fieldSelector !== 'function'
									&& fieldSelector.select == null
								)
								|| (
									typeof fieldSelector !== 'function'
									&& fieldSelector.parentSelectors != null
									&& !fieldSelector.parentSelectors.includes(candidate.selectorName)
								)
								)
									return []

								try {
									let selectedValue: ResolverValue | ProductFieldValue<_Schema>
									if (typeof fieldSelector === 'function')
										selectedValue = fieldSelector(
											snapshot,
											candidate.entitySelector,
											{
												...fieldResolverSubset,
												publicEnv: context.resolverPublicEnvBySource.get(part.source) ?? {},
											}
										) as ResolverValue | ProductFieldValue<_Schema>
									else if (fieldSelector.select == null)
										selectedValue = fieldRowFieldsFromValue(snapshot)[siblingFieldDefinition.name]
									else
										selectedValue = fieldSelector.select(
											snapshot,
											candidate.entitySelector,
											{
												...fieldResolverSubset,
												publicEnv: context.resolverPublicEnvBySource.get(part.source) ?? {},
											}
										) as ResolverValue | ProductFieldValue<_Schema>
									const value = materializeResolverFieldValue(
										context.schema,
										siblingFieldDefinition,
										selectedValue
									)
								validateResolverFieldValue(context.schema, siblingFieldDefinition, value)

								if (Array.isArray(value))
									return value.map((rowValue) => ({
										...fieldRowFieldsFromValue(rowValue),
										fieldName: siblingFieldDefinition.name,
										[EntityMetaKey.ParentSelector]: candidate.entitySelector,
										[EntityMetaKey.ParentSelectorKey]: entitySelectorKey(context.schema, entityDefinition, candidate.entitySelector),
										[EntityMetaKey.Source]: part.source,
										[EntityMetaKey.Value]: rowValue,
										valueKey: fieldResultValueKey(rowValue),
									}))

								if (
									entityFieldCardinalityIsMultiple(siblingFieldDefinition.cardinality)
									|| siblingFieldDefinition.cardinality === EntityFieldCardinality.Zero
								)
									return []

								return [{
									...fieldRowFieldsFromValue(value),
									fieldName: siblingFieldDefinition.name,
									[EntityMetaKey.ParentSelector]: candidate.entitySelector,
									[EntityMetaKey.ParentSelectorKey]: entitySelectorKey(context.schema, entityDefinition, candidate.entitySelector),
									[EntityMetaKey.Source]: part.source,
									[EntityMetaKey.Value]: value,
									valueKey: fieldResultValueKey(value),
								}]
							} catch (error) {
								if (fieldName === collection.fieldName)
									throw error

								return []
							}
						})

						return {
							requestedFieldRows: fieldRows.filter((row) => row.fieldName === fieldDefinition.name),
							fieldRows,
						}
					})
				)
			const rowGroups = settledRowGroups.flatMap((result) => (
				result.status === 'fulfilled' ?
					[result.value]
				:
					[]
			))
			if (settledRowGroups.length > 0 && rowGroups.length === 0)
				throw new AggregateError(
					settledRowGroups.flatMap((result) => (
						result.status === 'rejected' ?
							[result.reason]
						:
							[]
					)),
					`${collection.entityType}.${collection.fieldName}: all compatible Field Facets failed`
				)
			const requestedFieldRows = rowGroups.flatMap((rowGroup) => rowGroup.requestedFieldRows)
			for (const row of rowGroups.flatMap((rowGroup) => rowGroup.fieldRows)) {
				loadedFields.push(row)
				if (row.fieldName !== fieldDefinition.name) {
					const fieldCollection = context.entityFieldCollections[collection.entityType][row.fieldName]
					try {
						fieldCollection.utils.writeUpsert(row)
					} catch (error) {
						if (error instanceof SyncNotInitializedError)
							fieldCollection.onFirstReady(() => fieldCollection.utils.writeUpsert(row))
						else
							throw error
					}
				}
			}

			if (collection.kind !== 'Count' || !entityFieldCardinalityIsMultiple(fieldDefinition.cardinality))
				continue

			const countParts = context.resolverIndexes.resolverParts
				.filter((part) => (
					part.entityType === collection.entityType
					&& part.fieldName === collection.fieldName
					&& part.resolver.resolve[candidate.selectorName] != null
					&& (part.parentSelectors ?? Object.keys(part.resolver.resolve)).includes(candidate.selectorName)
					&& (resolverSubset.sources == null || resolverSubset.sources.includes(part.source))
					&& part.resolveCount != null
				))
			const countRows = await successful(
				countParts.map(async (part) => {
					const snapshot = await resolveSnapshot(context, part.resolver, candidate.entitySelector, candidate.selectorName, fieldResolverSubset)
					const value = part.resolveCount?.(
						snapshot,
						candidate.entitySelector,
						{
							...fieldResolverSubset,
							publicEnv: context.resolverPublicEnvBySource.get(part.source) ?? {},
						}
					) ?? 0
					if (!entityFieldCardinalityIsMultiple(fieldDefinition.cardinality))
						throw new Error(`${fieldDefinition.name}: Count Facet requires multiple cardinality`)
					if (!Number.isSafeInteger(value) || value < 0)
						throw new Error(`${fieldDefinition.name}: invalid Count Facet value`)
					return {
						[EntityMetaKey.ParentSelector]: candidate.entitySelector,
						[EntityMetaKey.ParentSelectorKey]: entitySelectorKey(context.schema, entityDefinition, candidate.entitySelector),
						[EntityMetaKey.Source]: part.source,
						[EntityMetaKey.Value]: value,
						fieldName: collection.fieldName,
						filterKey: countCollectionFilterKey,
					}
				}),
				`${collection.entityType}.${collection.fieldName}: all compatible Count Facets failed`
			)
			const countCollection = context.entityFieldCountCollections[collection.entityType][collection.fieldName]
			if (countCollection == null)
				throw new Error(`${collection.entityType}.${collection.fieldName}: missing count collection`)

			for (const row of [
				...countRows,
				...(countRows.length > 0
				|| parts.length === 0
				|| resolverSubset.pagination.limit != null
				|| resolverSubset.pagination.offset != null
				|| resolverSubset.pagination.cursor != null
				|| settledRowGroups.some((result) => result.status === 'rejected')
				|| parts.some((part) => part.partial === true)
				|| (resolverSubset.sources?.length ?? parts.length) !== 1 ?
					[]
				:
					[{
						[EntityMetaKey.ParentSelector]: candidate.entitySelector,
						[EntityMetaKey.ParentSelectorKey]: entitySelectorKey(context.schema, entityDefinition, candidate.entitySelector),
							[EntityMetaKey.Source]: parts[0].source,
							[EntityMetaKey.Value]: requestedFieldRows.length,
							fieldName: collection.fieldName,
							filterKey: countCollectionFilterKey,
						}]),
			]) {
				loadedCounts.push(row)
			}
		}
	}
	return {
		entities: loadedEntities,
		fields: loadedFields,
		counts: loadedCounts,
	}
}


export const createCollections = <const _Schema extends Schema>({
	schema: inputSchema,
	entityDefinitionByType,
	entityFieldDefinitionByEntityTypeAndName,
	resolverIndexes,
	resolverPublicEnvBySource,
	queryClient,
	collectionPersistence,
	schemaVersion,
}: {
	schema: _Schema
	entityDefinitionByType: EntityDefinitionByType<_Schema>
	entityFieldDefinitionByEntityTypeAndName: EntityFieldDefinitionByEntityTypeAndName<_Schema>
	resolverIndexes: ResolverIndexes<_Schema>
	resolverPublicEnvBySource: ReadonlyMap<string, Record<string, string>>
	queryClient: QueryClient
	collectionPersistence: PersistedCollectionPersistence
	schemaVersion: number
}): EntityCollectionsContext<_Schema> => {
	const context: EntityCollectionsContext<_Schema> = {
		schema: inputSchema,
		entityDefinitionByType,
		entityFieldDefinitionByEntityTypeAndName,
		loadedSubsets: createCollection(persistedCollectionOptions<
			ProductLoadedSubset,
			string
			>({
				id: 'LoadedSubset',
				getKey: (row) => stringify([
					row.collectionId,
					row.loadedKey,
				]),
				persistence: collectionPersistence,
				schemaVersion,
			})),
		entityCollections: Object.fromEntries(inputSchema.map((entityDefinition) => [
			entityDefinition.entityType,
			createCollection(persistedCollectionOptions<
				EntityCollectionItem<_Schema, EntityTypeName<_Schema>>,
				string,
				never,
				QueryCollectionUtils<
					EntityCollectionItem<_Schema, EntityTypeName<_Schema>>,
					string,
					EntityCollectionItem<_Schema, EntityTypeName<_Schema>>,
					Error
				>
				>({
					...queryCollectionOptions<
						EntityCollectionItem<_Schema, EntityTypeName<_Schema>>,
						Error,
						ProductQueryKey,
						string
						>({
							id: `Entity:${entityDefinition.entityType}`,
							queryClient,
							queryKey: (options) => {
						const normalizedOptions = fieldLoadedSubsetKey(options)
						return Object.keys(normalizedOptions).length === 0 ?
							[`Entity:${entityDefinition.entityType}`]
						:
							[
								`Entity:${entityDefinition.entityType}`,
								normalizedOptions,
							]
							},
							queryFn: async ({ meta }) => {
						const loadSubsetOptions = meta?.loadSubsetOptions ?? {}
						const collectionId = `Entity:${entityDefinition.entityType}`
						const loadedKey = stringify(fieldLoadedSubsetKey(loadSubsetOptions))
						if (!context.loadedSubsets.isReady())
							await new Promise<void>((resolve) => context.loadedSubsets.onFirstReady(resolve))

						const resolverSubset = parseResolverSubset(loadSubsetOptions)
						const hydratedRows = context.entityCollections[entityDefinition.entityType].toArray.filter((row) => (
							resolverSubset.selectorKeys.includes(row[EntityMetaKey.SelectorKey])
							&& (
								resolverSubset.sources == null
								|| resolverSubset.sources.includes(row[EntityMetaKey.Source])
							)
						))
						const loadedMarker = context.loadedSubsets.toArray.find((row) => (
							row.collectionId === collectionId
							&& row.loadedKey === loadedKey
						))
						const requestedCompatibleSources = resolverSubset.sources ?? [
							...new Set((context.resolverIndexes.resolverDefinitionsByEntityType[entityDefinition.entityType] ?? []).map((resolver) => resolver.source)),
						]
						const canUseLoadedMarker = loadedSubsetMarkerCoversRows(
							loadedMarker,
							hydratedRows,
							requestedCompatibleSources,
							true
						)
						const persistenceDecision = (
							canUseLoadedMarker ?
								hydratedRows.length === 0 ? 'loaded-marker' : 'hydrated-rows'
							:
								'remote'
						)
						recordPersistenceProbe({
							kind: 'loadSubset',
							collectionId,
							decision: persistenceDecision,
							loadedKey,
							hydratedRowCount: hydratedRows.length,
							loadedMarkerRowCount: loadedMarker?.rowCount,
							loadedMarkerSourceRowCounts: loadedMarker?.sourceRowCounts,
							at: Date.now(),
						})
						recordPersistenceProbe({
							kind: 'queryFn',
							collectionId,
							loadedKey,
							at: Date.now(),
						})
						context.events.collectionSync.push({
							collection: {
								kind: 'Entity',
								entityType: entityDefinition.entityType,
								id: `Entity:${entityDefinition.entityType}`,
							},
							key: stringify(fieldLoadedSubsetKey(loadSubsetOptions)),
						})
						if (persistenceDecision !== 'remote')
							return hydratedRows

						const resolverEventStartIndex = context.events.resolver.length
						const subset = await loadCollectionSubset(
							context,
							{
								kind: 'Entity',
								entityType: entityDefinition.entityType,
							},
							loadSubsetOptions
						)

						const rowsByKey = new Map<string, EntityCollectionItem<_Schema, EntityTypeName<_Schema>>>()
						for (const row of subset.entities.toSorted((left, right) => (
							Object.keys(left[EntityMetaKey.Fields]).length
								- Object.keys(right[EntityMetaKey.Fields]).length
						)))
							rowsByKey.set(
								context.entityCollections[entityDefinition.entityType].getKeyFromItem(row),
								row
							)
						const rows = [...rowsByKey.values()]
						const completedSources = completedSourcesFromResolverEvents(
							context,
							resolverEventStartIndex,
							rows,
							requestedCompatibleSources
						)
						const markerRows = windowProductRows(rows.filter((row) => (
							resolverSubset.selectorKeys.includes(row[EntityMetaKey.SelectorKey])
							&& (
								resolverSubset.sources == null
								|| resolverSubset.sources.includes(row[EntityMetaKey.Source])
							)
						)), resolverSubset)
						const loadedSubsetKey = stringify([
							collectionId,
							loadedKey,
						])
						const sourceRowCounts = sourceRowCountsFromRows(markerRows, completedSources)
						recordPersistenceProbe({
							kind: 'markLoaded',
							collectionId,
							loadedKey,
							rowCount: markerRows.length,
							sourceRowCounts,
							at: Date.now(),
						})
						if (context.loadedSubsets.has(loadedSubsetKey))
							await context.loadedSubsets.update(loadedSubsetKey, (row) => {
								row.rowCount = markerRows.length
								row.sourceRowCounts = sourceRowCounts
							}).isPersisted.promise
						else
							await context.loadedSubsets.insert({
								collectionId,
								loadedKey,
								rowCount: markerRows.length,
								sourceRowCounts,
							}).isPersisted.promise
						return rows
							},
							getKey: (row) => stringify([
								row[EntityMetaKey.Source],
								row[EntityMetaKey.SelectorKey],
							]),
							syncMode: 'on-demand',
							startSync: false,
							persistedGcTime: Infinity,
							staleTime: Infinity,
							retry: false,
						}),
					persistence: collectionPersistence,
					schemaVersion,
				})),
		])),
		entityFieldCollections: Object.fromEntries(inputSchema.map((entityDefinition) => [
			entityDefinition.entityType,
			Object.fromEntries(entityFieldDefinitions(entityDefinition).map((fieldDefinition) => [
				fieldDefinition.name,
				(() => {
					const collection = createCollection(persistedCollectionOptions<
						EntityFieldCollectionItem<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>,
						string,
						never,
						QueryCollectionUtils<
							EntityFieldCollectionItem<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>,
							string,
							EntityFieldCollectionItem<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>,
							Error
						>
						>({
						...queryCollectionOptions<
							EntityFieldCollectionItem<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>,
							Error,
							ProductQueryKey,
							string
							>({
								id: `Field:${entityDefinition.entityType}:${fieldDefinition.name}`,
								queryClient,
								queryKey: (options) => {
							const normalizedOptions = fieldLoadedSubsetKey(options)
							return Object.keys(normalizedOptions).length === 0 ?
								[`Field:${entityDefinition.entityType}:${fieldDefinition.name}`]
							:
								[
									`Field:${entityDefinition.entityType}:${fieldDefinition.name}`,
									normalizedOptions,
								]
								},
								queryFn: async ({ meta }) => {
							const loadSubsetOptions = meta?.loadSubsetOptions ?? {}
							const collectionId = `Field:${entityDefinition.entityType}:${fieldDefinition.name}`
							const loadedKey = stringify(fieldLoadedSubsetKey(loadSubsetOptions))
							if (!context.loadedSubsets.isReady())
								await new Promise<void>((resolve) => context.loadedSubsets.onFirstReady(resolve))

							const resolverSubset = parseResolverSubset(loadSubsetOptions)
							const hydratedRows: EntityFieldCollectionItem<
								_Schema,
								EntityTypeName<_Schema>,
								EntityFieldName<_Schema, EntityTypeName<_Schema>>
							>[] = [
								...new Map([
									...context.entityFieldCollections[entityDefinition.entityType][fieldDefinition.name].toArray.filter((row) => (
										resolverSubset.parentSelectorKeys.includes(row[EntityMetaKey.ParentSelectorKey])
										&& (
											resolverSubset.sources == null
											|| resolverSubset.sources.includes(row[EntityMetaKey.Source])
										)
									)),
									...(
										context.entityCollections[entityDefinition.entityType].toArray.flatMap((row) => {
											const value = row[EntityMetaKey.Fields][fieldDefinition.name]
											const parentSelectorKey = resolverSubset.parentSelectorKeys.find((selectorKey) => (
												selectorKey === row[EntityMetaKey.SelectorKey]
												|| entitySelectorsFromFields(
													context.schema,
													entityDefinition,
													row[EntityMetaKey.Selector],
													row[EntityMetaKey.Fields]
													).some((selector) => (
													entitySelectorKey(context.schema, entityDefinition, selector) === selectorKey
													))
											))
											if (
												value === undefined
												|| parentSelectorKey == null
												|| (
													resolverSubset.sources != null
													&& !resolverSubset.sources.includes(row[EntityMetaKey.Source])
												)
											)
												return []
											const parentSelector = row[EntityMetaKey.Selector]

											return (
												entityFieldCardinalityIsMultiple(fieldDefinition.cardinality) && Array.isArray(value) ?
													value
												:
													entityFieldCardinalityIsMultiple(fieldDefinition.cardinality) ?
														[]
													:
														fieldDefinition.cardinality === EntityFieldCardinality.Zero ?
															[]
														:
															[value]
											).map((rowValue) => ({
												...fieldRowFieldsFromValue(rowValue),
												fieldName: fieldDefinition.name,
												[EntityMetaKey.ParentSelector]: parentSelector,
												[EntityMetaKey.ParentSelectorKey]: parentSelectorKey,
												[EntityMetaKey.Source]: row[EntityMetaKey.Source],
												[EntityMetaKey.Value]: rowValue,
												valueKey: fieldResultValueKey(rowValue),
											}))
										})
									),
								].map((row) => [
									context.entityFieldCollections[entityDefinition.entityType][fieldDefinition.name].getKeyFromItem(row),
									row,
								])).values(),
							]
							const loadedMarker = context.loadedSubsets.toArray.find((row) => (
								row.collectionId === collectionId
								&& row.loadedKey === loadedKey
							))
							const requestedCompatibleSources = resolverSubset.sources ?? [
								...new Set(context.resolverIndexes.resolverParts.flatMap((resolverPart) => (
									resolverPart.entityType === entityDefinition.entityType
									&& resolverPart.fieldName === fieldDefinition.name
									&& resolverPart.select != null ?
										[resolverPart.source]
									:
										[]
								))),
							]
							const hasCompatibleLivePublisher = (
								context.resolverIndexes.resolverParts.some((resolverPart) => (
									resolverPart.entityType === entityDefinition.entityType
									&& resolverPart.fieldName === fieldDefinition.name
									&& resolverPart.resolveLive != null
									&& (
										resolverSubset.sources == null
										|| resolverSubset.sources.includes(resolverPart.source)
									)
								))
									|| Object.values(context.resolverIndexes.resolverRootLivePartsByEntityType).flat().some((resolverPart) => (
										resolverPart.entityType === entityDefinition.entityType
										&& Object.keys(resolverPart.publisher.publishes).includes(fieldDefinition.name)
										&& (
											resolverSubset.sources == null
											|| resolverSubset.sources.includes(resolverPart.source)
										)
									))
							)
							const canUseLoadedMarker = loadedSubsetMarkerCoversRows(
								loadedMarker,
								hydratedRows,
								requestedCompatibleSources,
								!hasCompatibleLivePublisher
							)
							const persistenceDecision = (
								canUseLoadedMarker ?
									hydratedRows.length === 0 ? 'loaded-marker' : 'hydrated-rows'
								:
									'remote'
							)
							recordPersistenceProbe({
								kind: 'loadSubset',
								collectionId,
								decision: persistenceDecision,
								loadedKey,
								hydratedRowCount: hydratedRows.length,
								loadedMarkerRowCount: loadedMarker?.rowCount,
								loadedMarkerSourceRowCounts: loadedMarker?.sourceRowCounts,
								at: Date.now(),
							})
							recordPersistenceProbe({
								kind: 'queryFn',
								collectionId,
								loadedKey,
								at: Date.now(),
							})
							context.events.collectionSync.push({
								collection: {
									kind: 'Field',
									entityType: entityDefinition.entityType,
									fieldName: fieldDefinition.name,
									id: `Field:${entityDefinition.entityType}:${fieldDefinition.name}`,
								},
								key: stringify(fieldLoadedSubsetKey(loadSubsetOptions)),
							})
							if (persistenceDecision !== 'remote')
								return hydratedRows

							const resolverEventStartIndex = context.events.resolver.length
							const subset = await loadCollectionSubset(
								context,
								{
									kind: 'Field',
									entityType: entityDefinition.entityType,
									fieldName: fieldDefinition.name,
								},
								loadSubsetOptions
							)
							const rows = [
								...new Map(subset.fields.filter((row) => row.fieldName === fieldDefinition.name).map((row) => [
									context.entityFieldCollections[entityDefinition.entityType][fieldDefinition.name].getKeyFromItem(row),
									row,
								])).values(),
							]
							const completedSources = completedSourcesFromResolverEvents(
								context,
								resolverEventStartIndex,
								rows,
								requestedCompatibleSources
							)
							const markerRows = windowProductRows(rows.filter((row) => (
								resolverSubset.parentSelectorKeys.includes(row[EntityMetaKey.ParentSelectorKey])
								&& (
									resolverSubset.sources == null
									|| resolverSubset.sources.includes(row[EntityMetaKey.Source])
								)
							)), resolverSubset)
							const loadedSubsetKey = stringify([
								collectionId,
								loadedKey,
							])
							const sourceRowCounts = sourceRowCountsFromRows(markerRows, completedSources)
							recordPersistenceProbe({
								kind: 'markLoaded',
								collectionId,
								loadedKey,
								rowCount: markerRows.length,
								sourceRowCounts,
								at: Date.now(),
							})
							if (context.loadedSubsets.has(loadedSubsetKey))
								await context.loadedSubsets.update(loadedSubsetKey, (row) => {
									row.rowCount = markerRows.length
									row.sourceRowCounts = sourceRowCounts
								}).isPersisted.promise
							else
								await context.loadedSubsets.insert({
									collectionId,
									loadedKey,
									rowCount: markerRows.length,
									sourceRowCounts,
								}).isPersisted.promise
							return rows
								},
								getKey: (row) => stringify([
									row[EntityMetaKey.Source],
									row[EntityMetaKey.ParentSelectorKey],
									row.valueKey,
								]),
								syncMode: 'on-demand',
								startSync: false,
								persistedGcTime: Infinity,
								staleTime: Infinity,
								retry: false,
							}),
						persistence: collectionPersistence,
						schemaVersion,
					}))
					collection.createIndex((row) => row[EntityMetaKey.ParentSelectorKey], {
						indexType: BasicIndex,
					})
					collection.createIndex((row) => row[EntityMetaKey.Source], {
						indexType: BasicIndex,
					})
					collection.createIndex((row) => row.valueKey, {
						indexType: BasicIndex,
					})
					if (
						fieldDefinition.name === '$$notes'
						|| fieldDefinition.name === '$$thread'
						|| fieldDefinition.name === '$$activityPubNotes'
					)
						collection.createIndex((row) => row.localStatusId, {
							indexType: BasicIndex,
						})
					if (
						fieldDefinition.name === '$$posts'
						|| fieldDefinition.name === '$$thread'
					)
						collection.createIndex((row) => row.createdAt, {
							indexType: BasicIndex,
						})
					if (entityDefinition.entityType === '_Global' && fieldDefinition.name === '$$coins')
						collection.createIndex((row) => row.marketCapRank, {
							indexType: BasicIndex,
						})
					return collection
				})(),
			])),
		])),
		entityFieldCountCollections: Object.fromEntries(inputSchema.map((entityDefinition) => [
			entityDefinition.entityType,
			Object.fromEntries(entityFieldDefinitions(entityDefinition)
				.filter((fieldDefinition) => entityFieldCardinalityIsMultiple(fieldDefinition.cardinality))
				.map((fieldDefinition) => [
					fieldDefinition.name,
					(() => {
						const collection = createCollection(persistedCollectionOptions<
							EntityFieldCountCollectionItem<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>,
							string,
							never,
							QueryCollectionUtils<
								EntityFieldCountCollectionItem<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>,
								string,
								EntityFieldCountCollectionItem<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>,
								Error
							>
							>({
							...queryCollectionOptions<
								EntityFieldCountCollectionItem<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>,
								Error,
								ProductQueryKey,
								string
								>({
									id: `Count:${entityDefinition.entityType}:${fieldDefinition.name}`,
									queryClient,
									queryKey: (options) => {
								const normalizedOptions = countLoadedSubsetKey(options)
								return Object.keys(normalizedOptions).length === 0 ?
									[`Count:${entityDefinition.entityType}:${fieldDefinition.name}`]
								:
									[
										`Count:${entityDefinition.entityType}:${fieldDefinition.name}`,
										normalizedOptions,
									]
									},
									queryFn: async ({ meta }) => {
								const loadSubsetOptions = meta?.loadSubsetOptions ?? {}
								const collectionId = `Count:${entityDefinition.entityType}:${fieldDefinition.name}`
								const loadedKey = stringify(countLoadedSubsetKey(loadSubsetOptions))
								if (!context.loadedSubsets.isReady())
									await new Promise<void>((resolve) => context.loadedSubsets.onFirstReady(resolve))

								const resolverSubset = parseResolverSubset(loadSubsetOptions)
								const filterKey = resolverSubset.filters.find((filter) => filter.fieldPath[0] === 'filterKey')?.value ?? countFilterKey({})
								if (typeof filterKey !== 'string')
									throw new Error(`Count:${entityDefinition.entityType}:${fieldDefinition.name}: expected string filterKey`)

								const hydratedRows = context.entityFieldCountCollections[entityDefinition.entityType][fieldDefinition.name]?.toArray.filter((row) => (
									resolverSubset.parentSelectorKeys.includes(row[EntityMetaKey.ParentSelectorKey])
									&& row.filterKey === filterKey
									&& (
										resolverSubset.sources == null
										|| resolverSubset.sources.includes(row[EntityMetaKey.Source])
									)
								)) ?? []
								const loadedMarker = context.loadedSubsets.toArray.find((row) => (
									row.collectionId === collectionId
									&& row.loadedKey === loadedKey
								))
								const requestedCompatibleSources = resolverSubset.sources ?? [
									...new Set(context.resolverIndexes.resolverParts.flatMap((resolverPart) => (
										resolverPart.entityType === entityDefinition.entityType
										&& resolverPart.fieldName === fieldDefinition.name
										&& (
											resolverPart.resolveCount != null
											|| resolverPart.select != null
										) ?
											[resolverPart.source]
										:
											[]
									))),
								]
								const canUseLoadedMarker = loadedSubsetMarkerCoversRows(
									loadedMarker,
									hydratedRows,
									requestedCompatibleSources,
									true
								)
								const persistenceDecision = (
									canUseLoadedMarker ?
										hydratedRows.length === 0 ? 'loaded-marker' : 'hydrated-rows'
									:
										'remote'
								)
								recordPersistenceProbe({
									kind: 'loadSubset',
									collectionId,
									decision: persistenceDecision,
									loadedKey,
									hydratedRowCount: hydratedRows.length,
									loadedMarkerRowCount: loadedMarker?.rowCount,
									loadedMarkerSourceRowCounts: loadedMarker?.sourceRowCounts,
									at: Date.now(),
								})
								recordPersistenceProbe({
									kind: 'queryFn',
									collectionId,
									loadedKey,
									at: Date.now(),
								})
								context.events.collectionSync.push({
									collection: {
										kind: 'Count',
										entityType: entityDefinition.entityType,
										fieldName: fieldDefinition.name,
										id: `Count:${entityDefinition.entityType}:${fieldDefinition.name}`,
									},
									key: stringify(countLoadedSubsetKey(loadSubsetOptions)),
								})
								if (persistenceDecision !== 'remote')
									return hydratedRows

								const resolverEventStartIndex = context.events.resolver.length
								const subset = await loadCollectionSubset(
									context,
									{
										kind: 'Count',
										entityType: entityDefinition.entityType,
										fieldName: fieldDefinition.name,
									},
									loadSubsetOptions
								)
								const rows = [
									...new Map(subset.counts.map((row) => [
										context.entityFieldCountCollections[entityDefinition.entityType][fieldDefinition.name]?.getKeyFromItem(row),
										row,
									])).values(),
								]
								const completedSources = completedSourcesFromResolverEvents(
									context,
									resolverEventStartIndex,
									rows,
									requestedCompatibleSources
								)
								const markerRows = windowProductRows(rows.filter((row) => (
									resolverSubset.parentSelectorKeys.includes(row[EntityMetaKey.ParentSelectorKey])
									&& row.filterKey === filterKey
									&& (
										resolverSubset.sources == null
										|| resolverSubset.sources.includes(row[EntityMetaKey.Source])
									)
								)), resolverSubset)
								const loadedSubsetKey = stringify([
									collectionId,
									loadedKey,
								])
								const sourceRowCounts = sourceRowCountsFromRows(markerRows, completedSources)
								recordPersistenceProbe({
									kind: 'markLoaded',
									collectionId,
									loadedKey,
									rowCount: markerRows.length,
									sourceRowCounts,
									at: Date.now(),
								})
								if (context.loadedSubsets.has(loadedSubsetKey))
									await context.loadedSubsets.update(loadedSubsetKey, (row) => {
										row.rowCount = markerRows.length
										row.sourceRowCounts = sourceRowCounts
									}).isPersisted.promise
								else
									await context.loadedSubsets.insert({
										collectionId,
										loadedKey,
										rowCount: markerRows.length,
										sourceRowCounts,
									}).isPersisted.promise
								return rows
									},
									getKey: (row) => stringify([
										row[EntityMetaKey.Source],
										row[EntityMetaKey.ParentSelectorKey],
										row.filterKey,
									]),
									syncMode: 'on-demand',
									startSync: false,
									persistedGcTime: Infinity,
									staleTime: Infinity,
									retry: false,
							}),
							persistence: collectionPersistence,
							schemaVersion,
						}))
						collection.createIndex((row) => row[EntityMetaKey.ParentSelectorKey], {
							indexType: BasicIndex,
						})
						collection.createIndex((row) => row[EntityMetaKey.Source], {
							indexType: BasicIndex,
						})
						collection.createIndex((row) => row.filterKey, {
							indexType: BasicIndex,
						})
						return collection
					})(),
				])),
		])),
		queryClient,
		resolverIndexes,
		resolverPublicEnvBySource,
		activeResourceSubscriptions: new Set(),
		startedLiveScopes: new Set<string>(),
		liveSubscriptions: new Map(),
		events: {
			collectionSync: [],
			resolver: [],
			live: [],
		},
	}
	return context
}

export const isDeclarativeFieldOrderBy = <
	_Schema extends Schema,
>(
	orderBy: LoadSubsetOptions['orderBy'] | DeclarativeOrderBy<EntityFieldCollectionItem<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>> | undefined
): orderBy is DeclarativeOrderBy<EntityFieldCollectionItem<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>> => (
	Array.isArray(orderBy)
	&& orderBy.length > 0
	&& Array.isArray(orderBy[0])
	&& typeof orderBy[0][0] === 'function'
)

export const defaultFieldOrderBySteps = <
	_Schema extends Schema,
>() => [
	[
		({ fieldRow }) => fieldRow[EntityMetaKey.Source],
		'asc',
	],
	[
		({ fieldRow }) => fieldRow[EntityMetaKey.ParentSelectorKey],
		'asc',
	],
	[
		({ fieldRow }) => fieldRow.valueKey,
		'asc',
	],
] satisfies DeclarativeOrderBy<EntityFieldCollectionItem<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>>

export const createClient = <
	const _Schema extends Schema,
	const _SourceProvider extends PropertyKey,
	const _Source extends string,
	>({
	schema,
	sourceProviders,
}: {
	schema: _Schema
	sourceProviders: readonly SourceProviderDefinition<_SourceProvider, _Source>[]
}) => {
	const {
		entityDefinitionByType,
		entityFieldDefinitionByEntityTypeAndName,
	} = indexSchema(schema)

	return ({
		resolvers,
		env,
	}: {
		resolvers: readonly SourceResolverModule<_Schema, _Source>[]
		env: Record<string, string | undefined>
	}) => {
		const {
			resolverPublicEnvBySource,
			enabledSources,
		} = indexSourceProviders(sourceProviders, env)
		const {
			resolverIndexes,
		} = indexResolvers(schema, resolvers, enabledSources)

		return ({
			queryClient,
			persistence,
			schemaVersion,
		}: {
			queryClient: QueryClient
			persistence: PersistedCollectionPersistence
			schemaVersion: number
		}) => {
			const context = createCollections({
				schema,
				entityDefinitionByType,
				entityFieldDefinitionByEntityTypeAndName,
				resolverIndexes,
				resolverPublicEnvBySource,
				queryClient,
				collectionPersistence: persistence,
				schemaVersion,
			})

			return {
				...context,
				subscribe: <
					const _EntityType extends EntityTypeName<_Schema>,
					const _Selection extends SubscribeSelection<_Schema, _EntityType>,
				>(
					entityType: _EntityType,
					entitySelector: EntitySelector<_Schema, _EntityType>,
					selection: _Selection
				) => (
					subscribeEntity(
						context,
						entityType,
						entitySelector,
						selection
					)
				),
				select: createEntityProxy(
					context,
					(entityType, entitySelector, selection) => subscribeEntity(
						context,
						entityType,
						entitySelector,
						selection
					)
				),
			}
		}
	}
}

export const client = createClient
