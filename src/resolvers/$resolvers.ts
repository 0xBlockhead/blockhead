import type { QueryClient } from '@tanstack/query-core'

import type { EntityIdProjectionName } from '$/schema/$EntityDefinition.ts'
import type { EntityFieldName, EntityId, EntityType, Schema } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import type { Source, SourcePublicEnv } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'

export type ResolverContext = {
	Filters: readonly ResolverFilter[]
	Sorts: readonly ResolverSort[]
	Pagination: ResolverPagination
	IdentityFilter: readonly string[]
	ParentIdentityFilter: readonly string[]
	SourceFilter: readonly Source[]
	publicEnv: SourcePublicEnv
}

export type SourceResolverContext<_Source extends Source> = Omit<ResolverContext, 'publicEnv'> & {
	publicEnv: SourcePublicEnvFor<_Source>
}

export type ResolverFilter = {
	fieldPath: readonly (string | number)[]
	operator: string
	value?: unknown
}

export type ResolverSort = {
	fieldPath: readonly (string | number)[]
	direction: 'asc' | 'desc'
}

export type ResolverPagination = {
	limit?: number
}

/** When hydrate/live-query omits `LIMIT`, list field resolvers still need a cap. */
export const defaultResolverContextRowLimit = 64

export const resolverContextRowLimit = (
	context: ResolverContext,
) => context.Pagination.limit ?? defaultResolverContextRowLimit

export type ResolveLiveContext<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = {
	parentEntityId: EntityId<_Schema, _EntityType>
	queryClient: QueryClient
	signal: AbortSignal
	invalidateFields: (fieldNames: readonly string[]) => void
	invalidateCounts: (fieldNames: readonly string[]) => void
	writeFieldRows: (fieldName: EntityFieldName<_Schema, _EntityType>, rows: readonly {
		source: Source
		value: unknown
	}[]) => void
	writeFieldCounts: (fieldName: EntityFieldName<_Schema, _EntityType>, rows: readonly {
		source: Source
		value: number
	}[]) => void
}

type FieldSelectorObject<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Snapshot,
> = {
	parentSelectors?: readonly EntityIdProjectionName[]
	select?: (
		snapshot: _Snapshot,
		entityId: EntityId<_Schema, _EntityType>,
		context: ResolverContext,
	) => unknown
	resolveCount?: (
		snapshot: _Snapshot,
		entityId: EntityId<_Schema, _EntityType>,
		context: ResolverContext,
	) => number
	resolveLive?: (
		context: ResolveLiveContext<_Schema, _EntityType>,
	) => void | (() => void) | Promise<void | (() => void)>
}

export type FieldSelector<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Snapshot,
> = (
	| ((
		snapshot: _Snapshot,
		entityId: EntityId<_Schema, _EntityType>,
		context: ResolverContext,
	) => unknown)
	| FieldSelectorObject<_Schema, _EntityType, _Snapshot>
)

export type ResolverDefinition<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Snapshot,
> = {
	entityType: _EntityType
	resolve: Partial<Record<EntityIdProjectionName, (
		entityId: EntityId<_Schema, _EntityType>,
		context: ResolverContext,
	) => Promise<_Snapshot>>>
	fields: Partial<Record<EntityFieldName<_Schema, _EntityType>, FieldSelector<_Schema, _EntityType, _Snapshot>>>
	resolveLive?: {
		fields: readonly EntityFieldName<_Schema, _EntityType>[]
		run: (
			context: ResolveLiveContext<_Schema, _EntityType>,
		) => void | (() => void) | Promise<void | (() => void)>
	}
}

type SourceResolverFunction<_Context> = {
	resolve(
		entityId: any,
		context: _Context,
	): Promise<any>
}['resolve']

export type SourceResolverDefinition = {
	definitionIndex: number
	entityType: EntityType<typeof schema>
	resolve: Partial<Record<EntityIdProjectionName, SourceResolverFunction<ResolverContext>>>
	fields: Partial<Record<string, any>>
	resolveLive?: {
		fields: readonly EntityFieldName<typeof schema, EntityType<typeof schema>>[]
		run: (
			context: ResolveLiveContext<typeof schema, EntityType<typeof schema>>,
		) => void | (() => void) | Promise<void | (() => void)>
	}
	source: Source
}

export type ResolverPart = {
	resolver: SourceResolverDefinition
	partIndex: number
	source: Source
	entityType: EntityType<typeof schema>
	fieldName: EntityFieldName<typeof schema, EntityType<typeof schema>>
	parentSelectors?: readonly EntityIdProjectionName[]
	select?: FieldSelectorObject<typeof schema, EntityType<typeof schema>, any>['select']
	resolveCount?: FieldSelectorObject<typeof schema, EntityType<typeof schema>, any>['resolveCount']
	resolveLive?: FieldSelectorObject<typeof schema, EntityType<typeof schema>, any>['resolveLive']
}

export const defineResolver = <
	const _Source extends Source,
	const _EntityType extends EntityType<typeof schema>,
>(
	_source: _Source,
	resolver: {
		entityType: _EntityType
		resolve: Partial<Record<EntityIdProjectionName, (
			entityId: EntityId<typeof schema, _EntityType>,
			context: SourceResolverContext<_Source>,
		) => Promise<any>>>
		fields: Partial<Record<
			EntityFieldName<typeof schema, _EntityType>,
			FieldSelector<typeof schema, _EntityType, any>
		>>
		resolveLive?: {
			fields: readonly EntityFieldName<typeof schema, _EntityType>[]
			run: (
				context: ResolveLiveContext<typeof schema, _EntityType>,
			) => void | (() => void) | Promise<void | (() => void)>
		}
	},
) => resolver
