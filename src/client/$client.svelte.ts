import type { QueryClient } from '@tanstack/query-core'
import { BaseQueryBuilder, BasicIndex, and, createCollection, createLiveQueryCollection, eq, inArray } from '@tanstack/db'
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
	EntityIdProjection,
	entityFieldCardinalityIsMultiple,
	entityFieldConditionKey,
	entityFieldDefinitions,
	entityFieldPrimitiveValueIsValid,
	entityIdKey,
	entityIdentityIdsFromFields,
	indexSchema,
	validateEntityId,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import type { EntityFieldDefinitionByName, EntityFieldName, EntityFieldResolvedValue, EntityFieldSingleResolvedValue, EntityFieldValues, EntityId, EntityType as EntityTypeName, Schema } from '$/schema/$schema.ts'
import { countLoadedSubsetKey, fieldLoadedSubsetKey, indexResolvers, parseResolverSubset, plainLoadSubsetKeyValue } from '$/resolvers/$resolvers.ts'
import type { ResolverObject, ResolverValue, ResolveLiveFields, ResolverIndexes, SourceResolverDefinition, SourceResolverModule } from '$/resolvers/$resolvers.ts'
import { indexSourceProviders, type SourceProviderDefinition } from '$/sources/$sources.ts'

declare global {
	interface Window {
		__blockheadPersistenceProbe?: {
			kind: 'loadSubset' | 'queryFn' | 'markLoaded'
			collectionId: string
			decision?: 'hydrated-rows' | 'remote'
			loadedKey: string
			at: number
		}[]
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
	_EntityType extends EntityTypeName<_Schema>,
> = Partial<Record<string, EntityFieldSingleResolvedValue<_Schema, _EntityType, EntityFieldName<_Schema, _EntityType>>>>

type ProductQueryKey = readonly [
	collectionId: string,
] | readonly [
	collectionId: string,
	loadSubsetKey: ReturnType<typeof fieldLoadedSubsetKey> | ReturnType<typeof countLoadedSubsetKey>,
]

export type EntityCollectionItem<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
> = {
	[EntityMetaKey.Id]: EntityId<_Schema, _EntityType>
	[EntityMetaKey.IdKey]: string
	[EntityMetaKey.Fields]: EntityResolvedFields<_Schema, _EntityType>
	[EntityMetaKey.Source]: string
}

export type EntityFieldCollectionItem<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
	_EntityFieldName extends EntityFieldName<_Schema, _EntityType>,
> = {
	[EntityMetaKey.ParentId]: EntityId<_Schema, _EntityType>
	[EntityMetaKey.ParentIdKey]: string
	[EntityMetaKey.Value]: EntityFieldSingleResolvedValue<_Schema, _EntityType, _EntityFieldName>
	[EntityMetaKey.Source]: string
	fieldName: _EntityFieldName
	valueKey: string
}

export type EntityFieldCountCollectionItem<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
	_EntityFieldName extends EntityFieldName<_Schema, _EntityType>,
> = {
	[EntityMetaKey.ParentId]: EntityId<_Schema, _EntityType>
	[EntityMetaKey.ParentIdKey]: string
	[EntityMetaKey.Value]: number
	[EntityMetaKey.Source]: string
	fieldName: _EntityFieldName
	filterKey: string
}

export type SubscribeFieldSelection<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
> = Omit<LoadSubsetOptions, 'orderBy'> & {
	readonly orderBy?: LoadSubsetOptions['orderBy'] | DeclarativeOrderBy<EntityFieldCollectionItem<
		_Schema,
		_EntityType,
		EntityFieldName<_Schema, _EntityType>
	>>
	readonly sources?: readonly string[]
	readonly count?: boolean
	readonly fields?: SubscribeSelectedFields<_Schema, EntityTypeName<_Schema>>
	readonly identitySources?: readonly string[]
}

export type SubscribeSelectedFields<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
> = Partial<Record<string, true | SubscribeFieldSelection<_Schema, _EntityType>>> & Partial<{
	readonly [
		_FieldName in EntityFieldName<_Schema, _EntityType>
	]: true | SubscribeFieldSelection<_Schema, _EntityType>
}>

export type SubscribeSelection<
	_Schema extends Schema = Schema,
	_EntityType extends EntityTypeName<_Schema> = EntityTypeName<_Schema>,
> = Omit<LoadSubsetOptions, 'orderBy'> & {
	readonly orderBy?: LoadSubsetOptions['orderBy'] | DeclarativeOrderBy<EntityFieldCollectionItem<
		_Schema,
		_EntityType,
		EntityFieldName<_Schema, _EntityType>
	>>
	readonly sources?: readonly string[]
	readonly fields?: SubscribeSelectedFields<_Schema, _EntityType>
}

export type SubscribeError<_Schema extends Schema = Schema> = {
	readonly selectorAddress: readonly string[]
	readonly dimension: 'entity' | 'field' | 'count' | 'nested' | 'query'
	readonly entityType: EntityTypeName<_Schema>
	readonly entityId: EntityId<_Schema, EntityTypeName<_Schema>>
	readonly fieldName?: string
	readonly message: string
}

type SubscribeFieldResult<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
	_FieldSelection,
> = (
	EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
		readonly cardinality: EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
		readonly entityType: infer _ReferencedEntityType extends EntityTypeName<_Schema>
	} ?
		{
			readonly values: readonly (
				_FieldSelection extends {
					readonly fields: SubscribeSelectedFields<_Schema, EntityTypeName<_Schema>>
				} ?
					EntityFieldSingleResolvedValue<_Schema, _EntityType, _FieldName> & SubscribeResult<_Schema, _ReferencedEntityType, {
						readonly fields: _FieldSelection['fields']
					}>
				:
					EntityFieldSingleResolvedValue<_Schema, _EntityType, _FieldName>
			)[]
			readonly totalCount?: number
		}
	: EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
		readonly cardinality: EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
	} ?
		{
			readonly values: readonly EntityFieldSingleResolvedValue<_Schema, _EntityType, _FieldName>[]
			readonly totalCount?: number
		}
	: EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
		readonly entityType: infer _ReferencedEntityType extends EntityTypeName<_Schema>
	} ?
		_FieldSelection extends {
			readonly fields: SubscribeSelectedFields<_Schema, EntityTypeName<_Schema>>
		} ?
			EntityFieldSingleResolvedValue<_Schema, _EntityType, _FieldName> & SubscribeResult<_Schema, _ReferencedEntityType, {
				readonly fields: _FieldSelection['fields']
			}>
		:
			EntityFieldResolvedValue<_Schema, _EntityType, _FieldName>
	:
		EntityFieldResolvedValue<_Schema, _EntityType, _FieldName>
)

type SubscribeResultFields<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
	_Selection extends SubscribeSelection<_Schema, _EntityType>,
> = (
	_Selection extends {
		readonly fields: infer _Fields extends SubscribeSelectedFields<_Schema, _EntityType>
	} ?
		{
			readonly [
				_FieldName in keyof _Fields & EntityFieldName<_Schema, _EntityType>
			]: SubscribeFieldResult<_Schema, _EntityType, _FieldName, NonNullable<_Fields[_FieldName]>>
		}
	:
		Partial<EntityFieldValues<_Schema, _EntityType>>
)

export type SubscribeResult<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
	_Selection extends SubscribeSelection<_Schema, _EntityType> = SubscribeSelection<_Schema, _EntityType>,
> = {
	readonly entityType: _EntityType
	readonly entityId: EntityId<_Schema, _EntityType>
	readonly fields: Partial<EntityFieldValues<_Schema, _EntityType>> & SubscribeResultFields<_Schema, _EntityType, _Selection>
	readonly errors: readonly SubscribeError<_Schema>[]
}

export type SubscribeEntityResource<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
	_Selection extends SubscribeSelection<_Schema, _EntityType> = SubscribeSelection<_Schema, _EntityType>,
> = Promise<SubscribeResult<_Schema, _EntityType, _Selection>> & {
	readonly current: SubscribeResult<_Schema, _EntityType, _Selection> | undefined
	readonly error: readonly SubscribeError<_Schema>[] | undefined
	readonly loading: boolean
	readonly ready: boolean
	subscribe: (notify: () => void) => () => void
}

type EntityLoadRequest<_Schema extends Schema = Schema> = LoadSubsetOptions & {
	readonly entityType: EntityTypeName<_Schema>
	readonly entityIds: readonly EntityId<_Schema, EntityTypeName<_Schema>>[]
	readonly sources?: readonly string[]
	readonly identitySources?: readonly string[]
}

type FieldLoadRequest<_Schema extends Schema> = EntityLoadRequest<_Schema> & {
	readonly fieldName: EntityFieldName<_Schema, EntityTypeName<_Schema>>
	readonly count?: boolean
}

export type EntityCollectionsContext<_Schema extends Schema = Schema> = {
	schema: _Schema
	entityDefinitionByType: Record<string, EntityDefinition | undefined>
	entityFieldDefinitionByEntityTypeAndName: Record<string, Record<string, EntityFieldDefinition | undefined> | undefined>
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

const fieldRowFieldsFromValue = (
	value: ResolverValue,
): ResolverObject => {
	if (value == null || typeof value !== 'object')
		return {}

	if (value instanceof Array)
		return {}

	return value
}

const fieldResultValueKey = (
	value: ResolverValue,
) => (
	value != null
	&& typeof value === 'object'
	&& !(value instanceof Array)
	&& typeof value[EntityMetaKey.IdKey] === 'string' ?
		`Entity:${stringify(value[EntityMetaKey.IdKey])}`
	:
		`Value:${stringify(value)}`
)

const materializeResolverFieldValue = <
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
>(
	entityDefinitionByType: Record<string, EntityDefinition | undefined>,
	fieldDefinition: EntityFieldDefinition,
	value: ResolverValue,
): EntityFieldSingleResolvedValue<_Schema, _EntityType, _FieldName> => {
	if (fieldDefinition.type === EntityFieldType.Primitive || value == null)
		return value as EntityFieldSingleResolvedValue<_Schema, _EntityType, _FieldName>

	const referenceEntityDefinition = entityDefinitionByType[fieldDefinition.entityType]
	if (referenceEntityDefinition == null)
		throw new Error(`${fieldDefinition.name}: missing reference entity definition`)

	if (entityFieldCardinalityIsMultiple(fieldDefinition.cardinality))
		return (value as { readonly [EntityMetaKey.Id]: EntityId<Schema, EntityTypeName<Schema>> }[]).map((item) => ({
			...item,
			[EntityMetaKey.IdKey]: entityIdKey(referenceEntityDefinition, item[EntityMetaKey.Id]),
		})) as EntityFieldSingleResolvedValue<_Schema, _EntityType, _FieldName>

	return {
		...(value as { readonly [EntityMetaKey.Id]: EntityId<Schema, EntityTypeName<Schema>> }),
		[EntityMetaKey.IdKey]: entityIdKey(
			referenceEntityDefinition,
			(value as { readonly [EntityMetaKey.Id]: EntityId<Schema, EntityTypeName<Schema>> })[EntityMetaKey.Id],
		),
	} as EntityFieldSingleResolvedValue<_Schema, _EntityType, _FieldName>
}

const countFilterKey = (
	request: LoadSubsetOptions,
) => stringify(countLoadedSubsetKey(request))

const recordPersistenceProbe = (
	event: NonNullable<Window['__blockheadPersistenceProbe']>[number],
) => {
	if (typeof window === 'undefined' || window.__blockheadPersistenceProbe == null)
		return

	window.__blockheadPersistenceProbe.push(event)
	if (window.__blockheadPersistenceProbe.length > 500)
		window.__blockheadPersistenceProbe.splice(0, window.__blockheadPersistenceProbe.length - 500)
}

const hydratedRowsMatchLoadSubset = <_Schema extends Schema>(
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
	loadSubsetOptions: LoadSubsetOptions,
) => {
	const resolverSubset = parseResolverSubset(loadSubsetOptions)
	if (collection.kind === 'Entity')
		return context.entityCollections[collection.entityType].toArray.some((row) => (
			resolverSubset.identityKeys.includes(row[EntityMetaKey.IdKey])
			&& (
				resolverSubset.sources == null
				|| resolverSubset.sources.includes(row[EntityMetaKey.Source])
			)
		))

	if (collection.kind === 'Field')
		return context.entityFieldCollections[collection.entityType][collection.fieldName].toArray.some((row) => (
			resolverSubset.parentIdentityKeys.includes(row[EntityMetaKey.ParentIdKey])
			&& (
				resolverSubset.sources == null
				|| resolverSubset.sources.includes(row[EntityMetaKey.Source])
			)
		))

	return context.entityFieldCountCollections[collection.entityType][collection.fieldName]?.toArray.some((row) => (
		resolverSubset.parentIdentityKeys.includes(row[EntityMetaKey.ParentIdKey])
		&& row.filterKey === resolverSubset.filters.find((filter) => filter.fieldPath[0] === 'filterKey')?.value
		&& (
			resolverSubset.sources == null
			|| resolverSubset.sources.includes(row[EntityMetaKey.Source])
		)
	)) === true
}

const validateResolverFieldValue = (
	entityDefinitionByType: Record<string, EntityDefinition | undefined>,
	fieldDefinition: EntityFieldDefinition,
	value: ResolverValue,
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
				|| !('__id' in item)
				|| !('__idKey' in item)
			)
				throw new Error(`${fieldDefinition.name}: invalid entity reference`)

			if (typeof item.__id !== 'object' || item.__id == null || Array.isArray(item.__id))
				throw new Error(`${fieldDefinition.name}: invalid entity reference id`)

			const entityDefinition = entityDefinitionByType[fieldDefinition.entityType]
			if (entityDefinition == null)
				throw new Error(`${fieldDefinition.name}: missing reference entity definition`)

			validateEntityId(entityDefinition, item.__id)
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
		|| !('__id' in value)
		|| !('__idKey' in value)
	)
		throw new Error(`${fieldDefinition.name}: invalid entity reference`)

	if (typeof value.__id !== 'object' || value.__id == null || Array.isArray(value.__id))
		throw new Error(`${fieldDefinition.name}: invalid entity reference id`)

	const entityDefinition = entityDefinitionByType[fieldDefinition.entityType]
	if (entityDefinition == null)
		throw new Error(`${fieldDefinition.name}: missing reference entity definition`)

	validateEntityId(entityDefinition, value.__id)
}

const resolveSnapshot = <_Schema extends Schema>(
	context: EntityCollectionsContext<_Schema>,
	resolver: SourceResolverDefinition<_Schema, string>,
	entityId: EntityId<_Schema, EntityTypeName<_Schema>>,
	selectorName: string,
	request: LoadSubsetOptions,
) => {
	const resolve = resolver.resolve[selectorName]
	if (resolve == null)
		throw new Error(`${resolver.entityType}: Resolver does not support Selector ${selectorName}`)

	const key = stringify({
		source: resolver.source,
		definitionIndex: resolver.definitionIndex,
		selectorName,
		entityId,
		loadOptions: plainLoadSubsetKeyValue({
			where: request.where,
			orderBy: request.orderBy,
			limit: request.limit,
			offset: request.offset,
			cursor: request.cursor,
		}),
	})
	return context.queryClient.fetchQuery({
		queryKey: [
			'ResolverSnapshot',
			key,
		],
		staleTime: 0,
		gcTime: 1_000,
		queryFn: async () => {
			try {
				const snapshot = await resolve(
					entityId,
					{
						...parseResolverSubset(request),
						publicEnv: context.resolverPublicEnvBySource.get(resolver.source) ?? {},
					},
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
		readonly parentIdKey: string
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
	),
) => {
	for (const query of context.queryClient.getQueryCache().getAll()) {
		if (query.queryKey[0] !== `${options.kind}:${options.entityType}:${options.fieldName}`)
			continue

		const resolverSubset = parseResolverSubset(query.meta?.loadSubsetOptions ?? {})
		const queriedCountFilters = options.kind === 'Count' ?
			parseResolverSubset(parse(String(resolverSubset.filters.find((filter) => filter.fieldPath[0] === 'filterKey')?.value ?? countFilterKey({})))).filters.filter((filter) => (
				filter.fieldPath[0] !== EntityMetaKey.ParentIdKey
				&& filter.fieldPath[0] !== EntityMetaKey.Source
			))
		:
			[]
		const selectedCountFilters = options.kind === 'Count' ?
			parseResolverSubset(options.loadOptions).filters.filter((filter) => (
				filter.fieldPath[0] !== EntityMetaKey.ParentIdKey
				&& filter.fieldPath[0] !== EntityMetaKey.Source
			))
		:
			[]
		if (
			!resolverSubset.parentIdentityKeys.includes(options.parentIdKey)
			|| (
				resolverSubset.sources != null
				&& !resolverSubset.sources.includes(options.source)
			)
			|| (
				options.kind === 'Count'
				&& stringify(queriedCountFilters) !== stringify(selectedCountFilters)
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
	message: string,
) => {
	const settled = await Promise.allSettled(values)
	const fulfilled = settled.flatMap((result) => result.status === 'fulfilled' ? [result.value] : [])
	if (settled.length > 0 && fulfilled.length === 0)
		throw new AggregateError(
			settled.flatMap((result) => result.status === 'rejected' ? [result.reason] : []),
			message,
		)
	return fulfilled
}

const resolveEntity = async <_Schema extends Schema>(
	context: EntityCollectionsContext<_Schema>,
	entityDefinition: EntityDefinition,
	entityId: EntityId<_Schema, EntityTypeName<_Schema>>,
	request: EntityLoadRequest<_Schema>,
) => {
	const selector = validateEntityId(entityDefinition, entityId)
	const resolvers = (context.resolverIndexes.resolverDefinitionsByEntityType[entityDefinition.entityType] ?? [])
		.filter((resolver) => (
			(
				resolver.resolve[selector.name] != null
				|| resolver.resolve[EntityIdProjection.Identity] != null
			)
			&& ((request.identitySources ?? request.sources) == null || (request.identitySources ?? request.sources)?.includes(resolver.source))
		))

	return successful(
		resolvers.map(async (resolver) => {
			const snapshot = await resolveSnapshot(
				context,
				resolver,
				entityId,
				resolver.resolve[selector.name] == null ?
					EntityIdProjection.Identity
				:
					selector.name,
				request,
			)
			const fields: EntityResolvedFields<_Schema, EntityTypeName<_Schema>> = {}
			for (const fieldDefinition of entityFieldDefinitions(entityDefinition)) {
				if (fieldDefinition.when != null)
					continue
				if (entityFieldCardinalityIsMultiple(fieldDefinition.cardinality))
					continue

				const part = context.resolverIndexes.resolverParts.find((candidate) => (
					candidate.resolver === resolver
					&& candidate.entityType === entityDefinition.entityType
					&& candidate.fieldName === fieldDefinition.name
					&& candidate.select != null
				))
				const snapshotFieldValue = fieldDefinition.name in resolver.fields ?
					fieldRowFieldsFromValue(snapshot)[fieldDefinition.name]
				:
					undefined
				if (
					part?.select == null
					&& snapshotFieldValue === undefined
				)
					continue
				const value = materializeResolverFieldValue(
					context.entityDefinitionByType,
					fieldDefinition,
					part?.select == null ?
						snapshotFieldValue
					:
						part.select(
							snapshot,
							entityId,
							{
								...parseResolverSubset(request),
								publicEnv: context.resolverPublicEnvBySource.get(resolver.source) ?? {},
							},
						),
				)
				validateResolverFieldValue(context.entityDefinitionByType, fieldDefinition, value)
				fields[fieldDefinition.name] = value
			}
			return [
				entityId,
				...entityIdentityIdsFromFields(entityDefinition, entityId, fields),
			].map((resolvedEntityId) => ({
				...fields,
				[EntityMetaKey.Id]: resolvedEntityId,
				[EntityMetaKey.IdKey]: entityIdKey(entityDefinition, resolvedEntityId),
				[EntityMetaKey.Fields]: fields,
				[EntityMetaKey.Source]: resolver.source,
			}))
		}),
		`${entityDefinition.entityType}: all compatible Resolver Definitions failed`,
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
	loadSubsetOptions: LoadSubsetOptions,
) => {
	const resolverSubset = parseResolverSubset(loadSubsetOptions)
	if (
		collection.kind === 'Entity'
		&& resolverSubset.identityKeys.length === 0
	)
		throw new Error(`Entity:${collection.entityType}: loadSubset requires ${EntityMetaKey.IdKey} filter`)
	if (
		collection.kind !== 'Entity'
		&& resolverSubset.parentIdentityKeys.length === 0
	)
		throw new Error(`${collection.kind}:${collection.entityType}:${collection.fieldName}: loadSubset requires ${EntityMetaKey.ParentIdKey} filter`)

	const countLoadSubsetOptions: LoadSubsetOptions | undefined = (
		collection.kind === 'Count' ?
			parse(String(resolverSubset.filters.find((filter) => filter.fieldPath[0] === 'filterKey')?.value ?? countFilterKey({})))
		:
			undefined
	)
	const fieldsByEntityIdKeyAndSource = new Map<string, EntityResolvedFields<_Schema, EntityTypeName<_Schema>>>()
	const loadedEntities: EntityCollectionItem<_Schema, EntityTypeName<_Schema>>[] = []
	const loadedFields: EntityFieldCollectionItem<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>[] = []
	const loadedCounts: EntityFieldCountCollectionItem<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>[] = []
	if (collection.kind === 'Entity') {
		const entityDefinition = context.entityDefinitionByType[collection.entityType]
		if (entityDefinition == null)
			throw new Error(`${collection.entityType}: unknown entity type`)

		const entityRequest = {
			entityType: collection.entityType,
			entityIds: resolverSubset.identityKeys.map((idKey) => {
				const entityId = entityDefinition.id(parse(idKey))
				if (entityId instanceof arktype.errors)
					throw new Error(`${collection.entityType}: invalid entity id ${idKey}`)

				return entityId
			}),
			where: loadSubsetOptions.where,
			orderBy: loadSubsetOptions.orderBy,
			limit: loadSubsetOptions.limit,
			offset: loadSubsetOptions.offset,
			cursor: loadSubsetOptions.cursor,
			sources: resolverSubset.sources,
		}
		for (const entityId of entityRequest.entityIds)
			for (const rowGroup of await resolveEntity(context, entityDefinition, entityId, entityRequest))
				for (const row of rowGroup) {
					fieldsByEntityIdKeyAndSource.set(stringify([
						row[EntityMetaKey.IdKey],
						row[EntityMetaKey.Source],
					]), row[EntityMetaKey.Fields])
					loadedEntities.push(row)
				}
	}
	if (collection.kind !== 'Entity') {
		const entityDefinition = context.entityDefinitionByType[collection.entityType]
		if (entityDefinition == null)
			throw new Error(`${collection.entityType}: unknown entity type`)

		const fieldRequest = {
			entityType: collection.entityType,
			entityIds: resolverSubset.parentIdentityKeys.map((idKey) => {
				const entityId = entityDefinition.id(parse(idKey))
				if (entityId instanceof arktype.errors)
					throw new Error(`${collection.entityType}: invalid parent entity id ${idKey}`)

				return entityId
			}),
			fieldName: collection.fieldName,
			count: collection.kind === 'Count',
			where: collection.kind === 'Count' ? countLoadSubsetOptions?.where : loadSubsetOptions.where,
			orderBy: loadSubsetOptions.orderBy,
			limit: collection.kind === 'Count' ? countLoadSubsetOptions?.limit : loadSubsetOptions.limit,
			offset: collection.kind === 'Count' ? countLoadSubsetOptions?.offset : loadSubsetOptions.offset,
			cursor: collection.kind === 'Count' ? countLoadSubsetOptions?.cursor : loadSubsetOptions.cursor,
			sources: resolverSubset.sources,
		}
		const fieldDefinition = context.entityFieldDefinitionByEntityTypeAndName[fieldRequest.entityType]?.[fieldRequest.fieldName]
		if (fieldDefinition == null)
			throw new Error(`${fieldRequest.entityType}.${fieldRequest.fieldName}: unknown field`)

		const candidates: {
			entityId: EntityId<_Schema, EntityTypeName<_Schema>>
			selectorName: string
		}[] = []
		for (const fieldRequestEntityId of fieldRequest.entityIds) {
			if (!candidates.some((candidate) => entityIdKey(entityDefinition, candidate.entityId) === entityIdKey(entityDefinition, fieldRequestEntityId)))
				candidates.push({
					entityId: fieldRequestEntityId,
					selectorName: validateEntityId(entityDefinition, fieldRequestEntityId).name,
				})
			for (const rowGroup of await resolveEntity(context, entityDefinition, fieldRequestEntityId, fieldRequest))
				for (const row of rowGroup) {
					fieldsByEntityIdKeyAndSource.set(stringify([
						row[EntityMetaKey.IdKey],
						row[EntityMetaKey.Source],
					]), row[EntityMetaKey.Fields])
					if (!candidates.some((candidate) => entityIdKey(entityDefinition, candidate.entityId) === entityIdKey(entityDefinition, row[EntityMetaKey.Id])))
						candidates.push({
							entityId: row[EntityMetaKey.Id],
							selectorName: validateEntityId(entityDefinition, row[EntityMetaKey.Id]).name,
						})
					loadedEntities.push(row)
				}
		}

		for (const candidate of candidates) {
			const parentIdKey = entityIdKey(entityDefinition, candidate.entityId)
			const replaceFieldRows = (
				source: string,
				targetFieldName: EntityFieldName<_Schema, EntityTypeName<_Schema>>,
				rows: readonly { source: string, value: EntityFieldSingleResolvedValue<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>> }[],
			) => {
				const collection = context.entityFieldCollections[fieldRequest.entityType][targetFieldName]
				const targetFieldDefinition = context.entityFieldDefinitionByEntityTypeAndName[fieldRequest.entityType]?.[targetFieldName]
				if (targetFieldDefinition == null)
					throw new Error(`${fieldRequest.entityType}.${targetFieldName}: unknown field`)
				try {
					const sources = new Set(rows.map((row) => row.source))
					if (sources.size === 0)
						sources.add(source)
					for (const row of collection.toArray) {
						if (
							row[EntityMetaKey.ParentIdKey] === parentIdKey
							&& sources.has(row[EntityMetaKey.Source])
						)
							collection.utils.writeDelete(collection.getKeyFromItem(row))
					}
					for (const row of rows) {
						const value = (
							targetFieldDefinition.type === EntityFieldType.Primitive || row.value == null ?
								row.value
							:
								entityFieldCardinalityIsMultiple(targetFieldDefinition.cardinality) ?
									materializeResolverFieldValue(
										context.entityDefinitionByType,
										targetFieldDefinition,
										[row.value],
									)[0]
							:
								materializeResolverFieldValue(
									context.entityDefinitionByType,
									targetFieldDefinition,
									row.value,
								)
						)
						try {
							validateResolverFieldValue(
								context.entityDefinitionByType,
								targetFieldDefinition,
								entityFieldCardinalityIsMultiple(targetFieldDefinition.cardinality) ?
									[value]
								:
									value,
							)
						} catch {
							continue
						}
						const fieldRow = {
							...fieldRowFieldsFromValue(value),
							fieldName: targetFieldName,
							[EntityMetaKey.ParentId]: candidate.entityId,
							[EntityMetaKey.ParentIdKey]: parentIdKey,
							[EntityMetaKey.Source]: row.source,
							[EntityMetaKey.Value]: value,
							valueKey: fieldResultValueKey(value),
						}
						loadedFields.push(fieldRow)
						collection.utils.writeUpsert(fieldRow)
					}
				} catch (error) {
					if (error instanceof SyncNotInitializedError)
						collection.onFirstReady(() => replaceFieldRows(source, targetFieldName, rows))
					else
						throw error
				}
				context.events.live.push({
					action: 'writeFieldRows',
					scope: `${source}:${fieldRequest.entityType}:${targetFieldName}`,
				})
			}
			const replaceFieldCounts = (
				source: string,
				targetFieldName: EntityFieldName<_Schema, EntityTypeName<_Schema>>,
				rows: readonly { source: string, value: number }[],
			) => {
				const countCollection = context.entityFieldCountCollections[fieldRequest.entityType][targetFieldName]
				if (countCollection == null)
					throw new Error(`${fieldRequest.entityType}.${targetFieldName}: missing count collection`)

				try {
					const filterKey = (
						parseResolverSubset(fieldRequest).filters.some((filter) => (
							filter.fieldPath[0] !== EntityMetaKey.ParentIdKey
							&& filter.fieldPath[0] !== EntityMetaKey.Source
						)) ?
							countFilterKey(fieldRequest)
						:
							countFilterKey({})
					)
					const sources = new Set(rows.map((row) => row.source))
					if (sources.size === 0)
						sources.add(source)
					for (const row of countCollection.toArray) {
						if (
							row[EntityMetaKey.ParentIdKey] === parentIdKey
							&& sources.has(row[EntityMetaKey.Source])
							&& row.filterKey === filterKey
						)
							countCollection.utils.writeDelete(countCollection.getKeyFromItem(row))
					}
					for (const row of rows) {
						const countRow = {
							[EntityMetaKey.ParentId]: candidate.entityId,
							[EntityMetaKey.ParentIdKey]: parentIdKey,
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
					entityType: fieldRequest.entityType,
					fieldName: targetFieldName,
					parentIdKey,
					source,
					loadOptions: fieldRequest,
				})
				context.events.live.push({
					action: 'writeFieldCounts',
					scope: `${source}:${fieldRequest.entityType}:${targetFieldName}`,
				})
			}
			const fieldsForSource = (source: string): ResolveLiveFields<_Schema, EntityTypeName<_Schema>> => new Proxy(Object.assign(Object.create(null), {
				invalidate: (fieldNames: readonly EntityFieldName<_Schema, EntityTypeName<_Schema>>[]) => {
					for (const fieldName of fieldNames)
						invalidateLoadedSubsets(context, {
							kind: 'Field',
							entityType: fieldRequest.entityType,
							fieldName,
							parentIdKey,
							source,
							loadOptions: fieldRequest,
						})
					context.events.live.push({ action: 'invalidateFields', scope: `root:${fieldNames.join(',')}` })
				},
			}), {
				get: (target, property) => {
					if (property === 'invalidate')
						return target.invalidate

					const liveFieldDefinition = context.entityFieldDefinitionByEntityTypeAndName[fieldRequest.entityType]?.[String(property)]
					if (liveFieldDefinition == null)
						throw new Error(`${fieldRequest.entityType}.${String(property)}: unknown live field`)
					return {
						replaceRows: (rows: readonly { source: string, value: EntityFieldSingleResolvedValue<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>> }[]) => replaceFieldRows(
							source,
							liveFieldDefinition.name,
							rows,
						),
						invalidate: () => {
							invalidateLoadedSubsets(context, {
								kind: 'Field',
								entityType: fieldRequest.entityType,
								fieldName: liveFieldDefinition.name,
								parentIdKey,
								source,
								loadOptions: fieldRequest,
							})
							context.events.live.push({ action: 'invalidateFields', scope: `root:${liveFieldDefinition.name}` })
						},
						count: {
							replaceRows: (rows: readonly { source: string, value: number }[]) => replaceFieldCounts(
								source,
								liveFieldDefinition.name,
								rows,
							),
							invalidate: () => {
								invalidateLoadedSubsets(context, {
									kind: 'Count',
									entityType: fieldRequest.entityType,
									fieldName: liveFieldDefinition.name,
									parentIdKey,
									source,
									loadOptions: fieldRequest,
								})
								context.events.live.push({ action: 'invalidateCounts', scope: `root:${liveFieldDefinition.name}` })
							},
						},
					}
				},
			})
			if (collection.kind === 'Field') {
				for (const part of (context.resolverIndexes.resolverRootLivePartsByEntityType[fieldRequest.entityType] ?? [])
					.filter((part) => (
						part.publisher.publishes[fieldRequest.fieldName] === true
						&& (fieldRequest.sources == null || fieldRequest.sources.includes(part.source))
					))) {
					const scope = stringify({
						kind: 'Root ResolveLive',
						source: part.source,
						definitionIndex: part.resolver.definitionIndex,
						publisherName: part.publisherName,
						entityType: fieldRequest.entityType,
						parentIdKey,
					})
					if (context.startedLiveScopes.has(scope))
						continue
					context.startedLiveScopes.add(scope)
					const abortController = new AbortController()
					context.liveSubscriptions.set(scope, {
						abortController,
					})
					void Promise.resolve(part.publisher.start({
						parentEntityId: candidate.entityId,
						queryClient: context.queryClient,
						signal: abortController.signal,
						trigger: {
							...parseResolverSubset(fieldRequest),
							publicEnv: context.resolverPublicEnvBySource.get(part.source) ?? {},
							fieldName: fieldRequest.fieldName,
							sources: fieldRequest.sources,
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
						part.entityType === fieldRequest.entityType
						&& part.fieldName === fieldRequest.fieldName
						&& (part.parentSelectors ?? Object.keys(part.resolver.resolve)).includes(candidate.selectorName)
						&& (fieldRequest.sources == null || fieldRequest.sources.includes(part.source))
						&& part.resolveLive != null
					))) {
					const scope = stringify({
						kind: 'Field ResolveLive',
						source: part.source,
						definitionIndex: part.resolver.definitionIndex,
						partIndex: part.partIndex,
						entityType: fieldRequest.entityType,
						fieldName: fieldRequest.fieldName,
						parentIdKey,
					})
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
						parentEntityId: candidate.entityId,
						queryClient: context.queryClient,
						signal: abortController.signal,
						trigger: {
							...parseResolverSubset(fieldRequest),
							publicEnv: context.resolverPublicEnvBySource.get(part.source) ?? {},
							fieldName: fieldRequest.fieldName,
							sources: fieldRequest.sources,
						},
						fields,
						field: fields[fieldRequest.fieldName],
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
					part.entityType === fieldRequest.entityType
					&& part.fieldName === fieldRequest.fieldName
					&& (part.parentSelectors ?? Object.keys(part.resolver.resolve)).includes(candidate.selectorName)
					&& (fieldRequest.sources == null || fieldRequest.sources.includes(part.source))
					&& part.select != null
				))
			if (fieldDefinition.when != null) {
				const condition = fieldDefinition.when
				const conditionSources = (
					context.entityFieldDefinitionByEntityTypeAndName[fieldRequest.entityType]?.[condition.fieldName]?.defaultSources
					?? fieldRequest.sources
				)
				let conditionValue: EntityFieldSingleResolvedValue<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>> | undefined
				let conditionResolved = false
				for (const source of conditionSources ?? fieldRequest.sources ?? []) {
					conditionValue = fieldsByEntityIdKeyAndSource.get(stringify([
						entityIdKey(entityDefinition, candidate.entityId),
						source,
					]))?.[condition.fieldName]
					if (conditionValue != null) {
						conditionResolved = true
						break
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
					const conditionEntityIdEntry = Object.entries(candidate.entityId).find(([fieldName]) => fieldName === condition.fieldName)
					if (conditionEntityIdEntry != null) {
						conditionValue = conditionEntityIdEntry[1]
						conditionResolved = true
					}
				}

				if (
					!conditionResolved
					&& condition.itemIndex == null
				) {
					const conditionFieldRow = context.entityFieldCollections[fieldRequest.entityType][condition.fieldName].toArray.find((row) => (
						row[EntityMetaKey.ParentIdKey] === parentIdKey
						&& (conditionSources == null || conditionSources.includes(row[EntityMetaKey.Source]))
					))
					if (conditionFieldRow != null) {
						conditionValue = conditionFieldRow[EntityMetaKey.Value]
						conditionResolved = true
					}
				}

				if (!conditionResolved) {
					for (const part of context.resolverIndexes.resolverDiscriminatorPartsByEntityTypeAndConditionKey[
						entityDefinition.entityType
					]?.[entityFieldConditionKey(condition)] ?? []) {
						const selectorName = validateEntityId(entityDefinition, candidate.entityId).name
						if (
							!(part.parentSelectors ?? Object.keys(part.resolver.resolve)).includes(selectorName)
							|| (conditionSources != null && !conditionSources.includes(part.source))
						)
							continue

						if (part.select == null)
							continue

						const value = part.select(
							await resolveSnapshot(context, part.resolver, candidate.entityId, selectorName, fieldRequest),
							candidate.entityId,
							{
								...parseResolverSubset(fieldRequest),
								publicEnv: context.resolverPublicEnvBySource.get(part.source) ?? {},
							},
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
						fieldRequest.count === true
						&& entityFieldCardinalityIsMultiple(fieldDefinition.cardinality)
					) {
						for (const source of fieldRequest.sources ?? parts.map((part) => part.source)) {
							loadedCounts.push({
								[EntityMetaKey.ParentId]: candidate.entityId,
								[EntityMetaKey.ParentIdKey]: parentIdKey,
								[EntityMetaKey.Source]: source,
								[EntityMetaKey.Value]: 0,
								fieldName: fieldRequest.fieldName,
								filterKey: countFilterKey(fieldRequest),
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
						if (part.select == null)
							return []

						const snapshot = await resolveSnapshot(context, part.resolver, candidate.entityId, candidate.selectorName, fieldRequest)
						const value = materializeResolverFieldValue(
							context.entityDefinitionByType,
							fieldDefinition,
							part.select(
								snapshot,
								candidate.entityId,
								{
									...parseResolverSubset(fieldRequest),
									publicEnv: context.resolverPublicEnvBySource.get(part.source) ?? {},
								},
							),
						)
						validateResolverFieldValue(context.entityDefinitionByType, fieldDefinition, value)
							return (
								entityFieldCardinalityIsMultiple(fieldDefinition.cardinality) && Array.isArray(value) ?
									value
								: entityFieldCardinalityIsMultiple(fieldDefinition.cardinality) ?
									[]
								: fieldDefinition.cardinality === EntityFieldCardinality.Zero ?
									[]
								:
									[value]
							).map((rowValue) => ({
							...fieldRowFieldsFromValue(rowValue),
							fieldName: fieldRequest.fieldName,
							[EntityMetaKey.ParentId]: candidate.entityId,
							[EntityMetaKey.ParentIdKey]: entityIdKey(entityDefinition, candidate.entityId),
							[EntityMetaKey.Source]: part.source,
							[EntityMetaKey.Value]: rowValue,
							valueKey: fieldResultValueKey(rowValue),
						}))
					}),
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
					`${fieldRequest.entityType}.${fieldRequest.fieldName}: all compatible Field Facets failed`,
				)
			const loadedFieldRows = rowGroups.flat()
			for (const row of loadedFieldRows) {
				loadedFields.push(row)
			}

			if (fieldRequest.count !== true || !entityFieldCardinalityIsMultiple(fieldDefinition.cardinality))
				continue

			const countParts = context.resolverIndexes.resolverParts
				.filter((part) => (
					part.entityType === fieldRequest.entityType
					&& part.fieldName === fieldRequest.fieldName
					&& (part.parentSelectors ?? Object.keys(part.resolver.resolve)).includes(candidate.selectorName)
					&& (fieldRequest.sources == null || fieldRequest.sources.includes(part.source))
					&& part.resolveCount != null
				))
			const countRows = await successful(
				countParts.map(async (part) => {
					const snapshot = await resolveSnapshot(context, part.resolver, candidate.entityId, candidate.selectorName, fieldRequest)
					const value = part.resolveCount?.(
						snapshot,
						candidate.entityId,
						{
							...parseResolverSubset(fieldRequest),
							publicEnv: context.resolverPublicEnvBySource.get(part.source) ?? {},
						},
					) ?? 0
					if (!entityFieldCardinalityIsMultiple(fieldDefinition.cardinality))
						throw new Error(`${fieldDefinition.name}: Count Facet requires multiple cardinality`)
					if (!Number.isSafeInteger(value) || value < 0)
						throw new Error(`${fieldDefinition.name}: invalid Count Facet value`)
					return {
						[EntityMetaKey.ParentId]: candidate.entityId,
						[EntityMetaKey.ParentIdKey]: entityIdKey(entityDefinition, candidate.entityId),
						[EntityMetaKey.Source]: part.source,
						[EntityMetaKey.Value]: value,
						fieldName: fieldRequest.fieldName,
						filterKey: countFilterKey(fieldRequest),
					}
				}),
				`${fieldRequest.entityType}.${fieldRequest.fieldName}: all compatible Count Facets failed`,
			)
			const countCollection = context.entityFieldCountCollections[fieldRequest.entityType][fieldRequest.fieldName]
			if (countCollection == null)
				throw new Error(`${fieldRequest.entityType}.${fieldRequest.fieldName}: missing count collection`)

			for (const row of [
				...countRows,
				...(countRows.length > 0
				|| parts.length === 0
				|| fieldRequest.limit != null
				|| fieldRequest.offset != null
				|| fieldRequest.cursor != null
				|| settledRowGroups.some((result) => result.status === 'rejected')
				|| parts.some((part) => part.partial === true) ?
					[]
				:
					[{
						[EntityMetaKey.ParentId]: candidate.entityId,
						[EntityMetaKey.ParentIdKey]: entityIdKey(entityDefinition, candidate.entityId),
						[EntityMetaKey.Source]: parts[0].source,
						[EntityMetaKey.Value]: loadedFieldRows.length,
						fieldName: fieldRequest.fieldName,
						filterKey: countFilterKey(fieldRequest),
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
	entityDefinitionByType: Record<string, EntityDefinition | undefined>
	entityFieldDefinitionByEntityTypeAndName: Record<string, Record<string, EntityFieldDefinition | undefined> | undefined>
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
		entityCollections: Object.fromEntries(inputSchema.map((entityDefinition) => [
			entityDefinition.entityType,
			createCollection(persistedCollectionOptions<
				EntityCollectionItem<_Schema, EntityTypeName<_Schema>>,
				string,
				undefined,
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
						recordPersistenceProbe({
							kind: 'loadSubset',
							collectionId: `Entity:${entityDefinition.entityType}`,
							decision: hydratedRowsMatchLoadSubset(
								context,
								{
									kind: 'Entity',
									entityType: entityDefinition.entityType,
								},
								loadSubsetOptions,
							) ? 'hydrated-rows' : 'remote',
							loadedKey: stringify(fieldLoadedSubsetKey(loadSubsetOptions)),
							at: Date.now(),
						})
						recordPersistenceProbe({
							kind: 'queryFn',
							collectionId: `Entity:${entityDefinition.entityType}`,
							loadedKey: stringify(fieldLoadedSubsetKey(loadSubsetOptions)),
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
						const rowsByKey = new Map<string, EntityCollectionItem<_Schema, EntityTypeName<_Schema>>>()
						for (const row of (await loadCollectionSubset(
							context,
							{
								kind: 'Entity',
								entityType: entityDefinition.entityType,
							},
							loadSubsetOptions,
						)).entities.toSorted((left, right) => (
								Object.keys(left[EntityMetaKey.Fields]).length
								- Object.keys(right[EntityMetaKey.Fields]).length
						)))
							rowsByKey.set(
								context.entityCollections[entityDefinition.entityType].getKeyFromItem(row),
								row,
							)
						recordPersistenceProbe({
							kind: 'markLoaded',
							collectionId: `Entity:${entityDefinition.entityType}`,
							loadedKey: stringify(fieldLoadedSubsetKey(loadSubsetOptions)),
							at: Date.now(),
						})
						return [...rowsByKey.values()]
					},
					getKey: (row) => stringify([
						row[EntityMetaKey.Source],
						row[EntityMetaKey.IdKey],
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
				createCollection(persistedCollectionOptions<
					EntityFieldCollectionItem<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>,
					string,
					undefined,
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
							recordPersistenceProbe({
								kind: 'loadSubset',
								collectionId: `Field:${entityDefinition.entityType}:${fieldDefinition.name}`,
								decision: hydratedRowsMatchLoadSubset(
									context,
									{
										kind: 'Field',
										entityType: entityDefinition.entityType,
										fieldName: fieldDefinition.name,
									},
									loadSubsetOptions,
								) ? 'hydrated-rows' : 'remote',
								loadedKey: stringify(fieldLoadedSubsetKey(loadSubsetOptions)),
								at: Date.now(),
							})
							recordPersistenceProbe({
								kind: 'queryFn',
								collectionId: `Field:${entityDefinition.entityType}:${fieldDefinition.name}`,
								loadedKey: stringify(fieldLoadedSubsetKey(loadSubsetOptions)),
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
							const rows = [
								...new Map((await loadCollectionSubset(
									context,
									{
										kind: 'Field',
										entityType: entityDefinition.entityType,
										fieldName: fieldDefinition.name,
									},
									loadSubsetOptions,
								)).fields.map((row) => [
									context.entityFieldCollections[entityDefinition.entityType][fieldDefinition.name].getKeyFromItem(row),
									row,
								])).values(),
							]
							recordPersistenceProbe({
								kind: 'markLoaded',
								collectionId: `Field:${entityDefinition.entityType}:${fieldDefinition.name}`,
								loadedKey: stringify(fieldLoadedSubsetKey(loadSubsetOptions)),
								at: Date.now(),
							})
							return rows
						},
						getKey: (row) => stringify([
							row[EntityMetaKey.Source],
							row[EntityMetaKey.ParentIdKey],
							row.valueKey,
						]),
						autoIndex: 'eager',
						defaultIndexType: BasicIndex,
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
		])),
		entityFieldCountCollections: Object.fromEntries(inputSchema.map((entityDefinition) => [
			entityDefinition.entityType,
			Object.fromEntries(entityFieldDefinitions(entityDefinition)
				.filter((fieldDefinition) => entityFieldCardinalityIsMultiple(fieldDefinition.cardinality))
				.map((fieldDefinition) => [
					fieldDefinition.name,
					createCollection(persistedCollectionOptions<
						EntityFieldCountCollectionItem<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>,
						string,
						undefined,
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
								recordPersistenceProbe({
									kind: 'loadSubset',
									collectionId: `Count:${entityDefinition.entityType}:${fieldDefinition.name}`,
									decision: hydratedRowsMatchLoadSubset(
										context,
										{
											kind: 'Count',
											entityType: entityDefinition.entityType,
											fieldName: fieldDefinition.name,
										},
										loadSubsetOptions,
									) ? 'hydrated-rows' : 'remote',
									loadedKey: stringify(countLoadedSubsetKey(loadSubsetOptions)),
									at: Date.now(),
								})
								recordPersistenceProbe({
									kind: 'queryFn',
									collectionId: `Count:${entityDefinition.entityType}:${fieldDefinition.name}`,
									loadedKey: stringify(countLoadedSubsetKey(loadSubsetOptions)),
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
								const rows = [
									...new Map((await loadCollectionSubset(
										context,
										{
											kind: 'Count',
											entityType: entityDefinition.entityType,
											fieldName: fieldDefinition.name,
										},
										loadSubsetOptions,
									)).counts.map((row) => [
										context.entityFieldCountCollections[entityDefinition.entityType][fieldDefinition.name]?.getKeyFromItem(row),
										row,
									])).values(),
								]
								recordPersistenceProbe({
									kind: 'markLoaded',
									collectionId: `Count:${entityDefinition.entityType}:${fieldDefinition.name}`,
									loadedKey: stringify(countLoadedSubsetKey(loadSubsetOptions)),
									at: Date.now(),
								})
								return rows
							},
							getKey: (row) => stringify([
								row[EntityMetaKey.Source],
								row[EntityMetaKey.ParentIdKey],
								row.filterKey,
							]),
							autoIndex: 'eager',
							defaultIndexType: BasicIndex,
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

const isDeclarativeFieldOrderBy = <
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
>(
	orderBy: LoadSubsetOptions['orderBy'] | DeclarativeOrderBy<EntityFieldCollectionItem<_Schema, _EntityType, EntityFieldName<_Schema, _EntityType>>> | undefined,
): orderBy is DeclarativeOrderBy<EntityFieldCollectionItem<_Schema, _EntityType, EntityFieldName<_Schema, _EntityType>>> => (
	Array.isArray(orderBy)
	&& orderBy.length > 0
	&& Array.isArray(orderBy[0])
	&& typeof orderBy[0][0] === 'function'
)

const fieldOrderByIrFromSteps = <_Schema extends Schema>(
	context: EntityCollectionsContext<_Schema>,
	entityType: EntityTypeName<_Schema>,
	fieldName: EntityFieldName<_Schema, EntityTypeName<_Schema>>,
	orderBy: DeclarativeOrderBy<EntityFieldCollectionItem<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>>,
): LoadSubsetOptions['orderBy'] => {
	let builder = new BaseQueryBuilder()
		.from({
			fieldRow: context.entityFieldCollections[entityType][fieldName],
		})
	for (const step of orderBy)
		builder = (
			step[1] === undefined ?
				builder.orderBy(step[0])
			:
				builder.orderBy(
					step[0],
					step[1],
				)
		)

	return (builder as Pick<BaseQueryBuilder, '_getQuery'>)._getQuery().orderBy ?? []
}

const defaultFieldOrderBySteps = <_Schema extends Schema>() => [
	[
		({ fieldRow }) => fieldRow[EntityMetaKey.Source],
		'asc',
	],
	[
		({ fieldRow }) => fieldRow[EntityMetaKey.ParentIdKey],
		'asc',
	],
	[
		({ fieldRow }) => fieldRow.valueKey,
		'asc',
	],
] satisfies DeclarativeOrderBy<EntityFieldCollectionItem<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>>

type ProjectionFieldQuery<_Schema extends Schema> = {
	readonly fieldDefinition: EntityFieldDefinition
	readonly selection: SubscribeFieldSelection<_Schema, EntityTypeName<_Schema>>
	readonly sources: readonly string[]
	readonly loadOptions: LoadSubsetOptions
	readonly rows: readonly {
		readonly [EntityMetaKey.ParentIdKey]: string
		readonly [EntityMetaKey.Source]: string
		readonly [EntityMetaKey.Value]: EntityFieldSingleResolvedValue<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>
	}[]
	readonly counts: readonly {
		readonly [EntityMetaKey.ParentIdKey]: string
		readonly [EntityMetaKey.Source]: string
		readonly [EntityMetaKey.Value]: number
		readonly filterKey: string
	}[]
}

type LiveQueryRows<_Row> = {
	readonly status: string
	readonly toArray: readonly _Row[]
	subscribeChanges: (
		callback: () => void,
		options: {
			readonly includeInitialState: true
			readonly onStatusChange?: () => void
		},
	) => {
		readonly unsubscribe: () => void
	}
}

const projectSubscribeEntity = <
	const _Schema extends Schema,
	const _EntityType extends EntityTypeName<_Schema>,
	const _Selection extends SubscribeSelection<_Schema, _EntityType>,
>(
	context: EntityCollectionsContext<_Schema>,
	entityType: _EntityType,
	entityId: EntityId<_Schema, _EntityType>,
	selectedFields: SubscribeSelectedFields<_Schema, _EntityType>,
	entityRows: readonly EntityCollectionItem<_Schema, _EntityType>[],
	parentIdKeys: readonly string[],
	fieldQueries: readonly ProjectionFieldQuery<_Schema>[],
	nestedEntityResource: (
		entityType: EntityTypeName<_Schema>,
		entityId: EntityId<_Schema, EntityTypeName<_Schema>>,
		selection: SubscribeSelection<_Schema, EntityTypeName<_Schema>>,
	) => SubscribeEntityResource<_Schema, EntityTypeName<_Schema>>,
): {
	readonly pending: boolean
	readonly result: SubscribeResult<_Schema, _EntityType, _Selection>
} => {
	const errors: SubscribeError<_Schema>[] = []
	const entityDefinition = context.entityDefinitionByType[entityType]
	if (entityDefinition == null)
		throw new Error(`${entityType}: unknown entity type`)

	const relevantEntityRows = entityRows.filter((row) => (
		parentIdKeys.includes(row[EntityMetaKey.IdKey])
			|| entityIdentityIdsFromFields(
				entityDefinition,
				row[EntityMetaKey.Id],
				row[EntityMetaKey.Fields],
			).some((identityId) => parentIdKeys.includes(entityIdKey(entityDefinition, identityId)))
	))
	const fields = Object.create(null) as SubscribeResult<_Schema, _EntityType, _Selection>['fields']
	let pending = false
	for (const fieldName of Object.keys(selectedFields)) {
		const selectedField = selectedFields[fieldName]
		if (selectedField == null)
			continue

		const selectedFieldSelection: SubscribeFieldSelection<_Schema, _EntityType> = selectedField === true ? {} : selectedField
		const fieldQuery = fieldQueries.find((query) => query.fieldDefinition.name === fieldName)
		if (fieldQuery == null)
			throw new Error(`${entityType}.${fieldName}: missing selected field query`)

		const { fieldDefinition, sources } = fieldQuery
		const sourceRankBySource = new Map(sources.map((source, index) => [
			source,
			index,
		]))
		const fieldRows = fieldQuery.rows.filter((row) => {
			try {
				validateResolverFieldValue(
					context.entityDefinitionByType,
					fieldDefinition,
					entityFieldCardinalityIsMultiple(fieldDefinition.cardinality) ?
						[row[EntityMetaKey.Value]]
					:
						row[EntityMetaKey.Value],
				)
				return true
			} catch (error) {
				if (selectedFieldSelection.fields != null)
					errors.push({
						selectorAddress: [entityType, fieldName],
						dimension: 'nested',
						entityType,
						entityId,
						fieldName,
						message: `${entityType}.${fieldName}: invalid nested entity reference (${String(error)})`,
					})
				return false
			}
		})
		const bestSourceRankByValueKey = new Map<string, number>()
		for (const row of fieldRows) {
			const sourceRank = sourceRankBySource.get(row[EntityMetaKey.Source])
			if (
				sourceRank == null
				|| !parentIdKeys.includes(row[EntityMetaKey.ParentIdKey])
			)
				continue

			const rowValueKey = fieldResultValueKey(row[EntityMetaKey.Value])
			const bestSourceRank = bestSourceRankByValueKey.get(rowValueKey)
			if (bestSourceRank == null || sourceRank < bestSourceRank)
				bestSourceRankByValueKey.set(rowValueKey, sourceRank)
		}
		const rows = []
		const mergedValueKeys = new Set<string>()
		for (const row of fieldRows) {
			const rowValueKey = fieldResultValueKey(row[EntityMetaKey.Value])
			const sourceRank = sourceRankBySource.get(row[EntityMetaKey.Source])
			if (
				sourceRank == null
				|| !parentIdKeys.includes(row[EntityMetaKey.ParentIdKey])
				|| mergedValueKeys.has(rowValueKey)
				|| bestSourceRankByValueKey.get(rowValueKey) !== sourceRank
			)
				continue

			mergedValueKeys.add(rowValueKey)
			rows.push(row)
		}
		const values: EntityFieldSingleResolvedValue<_Schema, _EntityType, EntityFieldName<_Schema, _EntityType>>[] = []
		if (!entityFieldCardinalityIsMultiple(fieldDefinition.cardinality)) {
			let resolvedScalar = false
			for (const source of sources) {
				for (const row of relevantEntityRows.toReversed()) {
					if (row[EntityMetaKey.Source] !== source)
						continue

					const value = row[EntityMetaKey.Fields][fieldDefinition.name]
					if (value == null)
						continue

					values.push(value)
					resolvedScalar = true
					break
				}
				if (resolvedScalar)
					break

				for (const row of rows) {
					if (
						row[EntityMetaKey.Source] !== source
						|| row[EntityMetaKey.Value] == null
					)
						continue

					values.push(row[EntityMetaKey.Value])
					resolvedScalar = true
					break
				}
				if (resolvedScalar)
					break
			}
		} else {
			const valueKeys = new Set<string>()
			for (const row of rows) {
				const valueKey = fieldResultValueKey(row[EntityMetaKey.Value])
				if (valueKeys.has(valueKey))
					continue

				valueKeys.add(valueKey)
				values.push(row[EntityMetaKey.Value])
			}
		}
		let nestedEntities: (SubscribeResult<_Schema, EntityTypeName<_Schema>> | undefined)[] | undefined
		if (
			selectedFieldSelection.fields != null
			&& (
				fieldDefinition.type === EntityFieldType.EntityReference
				|| fieldDefinition.type === EntityFieldType.EntitiesReference
			)
		) {
			nestedEntities = values.map((value) => {
				try {
					if (typeof value !== 'object')
						throw new Error(`${entityType}.${fieldName}: invalid nested entity reference`)

					const nestedEntity = nestedEntityResource(fieldDefinition.entityType, value.__id, {
						sources: selectedFieldSelection.sources,
						fields: selectedFieldSelection.fields,
					})
					if (nestedEntity.error !== undefined) {
						for (const nestedError of nestedEntity.error) {
							errors.push({
								...nestedError,
								selectorAddress: [
									entityType,
									fieldName,
									...nestedError.selectorAddress,
								],
							})
						}
						return undefined
					}
					if (!nestedEntity.ready) {
						pending = true
						return undefined
					}
					return nestedEntity.current
				} catch (error) {
					errors.push({
						selectorAddress: [entityType, fieldName],
						dimension: 'nested',
						entityType,
						entityId,
						fieldName,
						message: String(error),
					})
					return undefined
				}
			})
		}

		if (entityFieldCardinalityIsMultiple(fieldDefinition.cardinality)) {
			let totalCount: number | undefined
			if (
				selectedFieldSelection.count === true
				&& fieldQuery.loadOptions.limit == null
				&& fieldQuery.loadOptions.offset == null
				&& fieldQuery.loadOptions.cursor == null
			) {
				const selectedFieldCountFilterKey = countFilterKey(fieldQuery.loadOptions)
				const countRows = fieldQuery.counts
				let countParentIdKeys = parentIdKeys
				if (rows.length > 0) {
					const rowParentIdKeys = new Set<string>()
					for (const row of rows)
						rowParentIdKeys.add(row[EntityMetaKey.ParentIdKey])
					countParentIdKeys = [...rowParentIdKeys]
				}
				for (const source of sources) {
					for (const parentIdKey of countParentIdKeys) {
						const row = countRows.find((countRow) => (
							countRow[EntityMetaKey.Source] === source
							&& countRow[EntityMetaKey.ParentIdKey] === parentIdKey
							&& countRow.filterKey === selectedFieldCountFilterKey
						))
						if (row != null) {
							totalCount = row[EntityMetaKey.Value]
							break
						}
					}
					if (totalCount != null)
						break
				}
			}
			Object.defineProperty(fields, fieldName, {
				value: {
					values,
					...(nestedEntities != null && {
						entities: nestedEntities.filter((nestedEntity) => nestedEntity != null),
					}),
					...(totalCount != null && {
						totalCount,
					}),
				},
				enumerable: true,
			})
			continue
		}

		Object.defineProperty(fields, fieldName, {
			value: (
				nestedEntities == null ?
					values[0]
				:
					{
						value: values[0],
						entity: nestedEntities[0],
					}
			),
			enumerable: true,
		})
	}

	return {
		pending,
		result: {
			entityType,
			entityId,
			fields,
			errors,
		},
	}
}

export const subscribeEntity = <
	const _Schema extends Schema,
	const _EntityType extends EntityTypeName<_Schema>,
	const _Selection extends SubscribeSelection<_Schema, _EntityType>,
>(
	context: EntityCollectionsContext<_Schema>,
	entityType: _EntityType,
	entityId: EntityId<_Schema, _EntityType>,
	selection: _Selection,
): SubscribeEntityResource<_Schema, _EntityType, _Selection> => {
	let current = $state<SubscribeResult<_Schema, _EntityType, _Selection> | undefined>()
	let error = $state<readonly SubscribeError<_Schema>[] | undefined>()
	let loading = $state(true)
	let started = false
	let settled = false
	let resolveReady!: (result: SubscribeResult<_Schema, _EntityType, _Selection>) => void
	let rejectReady!: (cause: readonly SubscribeError<_Schema>[]) => void
	const ready = new Promise<SubscribeResult<_Schema, _EntityType, _Selection>>((resolve, reject) => {
		resolveReady = resolve
		rejectReady = reject
	})
	const listeners = new Set<() => void>()
	const subscriptions: (() => void)[] = []
	const fieldQuerySubscriptions: (() => void)[] = []
	const nestedSubscriptions = new Map<string, () => void>()
	const nestedResources = new Map<string, SubscribeEntityResource<_Schema, EntityTypeName<_Schema>, SubscribeSelection<_Schema, EntityTypeName<_Schema>>>>()
	let resourceSubscription: symbol | undefined
	const entityDefinition = context.entityDefinitionByType[entityType]
	if (entityDefinition == null)
		throw new Error(`${entityType}: unknown entity type`)

	const selectedFields: SubscribeSelectedFields<_Schema, _EntityType> = selection.fields ?? {}
	const requestedParentIdKey = entityIdKey(entityDefinition, entityId)
	const parentIdKeys = [requestedParentIdKey]
	const entityRowsQuery = createLiveQueryCollection({
		query: (query) => {
			let builder = query
				.from({ entity: context.entityCollections[entityType] })
				.where(({ entity }) => eq(entity.__idKey, requestedParentIdKey))

			if (selection.sources != null) {
				const sources = [...selection.sources]
				builder = builder.where(({ entity }) => inArray(entity.__source, sources))
			}

			return builder.select(({ entity }) => entity)
		},
		startSync: true,
	})
	const selectedFieldQueries = Object.keys(selectedFields).flatMap((fieldName) => {
		const selectedField = selectedFields[fieldName]
		if (selectedField == null)
			return []

		const fieldDefinition = context.entityFieldDefinitionByEntityTypeAndName[entityType]?.[fieldName]
		if (fieldDefinition == null)
			throw new Error(`${entityType}.${fieldName}: unknown selected field`)

		const selectedFieldSelection: SubscribeFieldSelection<_Schema, _EntityType> = selectedField === true ? {} : selectedField
		const sources: string[] = []
		for (const source of (
			selectedFieldSelection.sources
			?? selection.sources
			?? fieldDefinition.defaultSources
			?? context.resolverIndexes.resolverParts
				.filter((part) => (
					part.entityType === entityType
					&& part.fieldName === fieldDefinition.name
					&& part.select != null
				))
				.map((part) => part.source)
		))
			if (!sources.includes(source))
				sources.push(source)
		const loadOptions: LoadSubsetOptions = {
			where: selectedFieldSelection.where,
			orderBy: (
				selectedFieldSelection.orderBy == null ?
					undefined
				: isDeclarativeFieldOrderBy<_Schema, _EntityType>(selectedFieldSelection.orderBy) ?
					fieldOrderByIrFromSteps(
						context,
						entityType,
						fieldDefinition.name,
						selectedFieldSelection.orderBy,
					)
				:
					selectedFieldSelection.orderBy
			) ?? (
				selectedFieldSelection.limit != null || selectedFieldSelection.offset != null ?
					fieldOrderByIrFromSteps(
						context,
						entityType,
						fieldDefinition.name,
						defaultFieldOrderBySteps<_Schema>(),
					)
				:
					undefined
			),
			limit: selectedFieldSelection.limit,
			offset: selectedFieldSelection.offset,
			cursor: selectedFieldSelection.cursor,
		}
		return [{
			fieldDefinition,
			selection: selectedFieldSelection,
			sources,
			loadOptions,
		}]
	})
	let fieldQueryParentIdKey = ''
	let fieldQueries: {
		readonly fieldDefinition: EntityFieldDefinition
		readonly selection: SubscribeFieldSelection<_Schema, EntityTypeName<_Schema>>
		readonly sources: readonly string[]
		readonly loadOptions: LoadSubsetOptions
		readonly rows: LiveQueryRows<ProjectionFieldQuery<_Schema>['rows'][number]>
		readonly counts?: LiveQueryRows<ProjectionFieldQuery<_Schema>['counts'][number]>
	}[] = []
	const notify = () => {
		for (const listener of listeners)
			listener()
	}
	const fail = (cause: readonly SubscribeError<_Schema>[]) => {
		loading = false
		error = cause
		if (!settled) {
			settled = true
			rejectReady(cause)
		}
		notify()
	}
	const refresh = () => {
		const hasRequestedEntityRows = entityRowsQuery.toArray.some((row) => {
			const rowParentIdKeys = entityIdentityIdsFromFields(
				entityDefinition,
				row[EntityMetaKey.Id],
				row[EntityMetaKey.Fields],
			).map((identityId) => entityIdKey(entityDefinition, identityId))
			return (
				row[EntityMetaKey.IdKey] === requestedParentIdKey
				|| rowParentIdKeys.includes(requestedParentIdKey)
			)
		})
		const collectionQueries = context.queryClient.getQueryCache().getAll()
		if (
			entityRowsQuery.status === 'error'
			&& !hasRequestedEntityRows
		) {
			fail([{
				selectorAddress: [entityType],
				dimension: 'query',
				entityType,
				entityId,
				message: `${entityType}: live query failed`,
			}])
			return
		}
		for (const fieldQuery of fieldQueries) {
			if (
				fieldQuery.rows.status === 'error'
				&& !context.entityFieldCollections[entityType][fieldQuery.fieldDefinition.name].toArray.some((row) => (
					parentIdKeys.includes(row[EntityMetaKey.ParentIdKey])
					&& fieldQuery.sources.includes(row[EntityMetaKey.Source])
				))
			) {
				fail([{
					selectorAddress: [
						entityType,
						fieldQuery.fieldDefinition.name,
					],
					dimension: 'field',
					entityType,
					entityId,
					fieldName: fieldQuery.fieldDefinition.name,
					message: `${entityType}.${fieldQuery.fieldDefinition.name}: live query failed`,
				}])
				return
			}
			if (
				fieldQuery.counts?.status === 'error'
				&& context.entityFieldCountCollections[entityType][fieldQuery.fieldDefinition.name]?.toArray.some((row) => (
					parentIdKeys.includes(row[EntityMetaKey.ParentIdKey])
					&& row.filterKey === countFilterKey(fieldQuery.loadOptions)
					&& fieldQuery.sources.includes(row[EntityMetaKey.Source])
				)) !== true
			) {
				fail([{
					selectorAddress: [
						entityType,
						fieldQuery.fieldDefinition.name,
					],
					dimension: 'count',
					entityType,
					entityId,
					fieldName: fieldQuery.fieldDefinition.name,
					message: `${entityType}.${fieldQuery.fieldDefinition.name}: count live query failed`,
				}])
				return
			}
		}
		for (const query of collectionQueries) {
			const collectionQueryName = query.queryKey[0]
			if (query.state.error == null)
				continue
			if (
				collectionQueryName === `Entity:${entityType}`
				&& !hasRequestedEntityRows
			) {
				fail([{
					selectorAddress: [entityType],
					dimension: 'query',
					entityType,
					entityId,
					message: String(query.state.error),
				}])
				return
			}
			for (const fieldQuery of fieldQueries) {
				if (
					collectionQueryName === `Field:${entityType}:${fieldQuery.fieldDefinition.name}`
					&& !context.entityFieldCollections[entityType][fieldQuery.fieldDefinition.name].toArray.some((row) => (
						parentIdKeys.includes(row[EntityMetaKey.ParentIdKey])
						&& fieldQuery.sources.includes(row[EntityMetaKey.Source])
					))
				) {
					fail([{
						selectorAddress: [
							entityType,
							fieldQuery.fieldDefinition.name,
						],
						dimension: 'field',
						entityType,
						entityId,
						fieldName: fieldQuery.fieldDefinition.name,
						message: String(query.state.error),
					}])
					return
				}
				if (
					fieldQuery.counts != null
					&& collectionQueryName === `Count:${entityType}:${fieldQuery.fieldDefinition.name}`
					&& context.entityFieldCountCollections[entityType][fieldQuery.fieldDefinition.name]?.toArray.some((row) => (
						parentIdKeys.includes(row[EntityMetaKey.ParentIdKey])
						&& row.filterKey === countFilterKey(fieldQuery.loadOptions)
						&& fieldQuery.sources.includes(row[EntityMetaKey.Source])
					)) !== true
				) {
					fail([{
						selectorAddress: [
							entityType,
							fieldQuery.fieldDefinition.name,
						],
						dimension: 'count',
						entityType,
						entityId,
						fieldName: fieldQuery.fieldDefinition.name,
						message: String(query.state.error),
					}])
					return
				}
			}
		}
		for (const row of entityRowsQuery.toArray) {
			const rowParentIdKeys = entityIdentityIdsFromFields(
				entityDefinition,
				row[EntityMetaKey.Id],
				row[EntityMetaKey.Fields],
			).map((identityId) => entityIdKey(entityDefinition, identityId))
			if (
				row[EntityMetaKey.IdKey] !== requestedParentIdKey
				&& !rowParentIdKeys.includes(requestedParentIdKey)
			)
				continue

			for (const parentIdKey of rowParentIdKeys)
				if (!parentIdKeys.includes(parentIdKey))
					parentIdKeys.push(parentIdKey)
		}
		const nextFieldQueryParentIdKey = stringify(parentIdKeys)
		if (fieldQueryParentIdKey !== nextFieldQueryParentIdKey) {
			fieldQueryParentIdKey = nextFieldQueryParentIdKey
			for (const unsubscribe of fieldQuerySubscriptions.splice(0))
				unsubscribe()
			fieldQueries = selectedFieldQueries.map((fieldQuery) => {
				const parentIdKeysForQuery = [...parentIdKeys]
				const rows = createLiveQueryCollection({
					query: (query) => {
						let builder = query
							.from({ fieldRow: context.entityFieldCollections[entityType][fieldQuery.fieldDefinition.name] })
							.where(({ fieldRow }) => inArray(fieldRow[EntityMetaKey.ParentIdKey], parentIdKeysForQuery))
							.where(({ fieldRow }) => inArray(fieldRow[EntityMetaKey.Source], [...fieldQuery.sources]))

						if (fieldQuery.loadOptions.where != null)
							builder = builder.where(() => fieldQuery.loadOptions.where!)
						for (const orderBy of (
							isDeclarativeFieldOrderBy<_Schema, _EntityType>(fieldQuery.selection.orderBy) ?
								fieldQuery.selection.orderBy
							: fieldQuery.selection.limit != null || fieldQuery.selection.offset != null ?
								defaultFieldOrderBySteps<_Schema>()
							:
								[]
						))
							builder = (
								orderBy[1] === undefined ?
									builder.orderBy(orderBy[0])
								:
									builder.orderBy(orderBy[0], orderBy[1])
							)
						if (fieldQuery.loadOptions.limit != null)
							builder = builder.limit(fieldQuery.loadOptions.limit)
						if (fieldQuery.loadOptions.offset != null)
							builder = builder.offset(fieldQuery.loadOptions.offset)

						return builder.select(({ fieldRow }) => ({
							[EntityMetaKey.ParentIdKey]: fieldRow[EntityMetaKey.ParentIdKey],
							[EntityMetaKey.Source]: fieldRow[EntityMetaKey.Source],
							[EntityMetaKey.Value]: fieldRow[EntityMetaKey.Value],
						}))
					},
					startSync: true,
				})
				const countCollection = context.entityFieldCountCollections[entityType][fieldQuery.fieldDefinition.name]
				const counts = (
					fieldQuery.selection.count === true
					&& fieldQuery.loadOptions.limit == null
					&& fieldQuery.loadOptions.offset == null
					&& fieldQuery.loadOptions.cursor == null
					&& countCollection != null ?
						createLiveQueryCollection({
							query: (query) => query
								.from({ count: countCollection })
								.where(({ count }) => inArray(count[EntityMetaKey.ParentIdKey], parentIdKeysForQuery))
								.where(({ count }) => eq(count.filterKey, countFilterKey(fieldQuery.loadOptions)))
								.where(({ count }) => inArray(count[EntityMetaKey.Source], [...fieldQuery.sources]))
								.select(({ count }) => ({
									[EntityMetaKey.ParentIdKey]: count[EntityMetaKey.ParentIdKey],
									[EntityMetaKey.Source]: count[EntityMetaKey.Source],
									[EntityMetaKey.Value]: count[EntityMetaKey.Value],
									filterKey: count.filterKey,
								})),
							startSync: true,
						})
					:
						undefined
				)
				const rowsSubscription = rows.subscribeChanges(refresh, {
					includeInitialState: true,
					onStatusChange: refresh,
				})
				fieldQuerySubscriptions.push(() => rowsSubscription.unsubscribe())
				if (counts != null) {
					const countSubscription = counts.subscribeChanges(refresh, {
						includeInitialState: true,
						onStatusChange: refresh,
					})
					fieldQuerySubscriptions.push(() => countSubscription.unsubscribe())
				}
				return {
					...fieldQuery,
					rows: {
						get status() {
							return rows.status
						},
						get toArray() {
							const projectedRows: (
								ProjectionFieldQuery<_Schema>['rows'] extends readonly (infer _Row)[] ?
									_Row[]
								:
									undefined
							) = []
							for (const row of rows.toArray)
								projectedRows.push({
									[EntityMetaKey.ParentIdKey]: row[EntityMetaKey.ParentIdKey],
									[EntityMetaKey.Source]: row[EntityMetaKey.Source],
									[EntityMetaKey.Value]: row[EntityMetaKey.Value] as EntityFieldSingleResolvedValue<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>,
								})
							return projectedRows
						},
						subscribeChanges: rows.subscribeChanges,
					},
					...(counts != null && {
						counts: {
							get status() {
								return counts.status
							},
							get toArray() {
								return counts.toArray.map((row) => ({
									[EntityMetaKey.ParentIdKey]: row[EntityMetaKey.ParentIdKey],
									[EntityMetaKey.Source]: row[EntityMetaKey.Source],
									[EntityMetaKey.Value]: row[EntityMetaKey.Value],
									filterKey: row.filterKey,
								}))
							},
							subscribeChanges: counts.subscribeChanges,
						},
					}),
				}
			})
			queueMicrotask(refresh)
			loading = true
			notify()
			return
		}
		const hasPendingCollection = (
			entityRowsQuery.status !== 'ready'
			|| (
				!hasRequestedEntityRows
				&& !collectionQueries.some((query) => (
					query.queryKey[0] === `Entity:${entityType}`
					&& query.state.status === 'success'
				))
			)
			|| fieldQueries.length !== selectedFieldQueries.length
			|| fieldQueries.some((query) => (
				!context.entityFieldCollections[entityType][query.fieldDefinition.name].toArray.some((row) => (
					parentIdKeys.includes(row[EntityMetaKey.ParentIdKey])
					&& query.sources.includes(row[EntityMetaKey.Source])
				))
				&& (
					query.rows.status !== 'ready'
					|| !collectionQueries.some((collectionQuery) => (
						collectionQuery.queryKey[0] === `Field:${entityType}:${query.fieldDefinition.name}`
						&& collectionQuery.state.status === 'success'
					))
				)
				|| (
					query.counts != null
					&& context.entityFieldCountCollections[entityType][query.fieldDefinition.name]?.toArray.some((row) => (
						parentIdKeys.includes(row[EntityMetaKey.ParentIdKey])
						&& row.filterKey === countFilterKey(query.loadOptions)
						&& query.sources.includes(row[EntityMetaKey.Source])
					)) !== true
					&& (
						query.counts.status !== 'ready'
						|| !collectionQueries.some((collectionQuery) => (
							collectionQuery.queryKey[0] === `Count:${entityType}:${query.fieldDefinition.name}`
							&& collectionQuery.state.status === 'success'
						))
					)
				)
			))
			|| collectionQueries.some((query) => (
				query.state.status !== 'success'
				&& query.state.fetchStatus === 'fetching'
				&& (
					(
						query.queryKey[0] === `Entity:${entityType}`
						&& !hasRequestedEntityRows
					)
					|| fieldQueries.some((fieldQuery) => (
						(
							query.queryKey[0] === `Field:${entityType}:${fieldQuery.fieldDefinition.name}`
							&& !context.entityFieldCollections[entityType][fieldQuery.fieldDefinition.name].toArray.some((row) => (
								parentIdKeys.includes(row[EntityMetaKey.ParentIdKey])
								&& fieldQuery.sources.includes(row[EntityMetaKey.Source])
							))
						)
						|| (
							query.queryKey[0] === `Count:${entityType}:${fieldQuery.fieldDefinition.name}`
							&& context.entityFieldCountCollections[entityType][fieldQuery.fieldDefinition.name]?.toArray.some((row) => (
								parentIdKeys.includes(row[EntityMetaKey.ParentIdKey])
								&& row.filterKey === countFilterKey(fieldQuery.loadOptions)
								&& fieldQuery.sources.includes(row[EntityMetaKey.Source])
							)) !== true
						)
					))
				)
			))
		)
		if (fieldQueries.length !== selectedFieldQueries.length) {
			loading = true
			notify()
			return
		}
		try {
			const projected = projectSubscribeEntity<_Schema, _EntityType, _Selection>(
				context,
				entityType,
				entityId,
				selectedFields,
				entityRowsQuery.toArray,
				parentIdKeys,
				fieldQueries.map<ProjectionFieldQuery<_Schema>>((fieldQuery) => ({
					fieldDefinition: fieldQuery.fieldDefinition,
					selection: fieldQuery.selection,
					sources: fieldQuery.sources,
					loadOptions: fieldQuery.loadOptions,
					rows: fieldQuery.rows.toArray,
					counts: fieldQuery.counts?.toArray ?? [],
				})),
				(nestedEntityType, nestedEntityId, nestedSelection) => {
					const key = stringify({
						entityType: nestedEntityType,
						entityId: nestedEntityId,
						selection: nestedSelection,
					})
					const existing = nestedResources.get(key)
					if (existing != null)
						return existing

					const nested = subscribeEntity(
						context,
						nestedEntityType,
						nestedEntityId,
						nestedSelection,
					)
					void nested.catch(() => {})
					nestedResources.set(key, nested)
					nestedSubscriptions.set(key, nested.subscribe(refresh))
					return nested
				},
			)
			const nextError = projected.result.errors.length > 0 ? projected.result.errors : undefined
			const nextLoading = projected.result.errors.length === 0 && (
				projected.pending
				|| hasPendingCollection
			)
			if (
				current !== undefined
				|| nextError !== undefined
				|| !nextLoading
			)
				current = projected.result
			error = nextError
			loading = nextLoading
			if (error !== undefined) {
				if (!settled) {
					settled = true
					rejectReady(error)
				}
			} else if (!loading && !settled) {
				settled = true
				resolveReady(projected.result)
			}
			notify()
		} catch (cause) {
			fail([{
				selectorAddress: [entityType],
				dimension: 'query',
				entityType,
				entityId,
				message: String(cause),
			}])
		}
	}
	const start = () => {
		if (started)
			return
		started = true
		const entityRowsSubscription = entityRowsQuery.subscribeChanges(refresh, {
			includeInitialState: true,
			onStatusChange: refresh,
		})
		subscriptions.push(() => entityRowsSubscription.unsubscribe())
		subscriptions.push(context.queryClient.getQueryCache().subscribe(refresh))
		refresh()
	}
	const startSoon = () => {
		queueMicrotask(start)
	}

	const resource: SubscribeEntityResource<_Schema, _EntityType, _Selection> = {
		then: <_Result1 = SubscribeResult<_Schema, _EntityType, _Selection>, _Result2 = void>(
			onFulfilled?: ((value: SubscribeResult<_Schema, _EntityType, _Selection>) => _Result1 | PromiseLike<_Result1>) | null,
			onRejected?: ((reason: readonly SubscribeError<_Schema>[]) => _Result2 | PromiseLike<_Result2>) | null,
		) => {
			start()
			return ready.then(onFulfilled, onRejected)
		},
		catch: <_Result = void>(
			onRejected?: ((reason: readonly SubscribeError<_Schema>[]) => _Result | PromiseLike<_Result>) | null,
		) => {
			start()
			return ready.catch(onRejected)
		},
		finally: (
			onFinally?: (() => void) | null,
		) => {
			start()
			return ready.finally(onFinally)
		},
		subscribe: (listener: () => void) => {
			const subscribed = listeners.size > 0
			start()
			if (!subscribed) {
				resourceSubscription = Symbol()
				context.activeResourceSubscriptions.add(resourceSubscription)
			}
			listeners.add(listener)
			listener()
			let active = true
			return () => {
				if (!active)
					return
				active = false
				listeners.delete(listener)
				if (listeners.size === 0) {
					for (const unsubscribe of subscriptions.splice(0))
						unsubscribe()
					for (const unsubscribe of fieldQuerySubscriptions.splice(0))
						unsubscribe()
					for (const unsubscribe of nestedSubscriptions.values())
						unsubscribe()
					nestedSubscriptions.clear()
					nestedResources.clear()
					fieldQueries = []
					fieldQueryParentIdKey = ''
					started = false
					if (resourceSubscription != null)
						context.activeResourceSubscriptions.delete(resourceSubscription)
					resourceSubscription = undefined
					if (context.activeResourceSubscriptions.size === 0) {
						for (const [scope, subscription] of context.liveSubscriptions) {
							subscription.abortController.abort()
							subscription.cleanup?.()
							context.events.live.push({
								action: 'cleanup',
								scope,
							})
						}
						context.liveSubscriptions.clear()
						context.startedLiveScopes.clear()
					}
				}
			}
		},
		get current() {
			return current
		},
		get error() {
			return error
		},
		get loading() {
			startSoon()
			return loading
		},
		get ready() {
			startSoon()
			return current !== undefined && error === undefined && loading === false
		},
		[Symbol.toStringTag]: 'RemoteResource',
	}
	return resource
}

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
			schemaVersion = 1,
		}: {
			queryClient: QueryClient
			persistence: PersistedCollectionPersistence
			schemaVersion?: number
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
					entityId: EntityId<_Schema, _EntityType>,
					selection: _Selection,
				) => (
					subscribeEntity(
						context,
						entityType,
						entityId,
						selection,
					)
				),
			}
		}
	}
}

export const client = createClient
