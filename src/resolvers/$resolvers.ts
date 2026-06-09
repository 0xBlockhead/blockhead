import type { QueryClient } from '@tanstack/query-core'
import type { LoadSubsetOptions } from '@tanstack/db'

import type { EntityFieldName, EntityFieldSingleResolvedValue, EntityId, EntityIdProjectionName, EntityType, Schema } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import type { Source } from '$/sources/Source.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'

export type ResolverFilter = {
	readonly fieldPath: readonly string[]
	readonly operator: 'eq' | 'in' | 'unknown'
	readonly value: unknown
}

export type ResolverSort = {
	readonly fieldPath: readonly string[]
	readonly direction: 'asc' | 'desc'
}

export type ResolverPagination = {
	readonly limit?: number
	readonly offset?: number
	readonly cursor?: unknown
}

export type ResolverSubset = {
	readonly Filters: readonly ResolverFilter[]
	readonly Sorts: readonly ResolverSort[]
	readonly Pagination: ResolverPagination
	readonly SourceFilter?: readonly string[]
	readonly IdentityFilter: readonly string[]
	readonly ParentIdentityFilter: readonly string[]
	readonly ir: LoadSubsetOptions
}

export type ResolverContext = ResolverSubset & {
	readonly publicEnv: SourcePublicEnv
}

export type SourceResolverContext<_Source extends Source> = Omit<ResolverContext, 'publicEnv'> & {
	readonly publicEnv: SourcePublicEnvFor<_Source>
}

/** When hydrate/live-query omits `LIMIT`, list field resolvers still need a cap. */
export const defaultResolverContextRowLimit = 64

export const resolverContextRowLimit = (
	context: ResolverContext,
) => context.Pagination.limit ?? defaultResolverContextRowLimit

export type ResolveLiveFieldHandle<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
> = {
	readonly replaceRows: (rows: readonly {
		source: string
		value: unknown
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
	readonly trigger: ResolverSubset & {
		readonly fieldName?: EntityFieldName<_Schema, _EntityType>
		readonly sources?: readonly string[]
	}
	readonly fields: ResolveLiveFields<_Schema, _EntityType>
}

type ResolveLivePublishers<
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
> = (
	| ((
		snapshot: _Snapshot,
		entityId: EntityId<_Schema, _EntityType>,
		context: ResolverContext,
	) => unknown)
	| {
		readonly parentSelectors?: readonly string[]
		readonly select?: (
			snapshot: _Snapshot,
			entityId: EntityId<_Schema, _EntityType>,
			context: ResolverContext,
		) => unknown
		readonly resolveCount?: (
			snapshot: _Snapshot,
			entityId: EntityId<_Schema, _EntityType>,
			context: ResolverContext,
		) => number
		readonly resolveLive?: {
			readonly start: (
				context: ResolveLivePublisherContext<_Schema, _EntityType> & {
					readonly field: _FieldName extends EntityFieldName<_Schema, _EntityType> ?
						ResolveLiveFieldHandle<_Schema, _EntityType, _FieldName>
					:
						never
				},
			) => void | (() => void) | Promise<void | (() => void)>
		}
		readonly partial?: boolean
	}
)


export type SourceResolverDefinition = {
	readonly definitionIndex: number
	readonly source: Source
	readonly entityType: EntityType<typeof schema>
	readonly resolve: Partial<Record<string, any>>
	readonly fields: Partial<Record<string, any>>
	readonly resolveLive?: ResolveLivePublishers<typeof schema, EntityType<typeof schema>>
}

export type ResolverPart = {
	readonly resolver: SourceResolverDefinition
	readonly partIndex: number
	readonly source: Source
	readonly entityType: EntityType<typeof schema>
	readonly fieldName: string
	readonly parentSelectors?: readonly string[]
	readonly select?: (
		snapshot: unknown,
		entityId: EntityId<Schema, EntityType<Schema>>,
		context: ResolverContext,
	) => unknown
	readonly resolveCount?: (
		snapshot: unknown,
		entityId: EntityId<Schema, EntityType<Schema>>,
		context: ResolverContext,
	) => number
	readonly resolveLive?: {
		readonly start: (context: Record<string, unknown>) => void | (() => void) | Promise<void | (() => void)>
	}
	readonly partial?: boolean
}

type ResolverSnapshot<_Resolve> = any

export const defineResolver = <
	const _Source extends Source,
	const _EntityType extends EntityType<typeof schema>,
	const _Resolve extends Partial<{
		readonly [_ProjectionName in EntityIdProjectionName]: (
			entityId: EntityId<typeof schema, _EntityType>,
			context: SourceResolverContext<_Source>,
		) => Promise<unknown>
	}>,
>(
	_source: _Source,
	resolver: {
	entityType: _EntityType
	resolve: _Resolve
	resolveLive?: ResolveLivePublishers<typeof schema, _EntityType>
},
) => (facets: {
	fields: Partial<{
		readonly [
			_FieldName in EntityFieldName<typeof schema, _EntityType>
		]: FieldSelector<typeof schema, _EntityType, _FieldName, ResolverSnapshot<_Resolve>>
	}>
}) => ({
	...resolver,
	...facets,
})
