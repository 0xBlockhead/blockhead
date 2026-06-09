import { QueryClient } from '@tanstack/query-core'
import { createCollection, eq, inArray, queryOnce } from '@tanstack/db'
import type { Collection, LoadSubsetOptions, NonSingleResult } from '@tanstack/db'
import { parse, stringify } from 'devalue'
import { type as arktype } from 'arktype'

import {
	EntityFieldCardinality,
	EntityFieldType,
	EntityMetaKey,
	entityFieldCardinalityIsMultiple,
	entityFieldConditionKey,
	entityFieldDefinitions,
	entityIdKey,
	entityIdentityIdsFromFields,
	validateEntityId,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import type { EntityFieldDefinitionByName, EntityFieldName, EntityFieldSingleResolvedValue, EntityId, EntityType as EntityTypeName, Schema } from '$/schema/$schema.ts'
import type { ResolveLiveFields, ResolverContext, ResolverFilter, ResolverSort, SourceResolverDefinition } from '$/resolvers/$resolvers.ts'

export type EntityCollectionItem<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
> = {
	[EntityMetaKey.Id]: EntityId<_Schema, _EntityType>
	[EntityMetaKey.IdKey]: string
	[EntityMetaKey.Fields]: Record<string, unknown>
	[EntityMetaKey.Source]: string
} & Record<string, unknown>

export type EntityFieldCollectionItem<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
	_EntityFieldName extends EntityFieldName<_Schema, _EntityType>,
> = {
	[EntityMetaKey.ParentId]: EntityId<_Schema, _EntityType>
	[EntityMetaKey.ParentIdKey]: string
	[EntityMetaKey.Value]: EntityFieldSingleResolvedValue<_Schema, _EntityType, _EntityFieldName>
	[EntityMetaKey.Source]: string
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

export type CollectionQueryIr = LoadSubsetOptions & {
	readonly sources?: readonly string[]
}

type ResolverLoadSubsetOptions<_Schema extends Schema = Schema> = LoadSubsetOptions & {
	readonly resolverRequest?: CollectionQueryIrRequest<_Schema>
}

export type UseEntityFieldSelection<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
> = CollectionQueryIr & {
	readonly count?: boolean
	readonly fields?: Record<string, any>
	readonly identitySources?: readonly string[]
}

export type UseEntitySelection<
	_Schema extends Schema = Schema,
	_EntityType extends EntityTypeName<_Schema> = EntityTypeName<_Schema>,
> = CollectionQueryIr & Partial<{
	readonly fields: Record<string, any>
}> & Record<string, any>

export type UseEntityError<_Schema extends Schema = Schema> = {
	readonly selectorAddress: readonly string[]
	readonly entityType: EntityTypeName<_Schema>
	readonly entityId: EntityId<_Schema, EntityTypeName<_Schema>>
	readonly fieldName?: string
	readonly message: string
}

export type UseEntityResult<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
	_Selection extends UseEntitySelection<_Schema, _EntityType>,
> = {
	readonly entityType: _EntityType
	readonly entityId: EntityId<_Schema, _EntityType>
	readonly fields: Record<string, any>
	readonly collectionQueryIr: CollectionQueryIrRequest<_Schema>
	readonly errors: readonly UseEntityError<_Schema>[]
} & Record<string, any>

export type UseEntityResource<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
	_Selection extends UseEntitySelection<_Schema, _EntityType>,
> = Promise<UseEntityResult<_Schema, _EntityType, _Selection>> & {
	readonly collectionQueryIr: CollectionQueryIrRequest<_Schema>
	readonly requiredCollections: readonly string[]
	readonly current: UseEntityResult<_Schema, _EntityType, _Selection> | undefined
	readonly error: unknown
	readonly loading: boolean
	readonly ready: boolean
}

export type EntityLoadRequest<_Schema extends Schema = Schema> = CollectionQueryIr & {
	readonly entityType: EntityTypeName<_Schema>
	readonly entityIds: readonly EntityId<_Schema, EntityTypeName<_Schema>>[]
	readonly identitySources?: readonly string[]
}

export type FieldLoadRequest<_Schema extends Schema> = EntityLoadRequest<_Schema> & {
	readonly fieldName: EntityFieldName<_Schema, EntityTypeName<_Schema>>
	readonly count?: boolean
}

export type CollectionQueryIrRequest<_Schema extends Schema = Schema> = {
	readonly entities: readonly EntityLoadRequest<_Schema>[]
	readonly fields: readonly FieldLoadRequest<_Schema>[]
}

type ResolverPart = {
	readonly resolver: SourceResolverDefinition
	readonly partIndex: number
	readonly source: string
	readonly entityType: string
	readonly fieldName: string
	readonly parentSelectors?: readonly string[]
	readonly select?: (
		snapshot: unknown,
		entityId: EntityId<Schema, EntityTypeName<Schema>>,
		context: ResolverContext,
	) => unknown
	readonly resolveCount?: (
		snapshot: unknown,
		entityId: EntityId<Schema, EntityTypeName<Schema>>,
		context: ResolverContext,
	) => number
	readonly resolveLive?: {
		readonly start: (context: Record<string, unknown>) => void | (() => void) | Promise<void | (() => void)>
	}
	readonly partial?: boolean
}

type ResolverRootLivePart = {
	readonly resolver: SourceResolverDefinition
	readonly publisher: {
		readonly publishes: Partial<Record<string, true>>
		readonly start: any
	}
	readonly publisherName: string
	readonly source: string
	readonly entityType: string
}

export type ResolverIndexes = {
	readonly resolverDefinitionsByEntityType: Partial<Record<string, readonly SourceResolverDefinition[]>>
	readonly resolverValuePartsByEntityTypeAndFieldName: Partial<Record<string, readonly ResolverPart[]>>
	readonly resolverCountPartsByEntityTypeAndFieldName: Partial<Record<string, readonly ResolverPart[]>>
	readonly resolverLivePartsByEntityTypeAndFieldName: Partial<Record<string, readonly ResolverPart[]>>
	readonly resolverRootLivePartsByEntityType: Partial<Record<string, readonly ResolverRootLivePart[]>>
	readonly resolverDiscriminatorPartsByEntityTypeAndConditionKey: Partial<Record<string, Partial<Record<string, readonly ResolverPart[]>>>>
	readonly resolverPartsKey: (entityType: string, fieldName: string) => string
}

type ParentCandidate<_Schema extends Schema> = {
	entityId: EntityId<_Schema, EntityTypeName<_Schema>>
	selectorName: string
}

type CollectionScope<_Schema extends Schema> =
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
	resolverIndexes: ResolverIndexes
	resolverPublicEnvBySource: ReadonlyMap<string, Record<string, string>>
	persistence: {
		loadedKeys: Set<string>
		startedLiveScopes: Set<string>
	}
	liveSubscriptions: Map<string, {
		abortController: AbortController
		cleanup?: () => void
	}>
	events: {
		collectionSync: {
			collection: CollectionScope<_Schema>
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

export const entityFieldCollectionItemKey = (row: {
	[EntityMetaKey.Source]: string
	[EntityMetaKey.ParentIdKey]: string
	[EntityMetaKey.Value]: unknown
}) => [
	row[EntityMetaKey.Source],
	row[EntityMetaKey.ParentIdKey],
	stringify(row[EntityMetaKey.Value]),
].join('\x1E')

const fieldValueKey = (
	value: unknown,
) => stringify(value)

export const entityFieldCountCollectionItemKey = (row: {
	[EntityMetaKey.Source]: string
	[EntityMetaKey.ParentIdKey]: string
	filterKey: string
}) => [
	row[EntityMetaKey.Source],
	row[EntityMetaKey.ParentIdKey],
	row.filterKey,
].join('\x1E')

export const resolverContextFromSubset = (
	source: string,
	request: CollectionQueryIr,
	resolverPublicEnvBySource: ReadonlyMap<string, Record<string, string>>,
): ResolverContext => {
	const ir = collectionQueryIr(request)
	return {
		...ir,
		Filters: filtersFromWhere(request.where),
		Sorts: sortsFromOrderBy(request.orderBy),
		Pagination: {
			limit: request.limit,
			offset: request.offset,
			cursor: request.cursor,
		},
		SourceFilter: request.sources,
		IdentityFilter: idKeysFromWhere(request.where, EntityMetaKey.IdKey),
		ParentIdentityFilter: idKeysFromWhere(request.where, EntityMetaKey.ParentIdKey),
		ir,
		publicEnv: resolverPublicEnvBySource.get(source) ?? {},
	}
}

export const loadedCollectionQueryIrKey = <_Schema extends Schema>(
	kind: 'entity' | 'field' | 'count',
	request: EntityLoadRequest<_Schema>,
	entityId: EntityId<_Schema, EntityTypeName<_Schema>>,
	fieldName?: string,
) => stringify({
	kind,
	entityType: request.entityType,
	entityId,
	fieldName,
	sources: request.sources,
	identitySources: request.identitySources,
	where: plainIrValue(request.where),
	...(kind !== 'count' && {
		orderBy: plainIrValue(request.orderBy),
		limit: request.limit,
		offset: request.offset,
		cursor: plainIrValue(request.cursor),
	}),
})

export const countFilterKey = (
	request: CollectionQueryIr,
) => stringify({
	where: plainIrValue(request.where),
})

const collectionQueryIr = (
	request: CollectionQueryIr,
) => ({
	where: request.where,
	orderBy: request.orderBy,
	limit: request.limit,
	offset: request.offset,
	cursor: request.cursor,
})

const plainIrValue = (
	value: unknown,
): unknown => {
	if (value == null)
		return value
	if (Array.isArray(value))
		return value.map(plainIrValue)
	if (typeof value === 'object')
		return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, child]) => [
			key,
			plainIrValue(child),
		]))
	return value
}

const collectionQueryIrKey = (
	request: CollectionQueryIr,
) => plainIrValue(collectionQueryIr(request))

const loadSubsetOptionsForRequest = <_Schema extends Schema>(
	request: CollectionQueryIrRequest<_Schema>,
	options: CollectionQueryIr = {},
): ResolverLoadSubsetOptions<_Schema> => ({
	where: options.where,
	orderBy: options.orderBy,
	limit: options.limit,
	offset: options.offset,
	cursor: options.cursor,
	resolverRequest: request,
})

const syncCollectionSubset = async <_Schema extends Schema>(
	context: EntityCollectionsContext<_Schema>,
	collectionId: string,
	request: CollectionQueryIrRequest<_Schema>,
	options: CollectionQueryIr = {},
) => {
	const [collectionKind, entityType, fieldName] = collectionId.split(':') as [
		'Entity' | 'Field' | 'Count',
		EntityTypeName<_Schema>,
		EntityFieldName<_Schema, EntityTypeName<_Schema>> | undefined,
	]
	const collection = (
		collectionKind === 'Entity' ?
			context.entityCollections[entityType]
		: collectionKind === 'Field' ?
			context.entityFieldCollections[entityType][fieldName!]
		:
			context.entityFieldCountCollections[entityType][fieldName!]!
	)
	context.events.collectionSync.push({
		collection: {
			kind: collectionKind,
			entityType,
			...(collectionKind !== 'Entity' && {
				fieldName: fieldName!,
			}),
			id: collectionId,
		} as CollectionScope<_Schema>,
		key: JSON.stringify(collectionQueryIrKey(options)),
	})
	await loadCollectionQueryIr(context, request)
	const result = collection._sync.loadSubset(loadSubsetOptionsForRequest(request, options))
	if (result !== true)
		await result
}

type TanStackPredicate = {
	readonly type?: string
	readonly name?: string
	readonly args?: readonly unknown[]
	readonly path?: readonly string[]
	readonly value?: unknown
	readonly direction?: 'asc' | 'desc'
	readonly expression?: unknown
}

const predicateRefPath = (
	predicate: unknown,
) => (predicate as TanStackPredicate | undefined)?.path

const predicateValue = (
	predicate: unknown,
) => (predicate as TanStackPredicate | undefined)?.value

const filtersFromWhere = (
	where: unknown,
): ResolverFilter[] => {
	const predicate = where as TanStackPredicate | undefined
	if (predicate == null)
		return []
	if (predicate.type !== 'func') {
		return [{
			fieldPath: predicate.path ?? [],
			operator: 'unknown',
			value: plainIrValue(where),
		}]
	}

	const [left, right] = predicate.args ?? []
	return [{
		fieldPath: predicateRefPath(left) ?? [],
		operator: predicate.name === 'eq' || predicate.name === 'in' ? predicate.name : 'unknown',
		value: plainIrValue(predicateValue(right)),
	}]
}

const sortsFromOrderBy = (
	orderBy: unknown,
): ResolverSort[] => (
	Array.isArray(orderBy) ?
		orderBy.flatMap((sort): ResolverSort[] => {
			const sortIr = sort as TanStackPredicate
			const expression = sortIr.expression as TanStackPredicate | undefined
			const fieldPath = expression?.path ?? sortIr.path ?? []
			return fieldPath.length === 0 ?
				[]
			:
				[{
					fieldPath,
					direction: sortIr.direction === 'desc' ? 'desc' : 'asc',
				}]
		})
	:
		[]
)

const idKeysFromWhere = (
	where: unknown,
	metaKey: EntityMetaKey.IdKey | EntityMetaKey.ParentIdKey,
): string[] => {
	const predicate = where as TanStackPredicate | undefined
	if (predicate?.type !== 'func')
		return []

	const [left, right] = predicate.args ?? []
	if (predicateRefPath(left)?.[0] !== metaKey)
		return []

	if (predicate.name === 'eq') {
		const value = predicateValue(right)
		return typeof value === 'string' ? [value] : []
	}

	if (predicate.name === 'in') {
		const value = predicateValue(right)
		return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
	}

	return []
}

const entityIdsFromWhere = <_Schema extends Schema>(
	options: LoadSubsetOptions,
	metaKey: EntityMetaKey.IdKey | EntityMetaKey.ParentIdKey,
) => idKeysFromWhere(options.where, metaKey)
	.map((idKey) => parse(idKey) as EntityId<_Schema, EntityTypeName<_Schema>>)

const upsert = <_Row extends object>(
	collection: Collection<_Row, string> & NonSingleResult,
	row: _Row,
	key = collection.getKeyFromItem(row),
) => {
	if (collection.has(key))
		collection.update(key, (draft) => {
			Object.assign(draft, row)
		})
	else
		collection.insert(row)
}

const isEntityFieldDefinition = (
	value: Record<string, EntityDefinition | undefined> | EntityFieldDefinition,
): value is EntityFieldDefinition => (
	typeof value === 'object'
	&& 'name' in value
	&& 'type' in value
	&& 'cardinality' in value
)
export function validateResolverFieldValue(
	fieldDefinition: EntityFieldDefinition,
	value: unknown,
): void
export function validateResolverFieldValue(
	entityDefinitionByType: Record<string, EntityDefinition | undefined>,
	fieldDefinition: EntityFieldDefinition,
	value: unknown,
): void
export function validateResolverFieldValue(
	entityDefinitionByTypeOrFieldDefinition: Record<string, EntityDefinition | undefined> | EntityFieldDefinition,
	fieldDefinitionOrValue: EntityFieldDefinition | unknown,
	maybeValue?: unknown,
) {
	const firstArgumentIsFieldDefinition = isEntityFieldDefinition(entityDefinitionByTypeOrFieldDefinition)
	const entityDefinitionByType: Record<string, EntityDefinition | undefined> = firstArgumentIsFieldDefinition ?
		Object.create(null) as Record<string, EntityDefinition | undefined>
	:
		entityDefinitionByTypeOrFieldDefinition
	const fieldDefinition: EntityFieldDefinition = firstArgumentIsFieldDefinition ?
		entityDefinitionByTypeOrFieldDefinition
	:
		fieldDefinitionOrValue as EntityFieldDefinition
	const value = firstArgumentIsFieldDefinition ?
		fieldDefinitionOrValue
	:
		maybeValue

	if (entityFieldCardinalityIsMultiple(fieldDefinition.cardinality)) {
		if (!Array.isArray(value))
			throw new Error(`${fieldDefinition.name}: multiple field requires array`)
		for (const item of value) {
			if (fieldDefinition.type === EntityFieldType.Primitive) {
				if (fieldDefinition.primitiveType(item) instanceof arktype.errors)
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
		if (fieldDefinition.primitiveType(value) instanceof arktype.errors)
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

export const validateResolverFieldCount = (
	fieldDefinition: EntityFieldDefinition,
	value: number,
) => {
	if (!entityFieldCardinalityIsMultiple(fieldDefinition.cardinality))
		throw new Error(`${fieldDefinition.name}: Count Facet requires multiple cardinality`)
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`${fieldDefinition.name}: invalid Count Facet value`)
}

const resolveSnapshot = <_Schema extends Schema>(
	context: EntityCollectionsContext<_Schema>,
	resolver: SourceResolverDefinition,
	entityId: EntityId<_Schema, EntityTypeName<_Schema>>,
	selectorName: string,
	request: CollectionQueryIr,
) => {
	const resolve = resolver.resolve[selectorName]
	if (resolve == null)
		throw new Error(`${resolver.entityType}: Resolver does not support Selector ${selectorName}`)

	const key = stringify({
		source: resolver.source,
		definitionIndex: resolver.definitionIndex,
		selectorName,
		entityId,
		ir: collectionQueryIrKey(request),
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
					resolverContextFromSubset(resolver.source, request, context.resolverPublicEnvBySource),
				)
				context.events.resolver.push({
					source: resolver.source,
					definitionIndex: resolver.definitionIndex,
					outcome: snapshot == null ? 'empty' : 'resolved',
					key,
				})
				return snapshot
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

export const disposeResolveLive = <_Schema extends Schema>(
	context: EntityCollectionsContext<_Schema>,
) => {
	for (const [scope, subscription] of context.liveSubscriptions) {
		subscription.abortController.abort()
		subscription.cleanup?.()
		context.events.live.push({
			action: 'dispose',
			scope,
		})
	}
	context.liveSubscriptions.clear()
	context.persistence.startedLiveScopes.clear()
}

const invalidateLoadedSubsets = <_Schema extends Schema>(
	context: EntityCollectionsContext<_Schema>,
	options: {
		readonly entityType: EntityTypeName<_Schema>
		readonly fieldNames: readonly string[]
		readonly counts?: boolean
	},
) => {
	for (const key of [...context.persistence.loadedKeys]) {
		let parsed: {
			readonly kind?: string
			readonly entityType?: string
			readonly fieldName?: string
		}
		try {
			parsed = parse(key) as typeof parsed
		} catch {
			continue
		}
		if (
			parsed.entityType === options.entityType
			&& options.fieldNames.includes(parsed.fieldName ?? '')
			&& (options.counts === true ? parsed.kind === 'count' : parsed.kind === 'field')
		)
			context.persistence.loadedKeys.delete(key)
	}
	context.queryClient.removeQueries({
		predicate: (query) => {
			const key = query.queryKey[1]
			return (
				Array.isArray(query.queryKey)
				&& query.queryKey[0] === 'ResolverSnapshot'
				&& typeof key === 'string'
				&& options.fieldNames.some((fieldName) => key.includes(fieldName))
			)
		},
	})
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

const addParentCandidate = <_Schema extends Schema>(
	entityDefinition: EntityDefinition,
	candidates: ParentCandidate<_Schema>[],
	entityId: EntityId<_Schema, EntityTypeName<_Schema>>,
) => {
	const selector = validateEntityId(entityDefinition, entityId)
	if (!candidates.some((candidate) => entityIdKey(entityDefinition, candidate.entityId) === entityIdKey(entityDefinition, entityId)))
		candidates.push({
			entityId,
			selectorName: selector.name,
		})
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
			resolver.resolve[selector.name] != null
			&& ((request.identitySources ?? request.sources) == null || (request.identitySources ?? request.sources)?.includes(resolver.source))
		))

	return successful(
		resolvers.map(async (resolver) => {
			const snapshot = await resolveSnapshot(context, resolver, entityId, selector.name, request)
			const fields = Object.fromEntries(entityFieldDefinitions(entityDefinition).flatMap((fieldDefinition) => {
				if (entityFieldCardinalityIsMultiple(fieldDefinition.cardinality))
					return []
				const part = (context.resolverIndexes.resolverValuePartsByEntityTypeAndFieldName[
					context.resolverIndexes.resolverPartsKey(entityDefinition.entityType, fieldDefinition.name)
				] ?? []).find((candidate) => candidate.resolver === resolver)
				if (part?.select == null)
					return []
				const value = part.select(
					snapshot,
					entityId,
					resolverContextFromSubset(resolver.source, request, context.resolverPublicEnvBySource),
				)
				validateResolverFieldValue(context.entityDefinitionByType, fieldDefinition, value)
				return [[fieldDefinition.name, value]]
			}))
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

export const loadCollectionQueryIr = async <_Schema extends Schema>(
	context: EntityCollectionsContext<_Schema>,
	request: CollectionQueryIrRequest<_Schema>,
) => {
	const fieldsByEntityIdKey = new Map<string, Record<string, unknown>>()
	for (const entityRequest of request.entities) {

		const entityDefinition = context.entityDefinitionByType[entityRequest.entityType]
		if (entityDefinition == null)
			throw new Error(`${entityRequest.entityType}: unknown entity type`)
	
		for (const entityId of entityRequest.entityIds) {
			const key = loadedCollectionQueryIrKey('entity', entityRequest, entityId)
			if (context.persistence.loadedKeys.has(key))
				continue
			for (const rowGroup of await resolveEntity(context, entityDefinition, entityId, entityRequest))
				for (const row of rowGroup) {
					fieldsByEntityIdKey.set(row[EntityMetaKey.IdKey], row[EntityMetaKey.Fields])
					upsert(context.entityCollections[entityRequest.entityType], row)
				}
			context.persistence.loadedKeys.add(key)
		}
	
	}
	for (const fieldRequest of request.fields) {

		const entityDefinition = context.entityDefinitionByType[fieldRequest.entityType]
		if (entityDefinition == null)
			throw new Error(`${fieldRequest.entityType}: unknown entity type`)
	
		const fieldDefinition = context.entityFieldDefinitionByEntityTypeAndName[fieldRequest.entityType]?.[fieldRequest.fieldName]
		if (fieldDefinition == null)
			throw new Error(`${fieldRequest.entityType}.${fieldRequest.fieldName}: unknown field`)
	
		const candidates: ParentCandidate<_Schema>[] = []
		for (const fieldRequestEntityId of fieldRequest.entityIds) {
			addParentCandidate(entityDefinition, candidates, fieldRequestEntityId)
			for (const rowGroup of await resolveEntity(context, entityDefinition, fieldRequestEntityId, fieldRequest))
				for (const row of rowGroup) {
					fieldsByEntityIdKey.set(row[EntityMetaKey.IdKey], row[EntityMetaKey.Fields])
					addParentCandidate(entityDefinition, candidates, row[EntityMetaKey.Id])
					upsert(context.entityCollections[fieldRequest.entityType], row)
				}
		}
	
		for (const candidate of candidates) {
			const parentIdKey = entityIdKey(entityDefinition, candidate.entityId)
			const replaceFieldRows = (source: string) => (
				targetFieldName: EntityFieldName<_Schema, EntityTypeName<_Schema>>,
				rows: readonly { source: string, value: EntityFieldSingleResolvedValue<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>> }[],
			) => {
				for (const row of rows) {
					const fieldRow = {
						[EntityMetaKey.ParentId]: candidate.entityId,
						[EntityMetaKey.ParentIdKey]: parentIdKey,
						[EntityMetaKey.Source]: row.source,
						[EntityMetaKey.Value]: row.value,
						valueKey: fieldValueKey(row.value),
					}
					upsert(context.entityFieldCollections[fieldRequest.entityType][targetFieldName], fieldRow, entityFieldCollectionItemKey(fieldRow))
				}
				context.events.live.push({
					action: 'writeFieldRows',
					scope: `${source}:${fieldRequest.entityType}:${targetFieldName}`,
				})
			}
			const replaceFieldCounts = (source: string) => (
				targetFieldName: EntityFieldName<_Schema, EntityTypeName<_Schema>>,
				rows: readonly { source: string, value: number }[],
			) => {
				const countCollection = context.entityFieldCountCollections[fieldRequest.entityType][targetFieldName]
				if (countCollection == null)
					throw new Error(`${fieldRequest.entityType}.${targetFieldName}: missing count collection`)

				for (const row of rows) {
					const countRow = {
						[EntityMetaKey.ParentId]: candidate.entityId,
						[EntityMetaKey.ParentIdKey]: parentIdKey,
						[EntityMetaKey.Source]: row.source,
						[EntityMetaKey.Value]: row.value,
						fieldName: targetFieldName,
						filterKey: countFilterKey(fieldRequest),
					}
					upsert(countCollection, countRow, entityFieldCountCollectionItemKey(countRow))
				}
				context.events.live.push({
					action: 'writeFieldCounts',
					scope: `${source}:${fieldRequest.entityType}:${targetFieldName}`,
				})
			}
			const fieldsForSource = (source: string): ResolveLiveFields<_Schema, EntityTypeName<_Schema>> => new Proxy(Object.assign(Object.create(null), {
				invalidate: (fieldNames: readonly EntityFieldName<_Schema, EntityTypeName<_Schema>>[]) => {
					invalidateLoadedSubsets(context, {
						entityType: fieldRequest.entityType,
						fieldNames,
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
						replaceRows: (rows: readonly { source: string, value: EntityFieldSingleResolvedValue<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>> }[]) => replaceFieldRows(source)(liveFieldDefinition.name, rows),
						invalidate: () => {
							invalidateLoadedSubsets(context, {
								entityType: fieldRequest.entityType,
								fieldNames: [liveFieldDefinition.name],
							})
							context.events.live.push({ action: 'invalidateFields', scope: `root:${liveFieldDefinition.name}` })
						},
						count: {
							replaceRows: (rows: readonly { source: string, value: number }[]) => replaceFieldCounts(source)(liveFieldDefinition.name, rows),
							invalidate: () => {
								invalidateLoadedSubsets(context, {
									entityType: fieldRequest.entityType,
									fieldNames: [liveFieldDefinition.name],
									counts: true,
								})
								context.events.live.push({ action: 'invalidateCounts', scope: `root:${liveFieldDefinition.name}` })
							},
						},
					}
				},
			})
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
				if (context.persistence.startedLiveScopes.has(scope))
					continue
				context.persistence.startedLiveScopes.add(scope)
				const abortController = new AbortController()
				context.liveSubscriptions.set(scope, {
					abortController,
				})
				void Promise.resolve(part.publisher.start({
					parentEntityId: candidate.entityId,
					queryClient: context.queryClient,
					signal: abortController.signal,
					trigger: {
						...resolverContextFromSubset(part.source, fieldRequest, context.resolverPublicEnvBySource),
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
			for (const part of (context.resolverIndexes.resolverLivePartsByEntityTypeAndFieldName[context.resolverIndexes.resolverPartsKey(fieldRequest.entityType, fieldRequest.fieldName)] ?? [])
				.filter((part) => (
					(part.parentSelectors ?? Object.keys(part.resolver.resolve)).includes(candidate.selectorName)
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
				if (context.persistence.startedLiveScopes.has(scope))
					continue
				context.persistence.startedLiveScopes.add(scope)
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
						...resolverContextFromSubset(part.source, fieldRequest, context.resolverPublicEnvBySource),
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
	
			const valueLoadedKey = loadedCollectionQueryIrKey('field', fieldRequest, candidate.entityId, fieldRequest.fieldName)
			const countLoadedKey = loadedCollectionQueryIrKey('count', fieldRequest, candidate.entityId, fieldRequest.fieldName)
			if (context.persistence.loadedKeys.has(valueLoadedKey) && (fieldRequest.count !== true || context.persistence.loadedKeys.has(countLoadedKey)))
				continue
	
			if (fieldDefinition.when != null) {
				let conditionValue = fieldsByEntityIdKey.get(entityIdKey(entityDefinition, candidate.entityId))?.[fieldDefinition.when.fieldName]
				if (conditionValue != null)
					conditionValue = fieldDefinition.when.itemIndex == null ?
						conditionValue
					:
						Array.isArray(conditionValue) ?
							conditionValue[fieldDefinition.when.itemIndex]
						:
							undefined
				else {
					for (const part of context.resolverIndexes.resolverDiscriminatorPartsByEntityTypeAndConditionKey[
						entityDefinition.entityType
					]?.[entityFieldConditionKey(fieldDefinition.when)] ?? []) {
						const selectorName = validateEntityId(entityDefinition, candidate.entityId).name
						if (
							!(part.parentSelectors ?? Object.keys(part.resolver.resolve)).includes(selectorName)
							|| (fieldRequest.sources != null && !fieldRequest.sources.includes(part.source))
						)
							continue
	
						if (part.select == null)
							continue

						const value = part.select(
							await resolveSnapshot(context, part.resolver, candidate.entityId, selectorName, fieldRequest),
							candidate.entityId,
							resolverContextFromSubset(part.source, fieldRequest, context.resolverPublicEnvBySource),
						)
						if (value != null) {
							conditionValue = fieldDefinition.when.itemIndex == null ?
								value
							:
								Array.isArray(value) ?
									value[fieldDefinition.when.itemIndex]
								:
									undefined
							break
						}
					}
					if (conditionValue == null)
						throw new Error(`${entityDefinition.entityType}.${fieldDefinition.name}: discriminator unresolved`)
				}
				if (!fieldDefinition.when.values.some((value) => value === conditionValue)) {
					context.persistence.loadedKeys.add(valueLoadedKey)
					if (fieldRequest.count === true)
						context.persistence.loadedKeys.add(countLoadedKey)
					continue
				}
			}
	
			const parts = (context.resolverIndexes.resolverValuePartsByEntityTypeAndFieldName[context.resolverIndexes.resolverPartsKey(fieldRequest.entityType, fieldRequest.fieldName)] ?? [])
				.filter((part) => (
					(part.parentSelectors ?? Object.keys(part.resolver.resolve)).includes(candidate.selectorName)
					&& (fieldRequest.sources == null || fieldRequest.sources.includes(part.source))
				))
			const rowGroups = parts.length === 0 ?
				[]
			:
				await successful(
					parts.map(async (part) => {
						if (part.select == null)
							return []
		
						const snapshot = await resolveSnapshot(context, part.resolver, candidate.entityId, candidate.selectorName, fieldRequest)
						const value = part.select(
							snapshot,
							candidate.entityId,
							resolverContextFromSubset(part.source, fieldRequest, context.resolverPublicEnvBySource),
						)
						validateResolverFieldValue(context.entityDefinitionByType, fieldDefinition, value)
						return (
							entityFieldCardinalityIsMultiple(fieldDefinition.cardinality) ?
								Array.isArray(value) ?
									value
								:
									[]
							: value == null ?
								[]
							:
								[value]
						).map((rowValue) => ({
						[EntityMetaKey.ParentId]: candidate.entityId,
						[EntityMetaKey.ParentIdKey]: entityIdKey(entityDefinition, candidate.entityId),
						[EntityMetaKey.Source]: part.source,
						[EntityMetaKey.Value]: rowValue,
						valueKey: fieldValueKey(rowValue),
					}))
					}),
					`${fieldRequest.entityType}.${fieldRequest.fieldName}: all compatible Field Facets failed`,
				)
			for (const row of rowGroups.flat())
				upsert(context.entityFieldCollections[fieldRequest.entityType][fieldRequest.fieldName], row, entityFieldCollectionItemKey(row))
			context.persistence.loadedKeys.add(valueLoadedKey)
	
			if (fieldRequest.count !== true || !entityFieldCardinalityIsMultiple(fieldDefinition.cardinality))
				continue
	
			const countParts = (context.resolverIndexes.resolverCountPartsByEntityTypeAndFieldName[context.resolverIndexes.resolverPartsKey(fieldRequest.entityType, fieldRequest.fieldName)] ?? [])
				.filter((part) => (
					(part.parentSelectors ?? Object.keys(part.resolver.resolve)).includes(candidate.selectorName)
					&& (fieldRequest.sources == null || fieldRequest.sources.includes(part.source))
				))
			const countRows = await successful(
				countParts.map(async (part) => {
					const snapshot = await resolveSnapshot(context, part.resolver, candidate.entityId, candidate.selectorName, fieldRequest)
					const value = part.resolveCount?.(
						snapshot,
						candidate.entityId,
						resolverContextFromSubset(part.source, fieldRequest, context.resolverPublicEnvBySource),
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
			const fallbackCountRows = (
				countRows.length > 0
				|| parts.length === 0
				|| fieldRequest.limit != null
				|| fieldRequest.offset != null
				|| fieldRequest.cursor != null
				|| parts.some((part) => part.partial === true) ?
					[]
				:
					[{
						[EntityMetaKey.ParentId]: candidate.entityId,
						[EntityMetaKey.ParentIdKey]: entityIdKey(entityDefinition, candidate.entityId),
						[EntityMetaKey.Source]: parts[0].source,
						[EntityMetaKey.Value]: rowGroups.flat().length,
						fieldName: fieldRequest.fieldName,
						filterKey: countFilterKey(fieldRequest),
					}]
			)
			const countCollection = context.entityFieldCountCollections[fieldRequest.entityType][fieldRequest.fieldName]
			if (countCollection == null)
				throw new Error(`${fieldRequest.entityType}.${fieldRequest.fieldName}: missing count collection`)
	
			for (const row of [
				...countRows,
				...fallbackCountRows,
			])
				upsert(countCollection, row, entityFieldCountCollectionItemKey(row))
			if (countRows.length > 0 || fallbackCountRows.length > 0)
				context.persistence.loadedKeys.add(countLoadedKey)
		}
	
	}
}


export const createCollectionsFromSchema = async <const _Schema extends Schema>({
	schema: inputSchema,
	resolverIndexes,
	resolverPublicEnvBySource,
	persistence = {
		loadedKeys: new Set<string>(),
		startedLiveScopes: new Set<string>(),
	},
}: {
	schema: _Schema
	resolverIndexes: ResolverIndexes
	resolverPublicEnvBySource: ReadonlyMap<string, Record<string, string>>
	persistence?: EntityCollectionsContext<_Schema>['persistence']
}): Promise<EntityCollectionsContext<_Schema>> => {
	const queryClient = new QueryClient()
	const context: EntityCollectionsContext<_Schema> = {
		schema: inputSchema,
		entityDefinitionByType: Object.fromEntries(inputSchema.map((entityDefinition) => [
			entityDefinition.entityType,
			entityDefinition,
		])),
		entityFieldDefinitionByEntityTypeAndName: Object.fromEntries(inputSchema.map((entityDefinition) => [
			entityDefinition.entityType,
			Object.fromEntries(entityFieldDefinitions(entityDefinition).map((fieldDefinition) => [
				fieldDefinition.name,
				fieldDefinition,
			])),
		])),
		entityCollections: {},
		entityFieldCollections: {},
		entityFieldCountCollections: {},
		queryClient,
		resolverIndexes,
		resolverPublicEnvBySource,
		persistence,
		liveSubscriptions: new Map(),
		events: {
			collectionSync: [],
			resolver: [],
			live: [],
		},
	}
	const sync = (collectionScope: CollectionScope<_Schema>) => ({
		sync: {
			sync: ({ markReady }: { markReady: () => void }) => {
				markReady()
				return {
					loadSubset: async (options: ResolverLoadSubsetOptions<_Schema>) => {
						const entityDefinition = context.entityDefinitionByType[collectionScope.entityType]
						if (entityDefinition == null)
							throw new Error(`${collectionScope.id}: unknown collection entity type`)

						const fieldDefinition = collectionScope.kind === 'Entity' ? undefined : context.entityFieldDefinitionByEntityTypeAndName[collectionScope.entityType]?.[collectionScope.fieldName]
						if (collectionScope.kind !== 'Entity' && fieldDefinition == null)
							throw new Error(`${collectionScope.id}: unknown collection field`)

						context.events.collectionSync.push({
							collection: collectionScope,
							key: JSON.stringify(collectionQueryIrKey(options)),
						})

							if (options.resolverRequest != null) {
								await loadCollectionQueryIr(context, options.resolverRequest)
								return
							}

							return
						},
					}
				},
		},
		onInsert: async () => {},
		onUpdate: async () => {},
		syncMode: 'on-demand' as const,
		startSync: false,
		id: collectionScope.id,
	})
	context.entityCollections = Object.fromEntries(inputSchema.map((entityDefinition) => [
		entityDefinition.entityType,
		createCollection<EntityCollectionItem<_Schema, EntityTypeName<_Schema>>, string>({
			...sync({
				kind: 'Entity',
				entityType: entityDefinition.entityType,
				id: `Entity:${entityDefinition.entityType}`,
			}),
			getKey: (row) => [
				row[EntityMetaKey.Source],
				row[EntityMetaKey.IdKey],
			].join('\x1E'),
		}),
	]))
	context.entityFieldCollections = Object.fromEntries(inputSchema.map((entityDefinition) => [
		entityDefinition.entityType,
		Object.fromEntries(entityFieldDefinitions(entityDefinition).map((fieldDefinition) => [
			fieldDefinition.name,
			createCollection<EntityFieldCollectionItem<
				_Schema,
				EntityTypeName<_Schema>,
				EntityFieldName<_Schema, EntityTypeName<_Schema>>
			>, string>({
				...sync({
					kind: 'Field',
					entityType: entityDefinition.entityType,
					fieldName: fieldDefinition.name,
					id: `Field:${entityDefinition.entityType}:${fieldDefinition.name}`,
				}),
				getKey: entityFieldCollectionItemKey,
			}),
		])),
	]))
	context.entityFieldCountCollections = Object.fromEntries(inputSchema.map((entityDefinition) => [
		entityDefinition.entityType,
		Object.fromEntries(entityFieldDefinitions(entityDefinition)
			.filter((fieldDefinition) => entityFieldCardinalityIsMultiple(fieldDefinition.cardinality))
			.map((fieldDefinition) => [
				fieldDefinition.name,
				createCollection<EntityFieldCountCollectionItem<
					_Schema,
				EntityTypeName<_Schema>,
				EntityFieldName<_Schema, EntityTypeName<_Schema>>
			>, string>({
				...sync({
					kind: 'Count',
					entityType: entityDefinition.entityType,
					fieldName: fieldDefinition.name,
					id: `Count:${entityDefinition.entityType}:${fieldDefinition.name}`,
				}),
				getKey: entityFieldCountCollectionItemKey,
			}),
			])),
	]))
	return context
}

const fieldSelection = <
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
>(
	selection: true | UseEntityFieldSelection<_Schema, _EntityType>,
): UseEntityFieldSelection<_Schema, _EntityType> => selection === true ? {} : selection

const useEntitySelectedFields = (
	selection: UseEntitySelection,
) => selection.fields ?? Object.fromEntries(Object.entries(selection)
	.filter(([key]) => ![
		'sources',
		'limit',
		'offset',
		'cursor',
	].includes(key)))

export const sourcePriorityForField = <_Schema extends Schema>(
	context: EntityCollectionsContext<_Schema>,
	entityType: EntityTypeName<_Schema>,
	fieldName: EntityFieldName<_Schema, EntityTypeName<_Schema>>,
	selection: {
		readonly sources?: readonly string[]
		readonly rootSources?: readonly string[]
	} = {},
) => {
	const sources: string[] = []
	for (const source of (
		selection.sources
		?? context.entityFieldDefinitionByEntityTypeAndName[entityType]?.[fieldName]?.defaultSources
		?? selection.rootSources
		?? (context.resolverIndexes.resolverValuePartsByEntityTypeAndFieldName[context.resolverIndexes.resolverPartsKey(entityType, fieldName)] ?? []).map((part) => part.source)
	))
		if (!sources.includes(source))
			sources.push(source)
	return sources
}

const useEntityCollectionQueryIr = <_Schema extends Schema>(
	context: EntityCollectionsContext<_Schema>,
	entityType: EntityTypeName<_Schema>,
	entityId: EntityId<_Schema, EntityTypeName<_Schema>>,
	selection: UseEntitySelection<_Schema, EntityTypeName<_Schema>>,
) => {
	const fieldRequests: FieldLoadRequest<_Schema>[] = []
	const fieldRequestKeys = new Set<string>()
	const selectedFields = useEntitySelectedFields(selection)
	for (const fieldSelectionEntry of Object.entries(selectedFields)) {
		const [fieldName, selectedField] = fieldSelectionEntry
		if (selectedField == null)
			continue

		const selectedFieldSelection = fieldSelection(selectedField)
		const fieldDefinition = context.entityFieldDefinitionByEntityTypeAndName[entityType]?.[fieldName]
		if (fieldDefinition == null)
			throw new Error(`${entityType}.${fieldName}: unknown selected field`)
		for (const request of [
			...(fieldDefinition.when == null || fieldDefinition.when.fieldName in selectedFields ?
				[]
			:
				[{
					entityType,
					entityIds: [entityId],
					fieldName: fieldDefinition.when.fieldName,
					sources: sourcePriorityForField(context, entityType, fieldDefinition.when.fieldName, {
						sources: selectedFieldSelection.sources,
						rootSources: selection.sources,
					}),
					identitySources: selectedFieldSelection.identitySources,
					count: selectedFieldSelection.count,
					where: selectedFieldSelection.where,
					orderBy: selectedFieldSelection.orderBy,
					limit: selectedFieldSelection.limit,
					offset: selectedFieldSelection.offset,
					cursor: selectedFieldSelection.cursor,
				}]
			),
			{
				entityType,
				entityIds: [entityId],
				fieldName: fieldDefinition.name,
				sources: sourcePriorityForField(context, entityType, fieldDefinition.name, {
					sources: selectedFieldSelection.sources,
					rootSources: selection.sources,
				}),
				identitySources: selectedFieldSelection.identitySources,
				count: selectedFieldSelection.count,
				where: selectedFieldSelection.where,
				orderBy: selectedFieldSelection.orderBy,
				limit: selectedFieldSelection.limit,
				offset: selectedFieldSelection.offset,
				cursor: selectedFieldSelection.cursor,
			},
		]) {
			const key = loadedCollectionQueryIrKey('field', request, entityId, request.fieldName)
			if (fieldRequestKeys.has(key))
				continue

			fieldRequestKeys.add(key)
			fieldRequests.push(request)
		}
	}
	return {
		entities: [{
			entityType,
			entityIds: [entityId],
			sources: selection.sources,
			where: selection.where,
			orderBy: selection.orderBy,
			limit: selection.limit,
			offset: selection.offset,
			cursor: selection.cursor,
		}],
		fields: fieldRequests,
	}
}

const resolveUseEntity = async <
	const _Schema extends Schema,
	const _EntityType extends EntityTypeName<_Schema>,
	const _Selection extends UseEntitySelection<_Schema, _EntityType>,
>(
	context: EntityCollectionsContext<_Schema>,
	entityType: _EntityType,
	entityId: EntityId<_Schema, _EntityType>,
	selection: _Selection,
	collectionQueryIrRequest = useEntityCollectionQueryIr(context, entityType, entityId, selection),
): Promise<UseEntityResult<_Schema, _EntityType, _Selection>> => {
	const errors: UseEntityError<_Schema>[] = []
	try {
		for (const entityRequest of collectionQueryIrRequest.entities)
			await syncCollectionSubset(
				context,
				`Entity:${entityRequest.entityType}`,
				{
					entities: [entityRequest],
					fields: [],
				},
				entityRequest,
			)
		for (const fieldRequest of collectionQueryIrRequest.fields) {
			await syncCollectionSubset(
				context,
				`Field:${fieldRequest.entityType}:${fieldRequest.fieldName}`,
				{
					entities: [],
					fields: [fieldRequest],
				},
				fieldRequest,
			)
			if (fieldRequest.count === true)
				await syncCollectionSubset(
					context,
					`Count:${fieldRequest.entityType}:${fieldRequest.fieldName}`,
					{
						entities: [],
						fields: [fieldRequest],
					},
					fieldRequest,
				)
		}
	} catch (error) {
		errors.push({
			selectorAddress: [entityType],
			entityType,
			entityId,
			message: String(error),
		})
	}
	const entityDefinition = context.entityDefinitionByType[entityType]
	if (entityDefinition == null)
		throw new Error(`${entityType}: unknown entity type`)

	const requestedParentIdKey = entityIdKey(entityDefinition, entityId)
	const entityRows = await queryOnce((query) => query
		.from({ entity: context.entityCollections[entityType] })
		.where(({ entity }) => eq(entity[EntityMetaKey.IdKey], requestedParentIdKey))
		.select(({ entity }) => entity))
	const parentIdKeys = [...new Set([
		requestedParentIdKey,
		...entityRows.flatMap((row) => entityIdentityIdsFromFields(
			entityDefinition,
			entityId,
			row[EntityMetaKey.Fields] ?? {},
		).map((identityId) => entityIdKey(entityDefinition, identityId))),
	])]
	const fields: UseEntityResult<_Schema, _EntityType, _Selection>['fields'] = Object.create(null)
	await Promise.all(Object.entries(useEntitySelectedFields(selection)).map(async (fieldSelectionEntry) => {
		const [fieldName, selectedField] = fieldSelectionEntry
		if (selectedField == null)
			return

		const selectedFieldSelection = fieldSelection(selectedField)
		const fieldDefinition = context.entityFieldDefinitionByEntityTypeAndName[entityType]?.[fieldName]
		if (fieldDefinition == null)
			throw new Error(`${entityType}.${fieldName}: unknown selected field`)
		const sources = sourcePriorityForField(context, entityType, fieldDefinition.name, {
			sources: selectedFieldSelection.sources,
			rootSources: selection.sources,
		})
			const queryRows = await queryOnce((query) => {
				let builder = query
					.from({ field: context.entityFieldCollections[entityType][fieldDefinition.name] })
					.where(({ field }) => inArray(field[EntityMetaKey.ParentIdKey], parentIdKeys))
					.orderBy(({ field }) => field[EntityMetaKey.Source])
					.orderBy(({ field }) => field[EntityMetaKey.ParentIdKey])
					.orderBy(({ field }) => field.valueKey)
		if (selectedFieldSelection.offset != null)
			builder = builder.offset(selectedFieldSelection.offset)
		if (selectedFieldSelection.limit != null)
			builder = builder.limit(selectedFieldSelection.limit)
				return builder.select(({ field }) => field)
			})
			const rows = []
			for (const source of sources)
				for (const row of queryRows) {
					if (
						row[EntityMetaKey.Source] !== source
						|| !parentIdKeys.includes(row[EntityMetaKey.ParentIdKey])
					)
						continue
					rows.push(row)
				}
		const values: EntityFieldSingleResolvedValue<_Schema, _EntityType, EntityFieldName<_Schema, _EntityType>>[] = []
		const valueKeys = new Set<string>()
		if (!entityFieldCardinalityIsMultiple(fieldDefinition.cardinality))
			for (const source of sources)
					for (const row of entityRows) {
						if (row[EntityMetaKey.Source] !== source)
							continue
						const value = (row[EntityMetaKey.Fields] as Record<string, unknown> | undefined)?.[fieldDefinition.name]
					if (value == null)
						continue
					const valueKey = `EntityField:${source}:${stringify(value)}`
					if (valueKeys.has(valueKey))
						continue
					valueKeys.add(valueKey)
					values.push(value as EntityFieldSingleResolvedValue<_Schema, _EntityType, EntityFieldName<_Schema, _EntityType>>)
				}
			for (const row of rows) {
				const rowValue = row[EntityMetaKey.Value] as unknown
				const valueKey = (
					typeof rowValue === 'object' && rowValue != null && EntityMetaKey.IdKey in rowValue ?
						`Entity:${stringify((rowValue as { readonly [EntityMetaKey.IdKey]: string })[EntityMetaKey.IdKey])}`
					:
						`Value:${stringify(rowValue)}`
				)
			if (valueKeys.has(valueKey))
				continue

				valueKeys.add(valueKey)
				values.push(rowValue as EntityFieldSingleResolvedValue<_Schema, _EntityType, EntityFieldName<_Schema, _EntityType>>)
			}
		const nestedFields = selectedFieldSelection.fields
		let nestedEntities: (Awaited<ReturnType<typeof resolveUseEntity<_Schema, EntityTypeName<_Schema>, UseEntitySelection<_Schema, EntityTypeName<_Schema>>>>> | undefined)[] | undefined
		if (
			nestedFields != null
			&& (
				fieldDefinition.type === EntityFieldType.EntityReference
				|| fieldDefinition.type === EntityFieldType.EntitiesReference
			)
		) {
			const nestedEntityType = fieldDefinition.entityType
			nestedEntities = await Promise.all(values.map(async (value) => {
				try {
					if (typeof value !== 'object')
						throw new Error(`${entityType}.${fieldName}: invalid nested entity reference`)

					return await resolveUseEntity(context, nestedEntityType, value.__id, {
						sources: selectedFieldSelection.sources,
						fields: nestedFields,
					})
				} catch (error) {
					errors.push({
						selectorAddress: [entityType, fieldName],
						entityType,
						entityId,
						fieldName,
						message: String(error),
					})
					return undefined
				}
			}))
		}

		if (entityFieldCardinalityIsMultiple(fieldDefinition.cardinality)) {
			let totalCount: number | undefined
			if (selectedFieldSelection.count === true) {
				const countCollection = context.entityFieldCountCollections[entityType][fieldDefinition.name]
				const countRows = countCollection == null ?
					[]
				:
					await queryOnce((query) => query
						.from({ count: countCollection })
						.where(({ count }) => inArray(count[EntityMetaKey.ParentIdKey], parentIdKeys))
						.select(({ count }) => count)) as {
							readonly [EntityMetaKey.Source]: string
							readonly [EntityMetaKey.ParentIdKey]: string
							readonly [EntityMetaKey.Value]: number
							readonly filterKey: string
						}[]
				let countParentIdKeys: string[] = parentIdKeys
				if (rows.length > 0) {
					const rowParentIdKeys = new Set<string>()
					for (const row of rows)
						rowParentIdKeys.add(row[EntityMetaKey.ParentIdKey])
					countParentIdKeys = [...rowParentIdKeys]
				}
				for (const source of sources)
					for (const parentIdKey of countParentIdKeys) {
						const row = countRows.find((countRow) => (
							countRow[EntityMetaKey.Source] === source
							&& countRow[EntityMetaKey.ParentIdKey] === parentIdKey
							&& countRow.filterKey === countFilterKey(selectedFieldSelection)
						))
						if (row != null) {
							totalCount = row[EntityMetaKey.Value]
							break
						}
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
			return
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
	}))

	return {
		entityType,
		entityId,
		...fields,
		fields,
		collectionQueryIr: collectionQueryIrRequest,
		errors,
	}
}

export const useEntity = <
	const _Schema extends Schema,
	const _EntityType extends EntityTypeName<_Schema>,
	const _Selection extends UseEntitySelection<_Schema, _EntityType>,
>(
	context: EntityCollectionsContext<_Schema>,
	entityType: _EntityType,
	entityId: EntityId<_Schema, _EntityType>,
	selection: _Selection,
): UseEntityResource<_Schema, _EntityType, _Selection> => {
	const collectionQueryIrRequest = useEntityCollectionQueryIr(context, entityType, entityId, selection)
	const promise = resolveUseEntity(context, entityType, entityId, selection, collectionQueryIrRequest)
	let current: UseEntityResult<_Schema, _EntityType, _Selection> | undefined
	let error: unknown
	let loading = true
	const resourcePromise = promise.then((result) => {
		loading = false
		if (result.errors.length > 0) {
			error = result.errors
			throw result.errors
		}
		current = result
		return result
	}, (cause) => {
		loading = false
		error = cause
		throw cause
	})

	const resource = Object.assign(resourcePromise, {
		collectionQueryIr: collectionQueryIrRequest,
		requiredCollections: [
			...collectionQueryIrRequest.entities.map((entityRequest) => `Entity:${entityRequest.entityType}`),
			...collectionQueryIrRequest.fields.flatMap((fieldRequest) => [
				`Field:${fieldRequest.entityType}:${fieldRequest.fieldName}`,
				...(fieldRequest.count === true ? [`Count:${fieldRequest.entityType}:${fieldRequest.fieldName}`] : []),
			]),
		],
	}) as unknown as UseEntityResource<_Schema, _EntityType, _Selection>
	Object.defineProperties(resource, {
		current: {
			get: () => current,
		},
		error: {
			get: () => error,
		},
		loading: {
			get: () => loading,
		},
		ready: {
			get: () => current !== undefined && error === undefined,
		},
		[Symbol.toStringTag]: {
			value: 'RemoteResource',
			configurable: true,
		},
	})
	return resource
}
