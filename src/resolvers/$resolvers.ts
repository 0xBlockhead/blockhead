import type { QueryClient } from '@tanstack/query-core'
import { extractSimpleComparisons, parseOrderByExpression } from '@tanstack/db'
import type { LoadSubsetOptions } from '@tanstack/db'

import { EntityFieldCardinality, EntityFieldType, EntityMetaKey, entityFieldAddressKey, entityFieldConditionKey, entityFieldDefinitions, entityFieldFacetPath } from '$/schema/$schema.ts'
import type { EntityDefinition, EntityFacetDefinition, EntityFacetPath, EntityFieldDefinition, EntityFieldDefinitionByName, EntityFieldName, EntityFieldSingleResolvedValue, EntitySelector, EntityType, Schema } from '$/schema/$schema.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'

export type ResolverValue =
	| string
	| number
	| bigint
	| boolean
	| null
	| undefined
	| readonly ResolverValue[]
	| ResolverObject

export type ResolverObject = { readonly [key: string]: ResolverValue }

export type ResolverComparable =
	| string
	| number
	| bigint
	| boolean
	| null
	| undefined

export type ResolverFilterValue =
	| ResolverComparable
	| readonly ResolverComparable[]

export type LoadSubsetKeyValue =
	| ResolverComparable
	| readonly LoadSubsetKeyValue[]
	| { readonly [key: string]: LoadSubsetKeyValue }

export type LoadSubsetKeyObject = { readonly [key: string]: LoadSubsetKeyValue }

type ResolverEntityReferenceValue<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = {
	readonly [EntityMetaKey.Selector]: EntitySelector<_Schema, _EntityType>
	readonly [EntityMetaKey.SelectorKey]?: string
} & ResolverObject

type ResolverFieldSingleValue<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
> = (
	EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
		readonly type: EntityFieldType.Primitive
	} ?
		EntityFieldSingleResolvedValue<_Schema, _EntityType, _FieldName>
	: EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
		readonly type: EntityFieldType.EntityReference | EntityFieldType.EntitiesReference
		readonly entityType: infer _ReferencedEntityType extends EntityType<_Schema>
	} ?
		ResolverEntityReferenceValue<_Schema, _ReferencedEntityType>
	:
		never
)

export type ResolverFieldValue<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
> = (
	EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
		readonly cardinality: EntityFieldCardinality.One
	} ?
		ResolverFieldSingleValue<_Schema, _EntityType, _FieldName>
	: EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
		readonly cardinality: EntityFieldCardinality.ZeroOrOne
	} ?
		ResolverFieldSingleValue<_Schema, _EntityType, _FieldName> | undefined
	: EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
		readonly cardinality: EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
	} ?
		readonly ResolverFieldSingleValue<_Schema, _EntityType, _FieldName>[]
	:
		never
)

type ResolverSelect<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
	_Snapshot,
	_Context extends ResolverContext,
> = {
	select(
		snapshot: _Snapshot,
		entitySelector: EntitySelector<_Schema, _EntityType>,
		context: _Context
	): ResolverFieldValue<_Schema, _EntityType, _FieldName>
}['select']

type ResolverCount<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Snapshot,
	_Context extends ResolverContext,
> = {
	resolveCount(
		snapshot: _Snapshot,
		entitySelector: EntitySelector<_Schema, _EntityType>,
		context: _Context
	): number
}['resolveCount']

type ResolverFilter = {
	readonly fieldPath: readonly string[]
	readonly operator: 'eq' | 'in'
	readonly value: ResolverFilterValue
}

type ResolverSort = {
	readonly fieldPath: readonly string[]
	readonly direction: 'asc' | 'desc'
}

export type ResolverSubset = {
	readonly filters: readonly ResolverFilter[]
	readonly sorts: readonly ResolverSort[]
	readonly pagination: {
		readonly limit?: number
		readonly offset?: number
		readonly cursor?: LoadSubsetKeyValue
	}
	readonly sources?: readonly string[]
	readonly selectorKeys: readonly string[]
	readonly parentSelectorKeys: readonly string[]
}

export type ResolverContext = ResolverSubset & {
	readonly publicEnv: SourcePublicEnv
}

const plainResolverFilterValue = (
	value: unknown
): ResolverFilterValue => {
	if (
		value == null
		|| typeof value === 'string'
		|| typeof value === 'number'
		|| typeof value === 'bigint'
		|| typeof value === 'boolean'
	)
		return value

	if (
		Array.isArray(value)
		&& value.every((item) => (
			item == null
			|| typeof item === 'string'
			|| typeof item === 'number'
			|| typeof item === 'bigint'
			|| typeof item === 'boolean'
		))
	)
		return value

	throw new Error(`unsupported filter value ${String(value)}`)
}

export const plainLoadSubsetKeyValue = (
	value: unknown,
	seen = new WeakSet<object>()
): LoadSubsetKeyValue => (
	value == null ?
		value
	: typeof value === 'function' ?
		`[Function:${value.name}]`
	: (
		typeof value === 'string'
		|| typeof value === 'number'
		|| typeof value === 'bigint'
		|| typeof value === 'boolean'
	) ?
		value
	: Array.isArray(value) ?
		value.map((item) => plainLoadSubsetKeyValue(item, seen))
	: typeof value === 'object' ?
		seen.has(value) ?
			'[Circular]'
		: (
			seen.add(value),
			Object.fromEntries(
				Object.entries(Object(value)).map(([key, child]) => [
					key,
					plainLoadSubsetKeyValue(child, seen),
				])
			)
		)
	:
		String(value)
)

export const parseResolverSubset = (
	request: LoadSubsetOptions
): ResolverSubset => {
	let filters: ResolverSubset['filters']
	let sorts: ResolverSubset['sorts']
	try {
		filters = extractSimpleComparisons(request.where).map((comparison) => {
			if (comparison.operator !== 'eq' && comparison.operator !== 'in')
				throw new Error(`unsupported filter operator ${comparison.operator}`)

			return {
				fieldPath: (
					comparison.field.length > 1
					&& !String(comparison.field[0]).startsWith('__') ?
						comparison.field.slice(1).map(String)
					:
						comparison.field.map(String)
				),
				operator: comparison.operator,
				value: plainResolverFilterValue(comparison.value),
			}
		})
	} catch (error) {
		throw new Error(`Resolver Subset Parser unsupported where LoadSubsetOptions: ${String(error)}`)
	}
	try {
		sorts = parseOrderByExpression(request.orderBy).map((sort) => ({
			fieldPath: (
				sort.field.length > 1
				&& !String(sort.field[0]).startsWith('__') ?
					sort.field.slice(1).map(String)
				:
					sort.field.map(String)
			),
			direction: sort.direction,
		}))
	} catch (error) {
		throw new Error(`Resolver Subset Parser unsupported orderBy LoadSubsetOptions: ${String(error)}`)
	}
	const sourceFilters = filters.filter((filter) => filter.fieldPath[0] === EntityMetaKey.Source)
	const sources = sourceFilters.flatMap((filter) => {
		if (filter.fieldPath[0] !== EntityMetaKey.Source)
			return []
		if (filter.operator === 'eq') {
			if (typeof filter.value !== 'string')
				throw new Error(`Resolver Subset Parser expected string ${EntityMetaKey.Source} equality value`)
			return [filter.value]
		}
		if (!Array.isArray(filter.value) || !filter.value.every((item) => typeof item === 'string'))
			throw new Error(`Resolver Subset Parser expected string ${EntityMetaKey.Source} inclusion values`)
		return filter.value
	})
	return {
		filters,
		sorts,
		pagination: {
			limit: request.limit,
			offset: request.offset,
			cursor: request.cursor == null ? undefined : plainLoadSubsetKeyValue(request.cursor),
		},
		sources: sourceFilters.length === 0 ? undefined : sources,
		selectorKeys: filters.flatMap((filter) => {
			if (filter.fieldPath[0] !== EntityMetaKey.SelectorKey)
				return []
			if (filter.operator === 'eq') {
				if (typeof filter.value !== 'string')
					throw new Error(`Resolver Subset Parser expected string ${EntityMetaKey.SelectorKey} equality value`)
				return [filter.value]
			}
			if (!Array.isArray(filter.value) || !filter.value.every((item) => typeof item === 'string'))
				throw new Error(`Resolver Subset Parser expected string ${EntityMetaKey.SelectorKey} inclusion values`)
			return filter.value
		}),
		parentSelectorKeys: filters.flatMap((filter) => {
			if (filter.fieldPath[0] !== EntityMetaKey.ParentSelectorKey)
				return []
			if (filter.operator === 'eq') {
				if (typeof filter.value !== 'string')
					throw new Error(`Resolver Subset Parser expected string ${EntityMetaKey.ParentSelectorKey} equality value`)
				return [filter.value]
			}
			if (!Array.isArray(filter.value) || !filter.value.every((item) => typeof item === 'string'))
				throw new Error(`Resolver Subset Parser expected string ${EntityMetaKey.ParentSelectorKey} inclusion values`)
			return filter.value
		}),
	}
}

export const fieldLoadedSubsetKey = (
	request: LoadSubsetOptions
): LoadSubsetKeyObject => {
	const resolverSubset = parseResolverSubset(request)
	const filters = resolverSubset.filters.map((filter) => ({
		fieldPath: filter.fieldPath,
		operator: filter.operator,
		value: (
			Array.isArray(filter.value) ?
				filter.value.toSorted((left, right) => String(left).localeCompare(String(right)))
			:
				filter.value
		),
	})).toSorted((left, right) => (
		`${left.fieldPath.join('.')}:${left.operator}:${String(left.value)}`
			.localeCompare(`${right.fieldPath.join('.')}:${right.operator}:${String(right.value)}`)
	))
	const pagination = Object.fromEntries(Object.entries(resolverSubset.pagination).filter(([, value]) => value !== undefined))
	return {
		...(filters.length !== 0 && {
			filters,
		}),
		...(resolverSubset.sorts.length !== 0 && {
			sorts: resolverSubset.sorts,
		}),
		...(Object.keys(pagination).length !== 0 && {
			pagination,
		}),
	}
}

export const countLoadedSubsetKey = (
	request: LoadSubsetOptions
): LoadSubsetKeyObject => {
	const resolverSubset = parseResolverSubset({
		where: request.where,
	})
	const filters = resolverSubset.filters.flatMap((filter) => (
		filter.fieldPath[0] === EntityMetaKey.Source
		|| filter.fieldPath[0] === EntityMetaKey.ParentSelectorKey
		|| filter.fieldPath[0] === 'filterKey' ?
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
	return {
		...(filters.length !== 0 && {
			filters,
		}),
	}
}

/** When hydrate/live-query omits `LIMIT`, list field resolvers still need a cap. */
export const defaultResolverContextRowLimit = 64

export const resolverContextRowLimit = (
	context: ResolverContext
) => context.pagination.limit ?? defaultResolverContextRowLimit

export type ResolveLiveFieldHandle<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
> = {
	readonly replaceRows: (rows: readonly {
		source: string
		value: ResolverValue
	}[]) => void
	readonly invalidate: () => void
	readonly count: {
		readonly replaceRows: (rows: readonly {
			source: string
			value: number
		}[]) => void
		readonly invalidate: () => void
	}
}

export type ResolveLiveFields<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = {
	readonly [
		_FieldName in EntityFieldName<_Schema, _EntityType>
	]: ResolveLiveFieldHandle<_Schema, _EntityType, _FieldName>
} & {
	readonly invalidate: (fieldNames: readonly EntityFieldName<_Schema, _EntityType>[]) => void
}

export type ResolveLivePublisherContext<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = {
	readonly parentEntitySelector: EntitySelector<_Schema, _EntityType>
	readonly queryClient: QueryClient
	readonly signal: AbortSignal
	readonly trigger: ResolverContext & {
		readonly fieldName?: EntityFieldName<_Schema, _EntityType>
		readonly sources?: readonly string[]
	}
	readonly fields: ResolveLiveFields<_Schema, _EntityType>
}

export type ResolveLivePublishers<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = {
	readonly [_PublisherName in string]: {
		readonly publishes: Partial<{
			readonly [
				_FieldName in EntityFieldName<_Schema, _EntityType>
			]: true
		}>
		readonly start: (
			context: ResolveLivePublisherContext<_Schema, _EntityType>
		) => void | (() => void) | Promise<void | (() => void)>
	}
}

export type FieldSelector<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends string,
	_Snapshot,
	_Context extends ResolverContext = ResolverContext,
> = (
	_FieldName extends EntityFieldName<_Schema, _EntityType> ?
		| ResolverSelect<_Schema, _EntityType, _FieldName, _Snapshot, _Context>
		| {
			readonly parentSelectors?: readonly string[]
			readonly select?: ResolverSelect<_Schema, _EntityType, _FieldName, _Snapshot, _Context>
			readonly resolveCount?: ResolverCount<_Schema, _EntityType, _Snapshot, _Context>
			readonly resolveLive?: {
				readonly start: (
					context: ResolveLivePublisherContext<_Schema, _EntityType> & {
						readonly field: ResolveLiveFieldHandle<_Schema, _EntityType, EntityFieldName<_Schema, _EntityType>>
					}
				) => void | (() => void) | Promise<void | (() => void)>
			}
			readonly partial?: boolean
		}
	:
		never
)

type ResolverProjectionFieldSelector<
	_Context extends ResolverContext = ResolverContext,
> =
	| ((
		snapshot: ResolverValue,
		entitySelector: EntitySelector<Schema, EntityType<Schema>>,
		context: _Context
	) => ResolverValue)
	| {
		readonly parentSelectors?: readonly string[]
		readonly select?: (
			snapshot: ResolverValue,
			entitySelector: EntitySelector<Schema, EntityType<Schema>>,
			context: _Context
		) => ResolverValue
		readonly resolveCount?: (
			snapshot: ResolverValue,
			entitySelector: EntitySelector<Schema, EntityType<Schema>>,
			context: _Context
		) => number
		readonly resolveLive?: {
			readonly start: (
				context: ResolveLivePublisherContext<Schema, EntityType<Schema>> & {
					readonly field: ResolveLiveFieldHandle<Schema, EntityType<Schema>, EntityFieldName<Schema, EntityType<Schema>>>
				}
			) => void | (() => void) | Promise<void | (() => void)>
		}
		readonly partial?: boolean
	}

type ResolverResolve<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Context extends ResolverContext,
	_Snapshot,
> = {
	resolve(
		entitySelector: EntitySelector<_Schema, _EntityType>,
		context: _Context
	): _Snapshot | Promise<_Snapshot>
}['resolve']

export interface ResolverProjections<
	_Schema extends Schema = Schema,
	_EntityType extends EntityType<_Schema> = EntityType<_Schema>,
	_Context extends ResolverContext = ResolverContext,
	_Snapshot = ResolverValue,
> {
	readonly [name: string]:
		| FieldSelector<_Schema, _EntityType, EntityFieldName<_Schema, _EntityType>, _Snapshot, _Context>
		| ResolverProjections<_Schema, _EntityType, _Context, _Snapshot>
		| undefined
}

export type SourceResolverDefinition<
	_Schema extends Schema = Schema,
	_Source extends string = string,
	_EntityType extends EntityType<_Schema> = EntityType<_Schema>,
	_Context extends ResolverContext = ResolverContext,
	_Snapshot = ResolverValue,
> = {
	readonly definitionIndex: number
	readonly source: _Source
	readonly entityType: _EntityType
	readonly resolve: Partial<Record<
		string,
		ResolverResolve<_Schema, _EntityType, _Context, _Snapshot>
	>>
	readonly projections: ResolverProjections<_Schema, _EntityType, _Context, _Snapshot>
	readonly resolveLive?: ResolveLivePublishers<_Schema, _EntityType>
}

export type SourceResolverDefinitionCandidate<
	_Schema extends Schema = Schema,
	_Source extends string = string,
	_EntityType extends string = EntityType<_Schema>,
	_Context extends ResolverContext = ResolverContext,
	_Snapshot = ResolverValue,
> = {
	readonly definitionIndex: number
	readonly source: _Source
	readonly entityType: _EntityType
	readonly resolve: Partial<Record<string, ResolverResolve<_Schema, Extract<_EntityType, EntityType<_Schema>>, _Context, _Snapshot>>>
	readonly projections: ResolverProjections<_Schema, Extract<_EntityType, EntityType<_Schema>>, _Context, _Snapshot>
	readonly resolveLive?: Partial<Record<
		string,
		{
			readonly publishes: Partial<Record<string, true>>
			readonly start: (context: ResolveLivePublisherContext<_Schema, EntityType<_Schema>>) => void | (() => void) | Promise<void | (() => void)>
		}
	>>
}

export type ResolverPart<
	_Schema extends Schema = Schema,
	_Source extends string = string,
	_Context extends ResolverContext = ResolverContext,
> = {
	readonly resolver: SourceResolverDefinition<_Schema, _Source, EntityType<_Schema>, _Context>
	readonly partIndex: number
	readonly source: _Source
	readonly entityType: EntityType<_Schema>
	readonly facetPath: EntityFacetPath
	readonly fieldName: string
	readonly parentSelectors?: readonly string[]
	readonly select?: (
		snapshot: ResolverValue,
		entitySelector: EntitySelector<_Schema, EntityType<_Schema>>,
		context: _Context
	) => ResolverValue
	readonly resolveCount?: (
		snapshot: ResolverValue,
		entitySelector: EntitySelector<_Schema, EntityType<_Schema>>,
		context: _Context
	) => number
	readonly resolveLive?: {
		readonly start: (context: ResolveLivePublisherContext<_Schema, EntityType<_Schema>> & {
			readonly field: ResolveLiveFieldHandle<_Schema, EntityType<_Schema>, EntityFieldName<_Schema, EntityType<_Schema>>>
		}) => void | (() => void) | Promise<void | (() => void)>
	}
	readonly partial?: boolean
}

export type ResolverRootLivePart<
	_Schema extends Schema = Schema,
	_Source extends string = string,
	_Context extends ResolverContext = ResolverContext,
> = {
	readonly resolver: SourceResolverDefinition<_Schema, _Source, EntityType<_Schema>, _Context>
	readonly publisher: ResolveLivePublishers<_Schema, EntityType<_Schema>>[string]
	readonly publisherName: string
	readonly source: _Source
	readonly entityType: EntityType<_Schema>
	readonly facetPath: EntityFacetPath
}

export type ResolverIndexes<
	_Schema extends Schema = Schema,
	_Source extends string = string,
	_Context extends ResolverContext = ResolverContext,
> = {
	readonly resolverDefinitionsByEntityType: Partial<Record<string, readonly SourceResolverDefinition<_Schema, _Source, EntityType<_Schema>, _Context>[]>>
	readonly resolverParts: readonly ResolverPart<_Schema, _Source, _Context>[]
	readonly resolverValuePartsByEntityTypeAndFieldName: Partial<Record<string, readonly ResolverPart<_Schema, _Source, _Context>[]>>
	readonly resolverCountPartsByEntityTypeAndFieldName: Partial<Record<string, readonly ResolverPart<_Schema, _Source, _Context>[]>>
	readonly resolverLivePartsByEntityTypeAndFieldName: Partial<Record<string, readonly ResolverPart<_Schema, _Source, _Context>[]>>
	readonly resolverRootLivePartsByEntityType: Partial<Record<string, readonly ResolverRootLivePart<_Schema, _Source, _Context>[]>>
	readonly resolverDiscriminatorPartsByEntityTypeAndConditionKey: Partial<Record<string, Partial<Record<string, readonly ResolverPart<_Schema, _Source, _Context>[]>>>>
	readonly resolverPartsKey: {
		(entityType: string, fieldName: string): string
		(entityType: string, facetPath: EntityFacetPath, fieldName: string): string
	}
}

export type SourceResolverModule<
	_Schema extends Schema,
	_Source extends string,
	_Context extends ResolverContext = ResolverContext,
> = {
	readonly source: _Source
	readonly resolvers: readonly {
		readonly [_EntityType in EntityType<_Schema>]: Omit<
			SourceResolverDefinition<_Schema, _Source, _EntityType, _Context>,
			'definitionIndex' | 'source'
		>
	}[EntityType<_Schema>][]
}

type ResolverProjectionPartCandidate = {
	readonly facetPath: EntityFacetPath
	readonly fieldName: string
	readonly fieldDefinition: EntityFieldDefinition
	readonly fieldSelector: ResolverProjectionFieldSelector
}

const resolverProjectionPartCandidates = (
	resolver: {
		readonly source: string
		readonly entityType: string
	},
	entityDefinition: EntityDefinition,
	projections: { readonly [name: string]: unknown },
	facetPath: EntityFacetPath = [],
	facets: readonly EntityFacetDefinition[] = entityDefinition.facets ?? []
): ResolverProjectionPartCandidate[] => {
	const projectionFields = entityFieldDefinitions(entityDefinition)
		.filter((fieldDefinition) => entityFieldFacetPath(fieldDefinition).join('\u001e') === facetPath.join('\u001e'))
	const fieldDefinitionByName = new Map(
		projectionFields.map((fieldDefinition) => [
			fieldDefinition.name,
			fieldDefinition,
		])
	)
	const facetById = new Map(facets.map((facet) => [
		facet.id,
		facet,
	]))

	return Object.entries(projections).flatMap(([name, fieldSelector]) => {
		if (fieldSelector === undefined)
			return []

		const fieldDefinition = fieldDefinitionByName.get(name)
		if (fieldDefinition !== undefined)
			return [{
				facetPath,
				fieldName: name,
				fieldDefinition,
				fieldSelector: fieldSelector as ResolverProjectionFieldSelector,
			}]

		const facet = facetById.get(name)
		if (facet === undefined)
			throw new Error(`${resolver.source}:${resolver.entityType} references unknown projection path ${[...facetPath, name].join('.')}`)

		return resolverProjectionPartCandidates(
			resolver,
			entityDefinition,
			fieldSelector as { readonly [name: string]: unknown },
			[
				...facetPath,
				name,
			],
			facet.facets ?? []
		)
	})
}

export const validateResolverDefinitions = <
	_Schema extends Schema,
	_Source extends string,
	const _CandidateEntityType extends string,
	_Context extends ResolverContext,
>(
	schema: _Schema,
	resolverDefinitions: readonly SourceResolverDefinitionCandidate<_Schema, _Source, _CandidateEntityType, _Context>[]
) => {
	const entityDefinitionByType = new Map(schema.map((entityDefinition) => [
		entityDefinition.entityType,
		entityDefinition,
	]))
	const entitySelectorNamesByEntityType = Object.fromEntries(
		schema.map((entityDefinition) => [
			entityDefinition.entityType,
			new Set(entityDefinition.selectors.map((selector) => selector.name)),
		])
	)

	for (const resolver of resolverDefinitions) {
		const entityDefinition = entityDefinitionByType.get(resolver.entityType)
		if (entityDefinition === undefined)
			throw new Error(`${resolver.source}:${resolver.entityType} references unknown entity`)

		const resolverProjectionParts = resolverProjectionPartCandidates(
			resolver,
			entityDefinition,
			resolver.projections
		)

		if (resolverProjectionParts.length === 0)
			throw new Error(`${resolver.source}:${resolver.entityType} declares no fields`)

		for (const selectorName of Object.keys(resolver.resolve)) {
			if (!entitySelectorNamesByEntityType[resolver.entityType]?.has(selectorName))
				throw new Error(`${resolver.source}:${resolver.entityType} references unknown selector ${selectorName}`)
		}

		for (const {
			fieldName,
			fieldDefinition,
			fieldSelector,
		} of resolverProjectionParts) {

			if (
				typeof fieldSelector === 'function'
				&& fieldSelector.constructor.name === 'AsyncFunction'
			)
				throw new Error(`${resolver.source}:${resolver.entityType}.${fieldName} has async field selector`)

			if (typeof fieldSelector === 'function')
				continue

			for (const parentSelectorName of fieldSelector.parentSelectors ?? []) {
				if (!entitySelectorNamesByEntityType[resolver.entityType]?.has(parentSelectorName))
					throw new Error(`${resolver.source}:${resolver.entityType}.${fieldName} references unknown parent selector ${parentSelectorName}`)
			}

			if (fieldSelector.select?.constructor.name === 'AsyncFunction')
				throw new Error(`${resolver.source}:${resolver.entityType}.${fieldName} has async field selector`)

			if (fieldSelector.resolveCount?.constructor.name === 'AsyncFunction')
				throw new Error(`${resolver.source}:${resolver.entityType}.${fieldName} has async count selector`)

			if (
				fieldSelector.resolveCount != null
				&& !(
					fieldDefinition.cardinality === EntityFieldCardinality.Many
					|| fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrMany
				)
			)
				throw new Error(`${resolver.source}:${resolver.entityType}.${fieldName} has resolveCount but is not multiple-cardinality`)
		}

		for (const publisher of Object.values(resolver.resolveLive ?? {})) {
			if (publisher == null)
				continue

			const liveFacetPathKeys = new Set<string>()
			for (const liveFieldName of Object.keys(publisher.publishes)) {
				if (!entityFieldDefinitions(entityDefinition).some((fieldDefinition) => fieldDefinition.name === liveFieldName))
					throw new Error(`${resolver.source}:${resolver.entityType} references unknown live field ${liveFieldName}`)

				const liveResolverProjectionParts = resolverProjectionParts.filter((resolverProjectionPart) => (
					resolverProjectionPart.fieldName === liveFieldName
				))
				if (liveResolverProjectionParts.length === 0)
					throw new Error(`${resolver.source}:${resolver.entityType} publishes undeclared live field ${liveFieldName}`)

				for (const resolverProjectionPart of liveResolverProjectionParts)
					liveFacetPathKeys.add(resolverProjectionPart.facetPath.join('\u001e'))
			}

			if (liveFacetPathKeys.size > 1)
				throw new Error(`${resolver.source}:${resolver.entityType} publishes live fields across multiple projection paths`)
		}
	}
}

export function resolverPartsKey(
	entityType: string,
	fieldName: string
): string
export function resolverPartsKey(
	entityType: string,
	facetPath: EntityFacetPath,
	fieldName: string
): string
export function resolverPartsKey(
	entityType: string,
	facetPathOrFieldName: EntityFacetPath | string,
	fieldName?: string
) {
	return (
		typeof facetPathOrFieldName === 'string' ?
			entityFieldAddressKey(entityType, [], facetPathOrFieldName)
		:
			entityFieldAddressKey(entityType, facetPathOrFieldName, fieldName ?? '')
	)
}

export const indexResolvers = <
	const _Schema extends Schema,
	const _Source extends string,
	_Context extends ResolverContext,
>(
	schema: _Schema,
	resolverModules: readonly SourceResolverModule<_Schema, _Source, _Context>[],
	enabledSources: ReadonlySet<_Source>
) => {
	const schemaEntityTypes = new Set(schema.map((entityDefinition) => entityDefinition.entityType))
	const resolverDefinitions: SourceResolverDefinition<_Schema, _Source, EntityType<_Schema>, _Context>[] = resolverModules
		.filter((module) => enabledSources.has(module.source))
		.flatMap((module) => (
			module.resolvers.map((resolver) => ({
				...resolver,
				source: module.source,
			}))
		))
		.filter((resolver) => schemaEntityTypes.has(resolver.entityType))
		.map((resolver, definitionIndex) => ({
			...resolver,
			definitionIndex,
		}))

	validateResolverDefinitions(schema, resolverDefinitions)

	const resolverDefinitionsByEntityType = Object.groupBy(
		resolverDefinitions,
		(resolver) => resolver.entityType
	)
	const resolverParts: ResolverPart<_Schema, _Source, _Context>[] = []
	for (const resolver of resolverDefinitions) {
		let partIndex = 0
		const entityDefinition = schema.find((candidate) => candidate.entityType === resolver.entityType)
		if (entityDefinition == null)
			continue

		for (const {
			facetPath,
			fieldName,
			fieldSelector,
		} of resolverProjectionPartCandidates(
			resolver,
			entityDefinition,
			resolver.projections
		)) {
			if (typeof fieldSelector === 'function') {
				resolverParts.push({
					resolver,
					partIndex,
					source: resolver.source,
					entityType: resolver.entityType,
					facetPath,
					fieldName,
					select: fieldSelector,
				})
			} else {
				resolverParts.push({
					resolver,
					partIndex,
					source: resolver.source,
					entityType: resolver.entityType,
					facetPath,
					fieldName,
					parentSelectors: fieldSelector.parentSelectors,
					select: fieldSelector.select,
					resolveCount: fieldSelector.resolveCount,
					resolveLive: fieldSelector.resolveLive,
					partial: fieldSelector.partial,
				})
			}
			partIndex += 1
		}
	}
	const resolverValuePartsByEntityTypeAndFieldName = Object.groupBy(
		resolverParts.filter((resolverPart) => resolverPart.select != null),
		(resolverPart) => resolverPartsKey(
			resolverPart.entityType,
			resolverPart.facetPath,
			resolverPart.fieldName
		)
	)
	const resolverCountPartsByEntityTypeAndFieldName = Object.groupBy(
		resolverParts.filter((resolverPart) => resolverPart.resolveCount != null),
		(resolverPart) => resolverPartsKey(
			resolverPart.entityType,
			resolverPart.facetPath,
			resolverPart.fieldName
		)
	)
	const resolverLivePartsByEntityTypeAndFieldName = Object.groupBy(
		resolverParts.filter((resolverPart) => resolverPart.resolveLive != null),
		(resolverPart) => resolverPartsKey(
			resolverPart.entityType,
			resolverPart.facetPath,
			resolverPart.fieldName
		)
	)
	const resolverRootLivePartsByEntityType = Object.groupBy(
		resolverDefinitions.flatMap((resolver) => {
			const entityDefinition = schema.find((candidate) => candidate.entityType === resolver.entityType)
			if (entityDefinition == null)
				return []

			const resolverProjectionParts = resolverProjectionPartCandidates(
				resolver,
				entityDefinition,
				resolver.projections
			)
			return Object.entries(resolver.resolveLive ?? {}).map(([publisherName, publisher]) => ({
				resolver,
				publisher,
				publisherName,
				source: resolver.source,
				entityType: resolver.entityType,
				facetPath: (
					resolverProjectionParts.find((resolverProjectionPart) => (
						Object.hasOwn(publisher.publishes, resolverProjectionPart.fieldName)
					))?.facetPath
					?? []
				),
			}))
		}),
		(part) => part.entityType
	)
	const fieldNamesWithLiveResolverByEntityType = Object.fromEntries(
		Object.entries(Object.groupBy(
			[
				...Object.values(resolverRootLivePartsByEntityType)
					.flat()
					.flatMap((part) => (
						Object.keys(part.publisher.publishes).map((fieldName) => ({
							entityType: part.entityType,
							fieldName,
						}))
					)),
				...Object.values(resolverLivePartsByEntityTypeAndFieldName)
					.flat()
					.map((resolverPart) => ({
						entityType: resolverPart.entityType,
						fieldName: resolverPart.fieldName,
					})),
			],
			(liveField) => liveField.entityType
		))
			.map(([entityType, liveFields]) => [
				entityType,
				[...new Set(liveFields.map((liveField) => liveField.fieldName))],
			])
	)
	const resolverDiscriminatorPartsByEntityTypeAndConditionKey = Object.fromEntries(
		schema.map((entityDefinition) => [
			entityDefinition.entityType,
			Object.fromEntries(
				entityFieldDefinitions(entityDefinition)
					.flatMap((fieldDefinition) => {
						return (
							fieldDefinition.when == null ?
								[]
							:
								[[
									entityFieldConditionKey(fieldDefinition.when),
									resolverValuePartsByEntityTypeAndFieldName[
										resolverPartsKey(
											entityDefinition.entityType,
											[],
											entityFieldConditionKey(fieldDefinition.when).replace(/\[\d+\]$/, '')
										)
									] ?? [],
								]]
						)
					})
			),
		])
	) satisfies Partial<
		Record<string, Partial<Record<string, typeof resolverParts>>>
	>

	return {
		resolverDefinitions,
		resolverParts,
		resolverDefinitionsByEntityType,
		resolverValuePartsByEntityTypeAndFieldName,
		resolverCountPartsByEntityTypeAndFieldName,
		resolverLivePartsByEntityTypeAndFieldName,
		resolverRootLivePartsByEntityType,
		fieldNamesWithLiveResolverByEntityType,
		resolverDiscriminatorPartsByEntityTypeAndConditionKey,
		resolverIndexes: {
			resolverDefinitionsByEntityType,
			resolverParts,
			resolverValuePartsByEntityTypeAndFieldName,
			resolverCountPartsByEntityTypeAndFieldName,
			resolverLivePartsByEntityTypeAndFieldName,
			resolverRootLivePartsByEntityType,
			resolverDiscriminatorPartsByEntityTypeAndConditionKey,
			resolverPartsKey,
		} satisfies ResolverIndexes<_Schema, _Source, _Context>,
	}
}
