import type { QueryClient } from '@tanstack/query-core'
import { extractSimpleComparisons, parseOrderByExpression } from '@tanstack/db'
import type { LoadSubsetOptions } from '@tanstack/db'

import { EntityFieldCardinality, EntityMetaKey, entityFieldConditionKey, entityFieldDefinitions, entityIdProjectionNames } from '$/schema/$schema.ts'
import type { EntityFieldName, EntityId, EntityType, Schema } from '$/schema/$schema.ts'
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

type ResolverSelect<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Snapshot,
	_Context extends ResolverContext,
> = {
	select(
		snapshot: _Snapshot,
		entityId: EntityId<_Schema, _EntityType>,
		context: _Context,
	): ResolverValue
}['select']

type ResolverCount<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Snapshot,
	_Context extends ResolverContext,
> = {
	resolveCount(
		snapshot: _Snapshot,
		entityId: EntityId<_Schema, _EntityType>,
		context: _Context,
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
	readonly identityKeys: readonly string[]
	readonly parentIdentityKeys: readonly string[]
}

export type ResolverContext = ResolverSubset & {
	readonly publicEnv: SourcePublicEnv
}

const plainResolverFilterValue = (
	value: unknown,
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
	seen = new WeakSet<object>(),
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
				Object.entries(value).map(([key, child]) => [
					key,
					plainLoadSubsetKeyValue(child, seen),
				])
			)
		)
	:
		String(value)
)

export const parseResolverSubset = (
	request: LoadSubsetOptions,
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
	const sources = filters.flatMap((filter) => {
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
		sources: sources.length === 0 ? undefined : sources,
		identityKeys: filters.flatMap((filter) => {
			if (filter.fieldPath[0] !== EntityMetaKey.IdKey)
				return []
			if (filter.operator === 'eq') {
				if (typeof filter.value !== 'string')
					throw new Error(`Resolver Subset Parser expected string ${EntityMetaKey.IdKey} equality value`)
				return [filter.value]
			}
			if (!Array.isArray(filter.value) || !filter.value.every((item) => typeof item === 'string'))
				throw new Error(`Resolver Subset Parser expected string ${EntityMetaKey.IdKey} inclusion values`)
			return filter.value
		}),
		parentIdentityKeys: filters.flatMap((filter) => {
			if (filter.fieldPath[0] !== EntityMetaKey.ParentIdKey)
				return []
			if (filter.operator === 'eq') {
				if (typeof filter.value !== 'string')
					throw new Error(`Resolver Subset Parser expected string ${EntityMetaKey.ParentIdKey} equality value`)
				return [filter.value]
			}
			if (!Array.isArray(filter.value) || !filter.value.every((item) => typeof item === 'string'))
				throw new Error(`Resolver Subset Parser expected string ${EntityMetaKey.ParentIdKey} inclusion values`)
			return filter.value
		}),
	}
}

export const fieldLoadedSubsetKey = (
	request: LoadSubsetOptions,
): LoadSubsetKeyObject => ({
	...(request.where != null && {
		where: plainLoadSubsetKeyValue(request.where),
	}),
	...(request.orderBy != null && {
		orderBy: plainLoadSubsetKeyValue(request.orderBy),
	}),
	...(request.limit != null && {
		limit: request.limit,
	}),
	...(request.offset != null && {
		offset: request.offset,
	}),
	...(request.cursor != null && {
		cursor: plainLoadSubsetKeyValue(request.cursor),
	}),
})

export const countLoadedSubsetKey = (
	request: LoadSubsetOptions,
): LoadSubsetKeyObject => ({
	...(request.where != null && {
		where: plainLoadSubsetKeyValue(request.where),
	}),
})

/** When hydrate/live-query omits `LIMIT`, list field resolvers still need a cap. */
export const defaultResolverContextRowLimit = 64

export const resolverContextRowLimit = (
	context: ResolverContext,
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
	readonly parentEntityId: EntityId<_Schema, _EntityType>
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
			context: ResolveLivePublisherContext<_Schema, _EntityType>,
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
	| ResolverSelect<_Schema, _EntityType, _Snapshot, _Context>
	| {
		readonly parentSelectors?: readonly string[]
		readonly select?: ResolverSelect<_Schema, _EntityType, _Snapshot, _Context>
		readonly resolveCount?: ResolverCount<_Schema, _EntityType, _Snapshot, _Context>
		readonly resolveLive?: {
			readonly start: (
				context: ResolveLivePublisherContext<_Schema, _EntityType> & {
					readonly field: ResolveLiveFieldHandle<_Schema, _EntityType, EntityFieldName<_Schema, _EntityType>>
				},
			) => void | (() => void) | Promise<void | (() => void)>
		}
		readonly partial?: boolean
	}
)

type ResolverResolve<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Context extends ResolverContext,
> = {
	resolve(
		entityId: EntityId<_Schema, _EntityType>,
		context: _Context,
	): ResolverValue | Promise<ResolverValue>
}['resolve']


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
	readonly resolve: Partial<Record<string, ResolverResolve<_Schema, _EntityType, _Context>>>
	readonly fields: Partial<Record<string, FieldSelector<_Schema, _EntityType, EntityFieldName<_Schema, _EntityType>, _Snapshot, _Context>>> & Partial<{
		readonly [
			_FieldName in EntityFieldName<_Schema, _EntityType>
		]: FieldSelector<_Schema, _EntityType, _FieldName, _Snapshot, _Context>
	}>
	readonly resolveLive?: ResolveLivePublishers<_Schema, _EntityType>
}

export type ResolverPart<
	_Schema extends Schema = Schema,
	_Source extends string = string,
> = {
	readonly resolver: SourceResolverDefinition<_Schema, _Source>
	readonly partIndex: number
	readonly source: _Source
	readonly entityType: EntityType<_Schema>
	readonly fieldName: string
	readonly parentSelectors?: readonly string[]
	readonly select?: (
		snapshot: ResolverValue,
		entityId: EntityId<_Schema, EntityType<_Schema>>,
		context: ResolverContext,
	) => ResolverValue
	readonly resolveCount?: (
		snapshot: ResolverValue,
		entityId: EntityId<_Schema, EntityType<_Schema>>,
		context: ResolverContext,
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
> = {
	readonly resolver: SourceResolverDefinition<_Schema, _Source>
	readonly publisher: ResolveLivePublishers<_Schema, EntityType<_Schema>>[string]
	readonly publisherName: string
	readonly source: _Source
	readonly entityType: EntityType<_Schema>
}

export type ResolverIndexes<
	_Schema extends Schema = Schema,
	_Source extends string = string,
> = {
	readonly resolverDefinitionsByEntityType: Partial<Record<string, readonly SourceResolverDefinition<_Schema, _Source>[]>>
	readonly resolverParts: readonly ResolverPart<_Schema, _Source>[]
	readonly resolverValuePartsByEntityTypeAndFieldName: Partial<Record<string, readonly ResolverPart<_Schema, _Source>[]>>
	readonly resolverCountPartsByEntityTypeAndFieldName: Partial<Record<string, readonly ResolverPart<_Schema, _Source>[]>>
	readonly resolverLivePartsByEntityTypeAndFieldName: Partial<Record<string, readonly ResolverPart<_Schema, _Source>[]>>
	readonly resolverRootLivePartsByEntityType: Partial<Record<string, readonly ResolverRootLivePart<_Schema, _Source>[]>>
	readonly resolverDiscriminatorPartsByEntityTypeAndConditionKey: Partial<Record<string, Partial<Record<string, readonly ResolverPart<_Schema, _Source>[]>>>>
	readonly resolverPartsKey: (entityType: string, fieldName: string) => string
}

export type SourceResolverModule<
	_Schema extends Schema,
	_Source extends string,
> = {
	readonly source: _Source
	readonly resolvers: readonly Omit<
		SourceResolverDefinition<_Schema, _Source>,
		'definitionIndex' | 'source'
	>[]
}

export const validateResolverDefinitions = <
	_Schema extends Schema,
	_Source extends string,
>(
	schema: _Schema,
	resolverDefinitions: readonly SourceResolverDefinition<_Schema, _Source>[],
) => {
	const fieldDefinitionByEntityTypeAndFieldName = Object.fromEntries(
		schema.map((entityDefinition) => [
			entityDefinition.entityType,
			Object.fromEntries(
				entityFieldDefinitions(entityDefinition).map((fieldDefinition) => [
					fieldDefinition.name,
					fieldDefinition,
				]),
			),
		]),
	)
	const entityIdProjectionNamesByEntityType = Object.fromEntries(
		schema.map((entityDefinition) => [
			entityDefinition.entityType,
			new Set(entityIdProjectionNames(entityDefinition)),
		]),
	)

	for (const resolver of resolverDefinitions) {
		if (!schema.some((entityDefinition) => entityDefinition.entityType === resolver.entityType))
			throw new Error(`${resolver.source}:${resolver.entityType} references unknown entity`)

		for (const projectionName of Object.keys(resolver.resolve)) {
			if (!entityIdProjectionNamesByEntityType[resolver.entityType]?.has(projectionName))
				throw new Error(`${resolver.source}:${resolver.entityType} references unknown id projection ${projectionName}`)
		}

		for (const fieldName of Object.keys(resolver.fields)) {
			const fieldSelector = resolver.fields[fieldName]
			if (!(fieldName in fieldDefinitionByEntityTypeAndFieldName[resolver.entityType]))
				throw new Error(`${resolver.source}:${resolver.entityType} references unknown field ${fieldName}`)

			const fieldDefinition = fieldDefinitionByEntityTypeAndFieldName[resolver.entityType][fieldName]

			if (fieldSelector == null)
				continue

			if (
				typeof fieldSelector === 'function'
				&& fieldSelector.constructor.name === 'AsyncFunction'
			)
				throw new Error(`${resolver.source}:${resolver.entityType}.${fieldName} has async field selector`)

			if (typeof fieldSelector === 'function')
				continue

			for (const acceptedParentProjectionName of fieldSelector.parentSelectors ?? []) {
				if (!entityIdProjectionNamesByEntityType[resolver.entityType]?.has(acceptedParentProjectionName))
					throw new Error(`${resolver.source}:${resolver.entityType}.${fieldName} references unknown parent id projection ${acceptedParentProjectionName}`)
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
			for (const liveFieldName of Object.keys(publisher.publishes)) {
				if (!(liveFieldName in fieldDefinitionByEntityTypeAndFieldName[resolver.entityType]))
					throw new Error(`${resolver.source}:${resolver.entityType} references unknown live field ${liveFieldName}`)
			}
		}
	}
}

export const resolverPartsKey = (
	entityType: string,
	fieldName: string,
) => `${entityType}${fieldName}`

export const indexResolvers = <
	const _Schema extends Schema,
	const _Source extends string,
>(
	schema: _Schema,
	resolverModules: readonly SourceResolverModule<_Schema, _Source>[],
	enabledSources: ReadonlySet<_Source>,
) => {
	const resolverDefinitions: SourceResolverDefinition<_Schema, _Source>[] = resolverModules
		.filter((module) => enabledSources.has(module.source))
		.flatMap((module) => (
			module.resolvers.map((resolver) => ({
				...resolver,
				source: module.source,
			}))
		))
		.map((resolver, definitionIndex) => ({
			...resolver,
			definitionIndex,
		}))

	validateResolverDefinitions(schema, resolverDefinitions)

	const resolverDefinitionsByEntityType = Object.groupBy(
		resolverDefinitions,
		(resolver) => resolver.entityType,
	)
	const resolverParts: ResolverPart<_Schema, _Source>[] = []
	for (const resolver of resolverDefinitions) {
		let partIndex = 0
		for (const fieldName of Object.keys(resolver.fields)) {
			const fieldSelector = resolver.fields[fieldName]
			if (fieldSelector == null)
				continue

			if (typeof fieldSelector === 'function') {
				resolverParts.push({
					resolver,
					partIndex,
					source: resolver.source,
					entityType: resolver.entityType,
					fieldName,
					select: fieldSelector,
				})
			} else {
				resolverParts.push({
					resolver,
					partIndex,
					source: resolver.source,
					entityType: resolver.entityType,
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
			resolverPart.fieldName,
		),
	)
	const resolverCountPartsByEntityTypeAndFieldName = Object.groupBy(
		resolverParts.filter((resolverPart) => resolverPart.resolveCount != null),
		(resolverPart) => resolverPartsKey(
			resolverPart.entityType,
			resolverPart.fieldName,
		),
	)
	const resolverLivePartsByEntityTypeAndFieldName = Object.groupBy(
		resolverParts.filter((resolverPart) => resolverPart.resolveLive != null),
		(resolverPart) => resolverPartsKey(
			resolverPart.entityType,
			resolverPart.fieldName,
		),
	)
	const resolverRootLivePartsByEntityType = Object.groupBy(
		resolverDefinitions.flatMap((resolver) => (
			Object.entries(resolver.resolveLive ?? {}).map(([publisherName, publisher]) => ({
				resolver,
				publisher,
				publisherName,
				source: resolver.source,
				entityType: resolver.entityType,
			}))
		)),
		(part) => part.entityType,
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
			(liveField) => liveField.entityType,
		))
			.map(([entityType, liveFields]) => [
				entityType,
				[...new Set(liveFields.map((liveField) => liveField.fieldName))],
			]),
	)
	const resolverDiscriminatorPartsByEntityTypeAndConditionKey = Object.fromEntries(
		schema.map((entityDefinition) => [
			entityDefinition.entityType,
			Object.fromEntries(
				entityFieldDefinitions(entityDefinition)
					.flatMap((fieldDefinition) => {
						const when = 'when' in fieldDefinition ? fieldDefinition.when : undefined
						return (
							when == null ?
								[]
							:
								[[
									entityFieldConditionKey(when),
									resolverValuePartsByEntityTypeAndFieldName[
										resolverPartsKey(entityDefinition.entityType, when.fieldName)
									] ?? [],
								]]
						)
					}),
			),
		]),
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
		} satisfies ResolverIndexes<_Schema, _Source>,
	}
}
