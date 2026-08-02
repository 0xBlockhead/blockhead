import type { QueryClient } from '@tanstack/query-core'
import { extractSimpleComparisons, parseOrderByExpression } from '@tanstack/db'
import type { LoadSubsetOptions } from '@tanstack/db'
import { type as arktype } from 'arktype'

import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import type { EntityDefinition, EntityDefinitionForEntityType, EntityFacetDefinition, EntityFacetPath, EntityFieldDefinition, EntityFieldDefinitionByName, EntityFieldName, EntityFieldSingleResolvedValueFromDefinition, EntityReferenceValue, EntitySelector, EntitySelectorForSelectorName, EntitySelectorName, EntityType, Schema } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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

type ResolverFieldSingleValue<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
> = (
	EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
		readonly type: EntityFieldType.Primitive
	} ?
		EntityFieldSingleResolvedValueFromDefinition<
			_Schema,
			EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName>
		>
	: EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
		readonly type: EntityFieldType.EntityReference | EntityFieldType.EntitiesReference
		readonly entityType: infer _ReferencedEntityType extends EntityType<_Schema>
	} ?
		EntityReferenceValue<_Schema, _ReferencedEntityType>
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

type ProjectionResolverFieldSingleValue<
	_Schema extends Schema,
	_FieldDefinition extends EntityFieldDefinition,
> = (
	_FieldDefinition extends {
		readonly type: EntityFieldType.Primitive
	} ?
		EntityFieldSingleResolvedValueFromDefinition<_Schema, _FieldDefinition>
	: _FieldDefinition extends {
		readonly type: EntityFieldType.EntityReference | EntityFieldType.EntitiesReference
		readonly entityType: infer _ReferencedEntityType extends EntityType<_Schema>
	} ?
		EntityReferenceValue<_Schema, _ReferencedEntityType>
	:
		never
)

type ProjectionResolverFieldValue<
	_Schema extends Schema,
	_FieldDefinition extends EntityFieldDefinition,
> = (
	_FieldDefinition extends {
		readonly cardinality: EntityFieldCardinality.One
	} ?
		ProjectionResolverFieldSingleValue<_Schema, _FieldDefinition>
	: _FieldDefinition extends {
		readonly cardinality: EntityFieldCardinality.ZeroOrOne
	} ?
		ProjectionResolverFieldSingleValue<_Schema, _FieldDefinition> | undefined
	: _FieldDefinition extends {
		readonly cardinality: EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
	} ?
		readonly ProjectionResolverFieldSingleValue<_Schema, _FieldDefinition>[]
	:
		never
)

type ProjectionResolverSelect<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldDefinition extends EntityFieldDefinition,
	_Snapshot,
	_Context extends ResolverContext,
> = {
	select(
		snapshot: _Snapshot,
		entitySelector: EntitySelector<_Schema, _EntityType>,
		context: _Context
	): ProjectionResolverFieldValue<_Schema, _FieldDefinition>
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

export type ProviderContinuation = {
	readonly operation: string
	readonly target: string
	readonly viewerScope?: string
} & (
	| {
		readonly terminal: true
		readonly token?: never
	}
	| {
		readonly terminal: false
		readonly token: string
	}
)

type ResolverContinuation<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Snapshot,
	_Context extends ResolverContext,
> = (
	snapshot: _Snapshot,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	context: _Context
) => ProviderContinuation

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
	readonly providerContinuationToken?: string
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
	_FieldName extends string,
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
	_FieldName extends string = EntityFieldName<_Schema, _EntityType>,
> = {
	readonly [
		_Name in _FieldName
	]: ResolveLiveFieldHandle<_Schema, _EntityType, _Name>
} & {
	readonly invalidate: (fieldNames: readonly _FieldName[]) => void
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

type ResolveLivePublisherForFacetPath<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FacetPath extends EntityFacetPath,
	_FieldName extends string,
> = {
	readonly facetPath: _FacetPath
	readonly publishes: Partial<Record<_FieldName, true>>
	readonly start: (
		context: Omit<ResolveLivePublisherContext<_Schema, _EntityType>, 'fields'> & {
			readonly fields: ResolveLiveFields<_Schema, _EntityType, _FieldName>
		}
	) => void | (() => void) | Promise<void | (() => void)>
}

type ResolveLiveFacetPublishers<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Facets extends readonly EntityFacetDefinition[] | undefined,
	_ParentPath extends EntityFacetPath = readonly [],
> = NonNullable<_Facets>[number] extends infer _Facet extends EntityFacetDefinition ?
	_Facet extends EntityFacetDefinition ?
		| ResolveLivePublisherForFacetPath<
			_Schema,
			_EntityType,
			readonly [..._ParentPath, _Facet['name']],
			_Facet['fields'][number]['name']
		>
		| ResolveLiveFacetPublishers<
			_Schema,
			_EntityType,
			_Facet['facets'],
			readonly [..._ParentPath, _Facet['name']]
		>
	:
		never
:
	never

export type ResolveLivePublishers<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = {
	readonly [_PublisherName in string]: ResolveLivePublisherForFacetPath<
		_Schema,
		_EntityType,
		readonly [],
		EntityDefinitionForEntityType<_Schema, _EntityType>['fields'][number]['name']
	> | ResolveLiveFacetPublishers<
		_Schema,
		_EntityType,
		EntityDefinitionForEntityType<_Schema, _EntityType>['facets']
	>
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
			readonly continuation?: ResolverContinuation<_Schema, _EntityType, _Snapshot, _Context>
			readonly resolveCount?: ResolverCount<_Schema, _EntityType, _Snapshot, _Context>
			readonly resolveLive?: {
				readonly start: (
					context: ResolveLivePublisherContext<_Schema, _EntityType> & {
						readonly field: ResolveLiveFieldHandle<_Schema, _EntityType, EntityFieldName<_Schema, _EntityType>>
					}
				) => void | (() => void) | Promise<void | (() => void)>
			}
		}
	:
		never
)

export type ProjectionFieldSelector<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldDefinition extends EntityFieldDefinition,
	_Snapshot,
	_Context extends ResolverContext = ResolverContext,
> =
	| ProjectionResolverSelect<_Schema, _EntityType, _FieldDefinition, _Snapshot, _Context>
	| {
		readonly parentSelectors?: readonly string[]
		readonly select?: ProjectionResolverSelect<_Schema, _EntityType, _FieldDefinition, _Snapshot, _Context>
		readonly continuation?: ResolverContinuation<_Schema, _EntityType, _Snapshot, _Context>
		readonly resolveCount?: ResolverCount<_Schema, _EntityType, _Snapshot, _Context>
		readonly resolveLive?: {
			readonly start: (
				context: ResolveLivePublisherContext<_Schema, _EntityType> & {
					readonly field: ResolveLiveFieldHandle<_Schema, _EntityType, _FieldDefinition['name']>
				}
			) => void | (() => void) | Promise<void | (() => void)>
		}
	}

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
		readonly continuation?: (
			snapshot: ResolverValue,
			entitySelector: EntitySelector<Schema, EntityType<Schema>>,
			context: _Context
		) => ProviderContinuation
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

export type ResolverSelectorPattern<_Value> = (
	_Value extends ResolverComparable ?
		_Value
	: _Value extends readonly unknown[] ?
		never
	: _Value extends object ?
		{
			readonly [_Key in keyof _Value]?: ResolverSelectorPattern<_Value[_Key]>
		}
	:
		never
)

type ResolverSelectorEntry<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_SelectorName extends string,
	_Context extends ResolverContext,
	_Snapshot,
> = {
	readonly appliesTo?: readonly [
		ResolverSelectorPattern<EntitySelectorForSelectorName<_Schema, _EntityType, _SelectorName>>,
		...ResolverSelectorPattern<EntitySelectorForSelectorName<_Schema, _EntityType, _SelectorName>>[],
	]
	readonly resolve: ResolverResolve<_Schema, _EntityType, _Context, _Snapshot>
}

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

type IndexedResolveLivePublishers<
	_Schema extends Schema,
> = Readonly<Record<
	string,
	{
		readonly facetPath: EntityFacetPath
		readonly publishes: Partial<Record<string, true>>
		readonly start: (context: ResolveLivePublisherContext<_Schema, EntityType<_Schema>>) => void | (() => void) | Promise<void | (() => void)>
	}
>>

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
	readonly appliesTo: (
		selectorName: string,
		entitySelector: object
	) => boolean
	readonly projections: ResolverProjections<_Schema, _EntityType, _Context, _Snapshot>
	readonly resolveLive?: IndexedResolveLivePublishers<_Schema>
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
	readonly resolve: Partial<{
		readonly [_SelectorName in Extract<EntitySelectorName<_Schema, Extract<_EntityType, EntityType<_Schema>>>, string>]: ResolverSelectorEntry<
			_Schema,
			Extract<_EntityType, EntityType<_Schema>>,
			_SelectorName,
			_Context,
			_Snapshot
		>
	}>
	readonly projections: ResolverProjections<_Schema, Extract<_EntityType, EntityType<_Schema>>, _Context, _Snapshot>
	readonly resolveLive?: IndexedResolveLivePublishers<_Schema>
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
	readonly continuation?: (
		snapshot: ResolverValue,
		entitySelector: EntitySelector<_Schema, EntityType<_Schema>>,
		context: _Context
	) => ProviderContinuation
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
}

export type ResolverRootLivePart<
	_Schema extends Schema = Schema,
	_Source extends string = string,
	_Context extends ResolverContext = ResolverContext,
> = {
	readonly resolver: SourceResolverDefinition<_Schema, _Source, EntityType<_Schema>, _Context>
	readonly publisher: {
		readonly facetPath: EntityFacetPath
		readonly publishes: Partial<Record<string, true>>
		readonly start: (context: ResolveLivePublisherContext<_Schema, EntityType<_Schema>>) => void | (() => void) | Promise<void | (() => void)>
	}
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
	readonly resolverDefinitionsByEntityTypeAndSelectorName: Partial<Record<string, readonly SourceResolverDefinition<_Schema, _Source, EntityType<_Schema>, _Context>[]>>
	readonly resolverParts: readonly ResolverPart<_Schema, _Source, _Context>[]
	readonly resolverValuePartsByEntityTypeAndFieldName: Partial<Record<string, readonly ResolverPart<_Schema, _Source, _Context>[]>>
	readonly resolverValuePartsByEntityTypeSelectorAndFieldName: Partial<Record<string, readonly ResolverPart<_Schema, _Source, _Context>[]>>
	readonly resolverCountPartsByEntityTypeAndFieldName: Partial<Record<string, readonly ResolverPart<_Schema, _Source, _Context>[]>>
	readonly resolverCountPartsByEntityTypeSelectorAndFieldName: Partial<Record<string, readonly ResolverPart<_Schema, _Source, _Context>[]>>
	readonly resolverLivePartsByEntityTypeAndFieldName: Partial<Record<string, readonly ResolverPart<_Schema, _Source, _Context>[]>>
	readonly resolverLivePartsByEntityTypeSelectorAndFieldName: Partial<Record<string, readonly ResolverPart<_Schema, _Source, _Context>[]>>
	readonly resolverRootLivePartsByEntityType: Partial<Record<string, readonly ResolverRootLivePart<_Schema, _Source, _Context>[]>>
	readonly resolverPartsKey: {
		(entityType: string, fieldName: string): string
		(entityType: string, facetPath: EntityFacetPath, fieldName: string): string
		(entityType: string, selectorName: string, facetPath: EntityFacetPath, fieldName: string): string
	}
	readonly resolverDefinitionsKey: typeof resolverDefinitionsKey
}

export type SourceResolverModule<
	_Schema extends Schema,
	_Source extends string,
	_Context extends ResolverContext = ResolverContext,
> = {
	readonly source: _Source
	readonly resolvers: readonly {
		readonly [_EntityType in EntityType<_Schema>]: Omit<
			SourceResolverDefinitionCandidate<_Schema, _Source, _EntityType, _Context>,
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

const selectorPatternMatches = (
	pattern: object,
	value: object
): boolean => resolverValueEntries(pattern).every(([key, patternValue]) => {
	if (!Object.hasOwn(value, key))
		return false

	const valueAtKey = Object.getOwnPropertyDescriptor(value, key)?.value
	if (Object.prototype.toString.call(patternValue) === '[object Object]')
		return (
			Object.prototype.toString.call(valueAtKey) === '[object Object]'
			&& selectorPatternMatches(Object(patternValue), Object(valueAtKey))
		)

	return Object.is(patternValue, valueAtKey)
})

type ObjectEntry<_Object extends object> = Exclude<{
	readonly [_Key in keyof _Object]-?: readonly [
		Extract<_Key, string>,
		_Object[_Key],
	]
}[keyof _Object], undefined>

function entriesOf<
	const _Object extends object,
>(
	value: _Object
): ObjectEntry<_Object>[]
function entriesOf(
	value: object
) {
	return Object.entries(value)
}

const resolverValueEntries = (
	value: object
): readonly (readonly [string, ResolverValue])[] => Object.entries(value)

type ResolverPatternRuntimeType = {
	(value: unknown): unknown
	get(path: string): ResolverPatternRuntimeType
}

const validatePrimitiveApplicabilityValue = (
	resolver: {
		readonly source: string
		readonly entityType: string
	},
	selectorName: string,
	fieldDefinition: Extract<EntityFieldDefinition, { readonly type: EntityFieldType.Primitive }>,
	value: unknown,
	path: readonly string[]
) => {
	if (Array.isArray(value))
		throw new Error(`${resolver.source}:${resolver.entityType}.${selectorName} has forbidden pattern value at ${path.join('.')}`)
	if (value != null && typeof value === 'object') {
		const entries = resolverValueEntries(value)
		if (entries.length === 0)
			throw new Error(`${resolver.source}:${resolver.entityType}.${selectorName} has forbidden empty applicability pattern`)
		for (const [key, nestedValue] of entries)
			validatePrimitiveApplicabilityValue(
				resolver,
				selectorName,
				fieldDefinition,
				nestedValue,
				[
					...path,
					key,
				]
			)
		return
	}
	if (value === undefined)
		throw new Error(`${resolver.source}:${resolver.entityType}.${selectorName} has forbidden undefined applicability value at ${path.join('.')}`)

	try {
		// @ts-expect-error Generated SchemaType hides ArkType's runtime path accessor.
		let valueType = fieldDefinition.primitiveType as ResolverPatternRuntimeType
		for (const segment of path.slice(1))
			valueType = valueType.get(segment)
		if (valueType(value) instanceof arktype.errors)
			throw new Error('invalid')
	} catch {
		throw new Error(`${resolver.source}:${resolver.entityType}.${selectorName} has invalid pattern value at ${path.join('.')}`)
	}
}

const validateSelectorPatternObject = (
	schema: Schema,
	resolver: {
		readonly source: string
		readonly entityType: string
	},
	selectorName: string,
	entityDefinition: EntityDefinition,
	allowedFields: ReadonlySet<string>,
	pattern: object
) => {
	const entries = resolverValueEntries(pattern)
	if (entries.length === 0)
		throw new Error(`${resolver.source}:${resolver.entityType}.${selectorName} has forbidden empty applicability pattern`)

	for (const [fieldName, value] of entries) {
		if (!allowedFields.has(fieldName))
			throw new Error(`${resolver.source}:${resolver.entityType}.${selectorName} references unknown pattern field ${fieldName}`)
		const fieldDefinition = entityDefinition.fields.find((field) => field.name === fieldName)
		if (fieldDefinition == null)
			throw new Error(`${resolver.source}:${resolver.entityType}.${selectorName} references unknown pattern field ${fieldName}`)
		if (fieldDefinition.type === EntityFieldType.Primitive) {
			validatePrimitiveApplicabilityValue(
				resolver,
				selectorName,
				fieldDefinition,
				value,
				[
					fieldName,
				]
			)
			continue
		}
		if (Object.prototype.toString.call(value) !== '[object Object]')
			throw new Error(`${resolver.source}:${resolver.entityType}.${selectorName} has forbidden applicability value at ${fieldName}`)

		const referencedEntityDefinition = schema.find((candidate) => candidate.entityType === fieldDefinition.entityType)
		const referencedPatternFields = new Set(resolverValueEntries(Object(value)).map(([key]) => key))
		const referencedSelector = referencedEntityDefinition?.selectors.find((selector) => (
			[...referencedPatternFields].every((nestedFieldName) => new Set<string>(selector.fields).has(nestedFieldName))
		))
		if (referencedEntityDefinition == null || referencedSelector == null)
			throw new Error(`${resolver.source}:${resolver.entityType}.${selectorName} has invalid referenced selector applicability at ${fieldName}`)
		validateSelectorPatternObject(
			schema,
			resolver,
			selectorName,
			referencedEntityDefinition,
			new Set(referencedSelector.fields),
			Object(value)
		)
	}
}

const resolverProjectionPartCandidates = (
	resolver: {
		readonly source: string
		readonly entityType: string
	},
	projections: { readonly [name: string]: unknown },
	projectionFields: readonly EntityFieldDefinition[],
	facets: readonly EntityFacetDefinition[],
	facetPath: EntityFacetPath = []
): ResolverProjectionPartCandidate[] => {
	const fieldDefinitionByName = new Map(
		projectionFields.map((fieldDefinition) => [
			fieldDefinition.name,
			fieldDefinition,
		])
	)
	const facetByName = new Map(facets.map((facet) => [
		facet.name,
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

		const facet = facetByName.get(name)
		if (facet === undefined)
			throw new Error(`${resolver.source}:${resolver.entityType} references unknown projection path ${[...facetPath, name].join('.')}`)

		return resolverProjectionPartCandidates(
			resolver,
			fieldSelector as { readonly [name: string]: unknown },
			facet.fields,
			facet.facets ?? [],
			[
				...facetPath,
				name,
			]
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
			resolver.projections,
			entityDefinition.fields,
			entityDefinition.facets ?? []
		)

		if (resolverProjectionParts.length === 0)
			throw new Error(`${resolver.source}:${resolver.entityType} declares no fields`)

		for (const [selectorName, uncheckedSelectorEntry] of entriesOf(resolver.resolve)) {
			if (!entitySelectorNamesByEntityType[resolver.entityType]?.has(selectorName))
				throw new Error(`${resolver.source}:${resolver.entityType} references unknown selector ${selectorName}`)
			if (
				uncheckedSelectorEntry == null
				|| typeof uncheckedSelectorEntry !== 'object'
				|| Array.isArray(uncheckedSelectorEntry)
			)
				throw new Error(`${resolver.source}:${resolver.entityType}.${selectorName} must be a resolver selector entry`)
			const selectorEntry = uncheckedSelectorEntry as {
				readonly appliesTo?: unknown
				readonly resolve?: unknown
			}
			if (typeof selectorEntry.resolve !== 'function')
				throw new Error(`${resolver.source}:${resolver.entityType}.${selectorName} has no resolve function`)
			const appliesTo = selectorEntry.appliesTo
			if (
				appliesTo != null
				&& !Array.isArray(appliesTo)
			)
				throw new Error(`${resolver.source}:${resolver.entityType}.${selectorName} has forbidden applicability set`)
			if (appliesTo?.length === 0)
				throw new Error(`${resolver.source}:${resolver.entityType}.${selectorName} applicability set cannot be empty`)

			const selectorDefinition = entityDefinition.selectors.find((selector) => selector.name === selectorName)
			if (selectorDefinition == null)
				continue
			for (const pattern of appliesTo ?? []) {
				if (pattern == null || typeof pattern !== 'object' || Array.isArray(pattern))
					throw new Error(`${resolver.source}:${resolver.entityType}.${selectorName} has forbidden pattern`)
				validateSelectorPatternObject(
					schema,
					resolver,
					selectorName,
					entityDefinition,
					new Set(selectorDefinition.fields),
					pattern
				)
			}
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
				if (!Object.prototype.hasOwnProperty.call(resolver.resolve, parentSelectorName))
					throw new Error(`${resolver.source}:${resolver.entityType}.${fieldName} references unresolved parent selector ${parentSelectorName}`)
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

		for (const [publisherName, uncheckedPublisher] of Object.entries(
			(resolver.resolveLive ?? {}) as Readonly<Record<string, unknown>>
		)) {
			if (
				uncheckedPublisher == null
				|| typeof uncheckedPublisher !== 'object'
				|| Array.isArray(uncheckedPublisher)
			)
				throw new Error(`${resolver.source}:${resolver.entityType}.${publisherName} has malformed live publisher`)
			const publisher = uncheckedPublisher as {
				readonly facetPath?: unknown
				readonly publishes?: unknown
				readonly start?: unknown
			}
			if (Object.keys(publisher).some((key) => ![
				'facetPath',
				'publishes',
				'start',
			].includes(key)))
				throw new Error(`${resolver.source}:${resolver.entityType}.${publisherName} has unknown live publisher property`)
			if (
				!Array.isArray(publisher.facetPath)
				|| publisher.facetPath.some((facetName) => typeof facetName !== 'string')
			)
				throw new Error(`${resolver.source}:${resolver.entityType}.${publisherName} has malformed live facet path`)
			const facetPath = publisher.facetPath as string[]
			if (
				publisher.publishes == null
				|| typeof publisher.publishes !== 'object'
				|| Array.isArray(publisher.publishes)
				|| Object.keys(publisher.publishes).length === 0
				|| Object.values(publisher.publishes).some((published) => published !== true)
			)
				throw new Error(`${resolver.source}:${resolver.entityType}.${publisherName} has malformed live publishes set`)
			if (typeof publisher.start !== 'function')
				throw new Error(`${resolver.source}:${resolver.entityType}.${publisherName} has no live start function`)
			for (const liveFieldName of Object.keys(publisher.publishes)) {
				const liveResolverProjectionParts = resolverProjectionParts.filter((resolverProjectionPart) => (
					resolverProjectionPart.fieldName === liveFieldName
					&& resolverProjectionPart.facetPath.length === facetPath.length
					&& resolverProjectionPart.facetPath.every((segment, index) => segment === facetPath[index])
				))
				if (liveResolverProjectionParts.length === 0)
					throw new Error(`${resolver.source}:${resolver.entityType} publishes undeclared live field ${entityFieldAddressKey(resolver.entityType, facetPath, liveFieldName)}`)
			}
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
	selectorName: string,
	facetPath: EntityFacetPath,
	fieldName: string
): string
export function resolverPartsKey(
	entityType: string,
	selectorNameOrFacetPathOrFieldName: EntityFacetPath | string,
	facetPathOrFieldName?: EntityFacetPath | string,
	fieldName?: string
) {
	if (fieldName !== undefined)
		return JSON.stringify([
			entityType,
			selectorNameOrFacetPathOrFieldName,
			facetPathOrFieldName,
			fieldName,
		])

	return (
		typeof selectorNameOrFacetPathOrFieldName === 'string' ?
			entityFieldAddressKey(entityType, [], selectorNameOrFacetPathOrFieldName)
		:
			entityFieldAddressKey(entityType, selectorNameOrFacetPathOrFieldName, String(facetPathOrFieldName ?? ''))
	)
}

export const resolverDefinitionsKey = (
	entityType: string,
	selectorName: string
) => JSON.stringify([
	entityType,
	selectorName,
])

const resolverPartsByEntityTypeSelectorAndFieldName = <
	_Schema extends Schema,
	_Source extends string,
	_Context extends ResolverContext,
>(resolverParts: readonly ResolverPart<_Schema, _Source, _Context>[]) => Object.fromEntries(
	Object.entries(Object.groupBy(
		resolverParts.flatMap((resolverPart) => (
			resolverPart.parentSelectors
			?? Object.keys(resolverPart.resolver.resolve)
		).map((selectorName) => ({
				resolverPart,
				selectorName,
			}))),
		({ resolverPart, selectorName }) => resolverPartsKey(
			resolverPart.entityType,
			selectorName,
			resolverPart.facetPath,
			resolverPart.fieldName
		)
	)).map(([key, entries]) => [
		key,
		// oxlint-disable-next-line typescript/no-unnecessary-condition -- Object.groupBy values remain optional under tsc.
		(entries ?? []).map(({ resolverPart }) => resolverPart),
	])
)

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
	const resolverDefinitionCandidates = resolverModules
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

	validateResolverDefinitions(schema, resolverDefinitionCandidates)

	const resolverDefinitions: SourceResolverDefinition<_Schema, _Source, EntityType<_Schema>, _Context>[] = resolverDefinitionCandidates.map(({
		resolve,
		...resolver
	}) => {
		const selectorEntries = entriesOf(resolve)
		const selectorApplicabilityByName = new Map<
			string,
			(entitySelector: object) => boolean
		>(selectorEntries.map(([selectorName, selectorEntry]) => {
			if (selectorEntry == null)
				throw new Error(`${resolver.source}:${resolver.entityType}.${selectorName} has no selector entry`)

			const appliesTo = selectorEntry.appliesTo
			return [
				selectorName,
				appliesTo == null ?
					() => true
				:
					(entitySelector: object) => (
						appliesTo.some((pattern) => selectorPatternMatches(pattern, entitySelector))
					),
			]
		}))
		return {
			...resolver,
			resolve: Object.fromEntries(selectorEntries.map(([selectorName, selectorEntry]) => {
				if (selectorEntry == null)
					throw new Error(`${resolver.source}:${resolver.entityType}.${selectorName} has no selector entry`)

				return [
					selectorName,
					selectorEntry.resolve,
				]
			})),
				appliesTo: (selectorName, entitySelector) => (
					selectorApplicabilityByName.get(selectorName)?.(entitySelector)
					?? false
				),
		}
	})

	const resolverDefinitionsByEntityType = Object.groupBy(
		resolverDefinitions,
		(resolver) => String(resolver.entityType)
	)
	const resolverDefinitionsByEntityTypeAndSelectorName = Object.fromEntries(
		Object.entries(Object.groupBy(
			resolverDefinitions.flatMap((resolver) => Object.keys(resolver.resolve).map((selectorName) => ({
				resolver,
				selectorName,
			}))),
			({ resolver, selectorName }) => resolverDefinitionsKey(
				resolver.entityType,
				selectorName
			)
		)).map(([key, entries]) => [
			key,
			// oxlint-disable-next-line typescript/no-unnecessary-condition -- Object.groupBy values remain optional under tsc.
			(entries ?? []).map(({ resolver }) => resolver),
		])
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
			resolver.projections,
			entityDefinition.fields,
			entityDefinition.facets ?? []
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
					continuation: fieldSelector.continuation,
					resolveCount: fieldSelector.resolveCount,
					resolveLive: fieldSelector.resolveLive,
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
	const resolverValuePartsByEntityTypeSelectorAndFieldName = resolverPartsByEntityTypeSelectorAndFieldName(
		resolverParts.filter((resolverPart) => resolverPart.select != null)
	)
	const resolverCountPartsByEntityTypeAndFieldName = Object.groupBy(
		resolverParts.filter((resolverPart) => resolverPart.resolveCount != null),
		(resolverPart) => resolverPartsKey(
			resolverPart.entityType,
			resolverPart.facetPath,
			resolverPart.fieldName
		)
	)
	const resolverCountPartsByEntityTypeSelectorAndFieldName = resolverPartsByEntityTypeSelectorAndFieldName(
		resolverParts.filter((resolverPart) => resolverPart.resolveCount != null)
	)
	const resolverLivePartsByEntityTypeAndFieldName = Object.groupBy(
		resolverParts.filter((resolverPart) => resolverPart.resolveLive != null),
		(resolverPart) => resolverPartsKey(
			resolverPart.entityType,
			resolverPart.facetPath,
			resolverPart.fieldName
		)
	)
	const resolverLivePartsByEntityTypeSelectorAndFieldName = resolverPartsByEntityTypeSelectorAndFieldName(
		resolverParts.filter((resolverPart) => resolverPart.resolveLive != null)
	)
	const resolverRootLiveParts = resolverDefinitions.flatMap((resolver) => (
		Object.entries(resolver.resolveLive ?? {}).map(([publisherName, publisher]) => ({
			resolver,
			publisher,
			publisherName,
			source: resolver.source,
			entityType: resolver.entityType,
			facetPath: publisher.facetPath,
		}))
	))
	const resolverRootLivePartsByEntityType = Object.groupBy(
		resolverRootLiveParts,
		(part) => String(part.entityType)
	)
	const liveFieldNamesByEntityType = new Map<string, Set<string>>()
	for (const liveField of [
		...resolverRootLiveParts.flatMap((part) => (
			Object.keys(part.publisher.publishes).map((fieldName) => ({
				entityType: part.entityType,
				fieldName,
			}))
		)),
		...resolverParts
			.filter((resolverPart) => resolverPart.resolveLive != null)
			.map((resolverPart) => ({
				entityType: resolverPart.entityType,
				fieldName: resolverPart.fieldName,
			})),
	]) {
		const entityType = String(liveField.entityType)
		const fieldNames = liveFieldNamesByEntityType.get(entityType)
		if (fieldNames === undefined)
			liveFieldNamesByEntityType.set(entityType, new Set([
				liveField.fieldName,
			]))
		else
			fieldNames.add(liveField.fieldName)
	}
	const fieldNamesWithLiveResolverByEntityType = Object.fromEntries(
		[...liveFieldNamesByEntityType]
			.toSorted(([leftEntityType], [rightEntityType]) => leftEntityType.localeCompare(rightEntityType, 'en'))
			.map(([entityType, fieldNames]) => [
				entityType,
				[...fieldNames].toSorted((leftFieldName, rightFieldName) => leftFieldName.localeCompare(rightFieldName, 'en')),
			])
	)
	return {
		resolverDefinitions,
		resolverParts,
		resolverDefinitionsByEntityType,
		resolverDefinitionsByEntityTypeAndSelectorName,
		resolverValuePartsByEntityTypeAndFieldName,
		resolverValuePartsByEntityTypeSelectorAndFieldName,
		resolverCountPartsByEntityTypeAndFieldName,
		resolverCountPartsByEntityTypeSelectorAndFieldName,
		resolverLivePartsByEntityTypeAndFieldName,
		resolverLivePartsByEntityTypeSelectorAndFieldName,
		resolverRootLivePartsByEntityType,
		fieldNamesWithLiveResolverByEntityType,
		resolverIndexes: {
			resolverDefinitionsByEntityType,
			resolverDefinitionsByEntityTypeAndSelectorName,
			resolverParts,
			resolverValuePartsByEntityTypeAndFieldName,
			resolverValuePartsByEntityTypeSelectorAndFieldName,
			resolverCountPartsByEntityTypeAndFieldName,
			resolverCountPartsByEntityTypeSelectorAndFieldName,
			resolverLivePartsByEntityTypeAndFieldName,
			resolverLivePartsByEntityTypeSelectorAndFieldName,
			resolverRootLivePartsByEntityType,
			resolverDefinitionsKey,
			resolverPartsKey,
		} satisfies ResolverIndexes<_Schema, _Source, _Context>,
	}
}
