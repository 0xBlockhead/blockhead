import type { QueryClient } from '@tanstack/query-core'

import type { EntityIdProjectionName } from '$/schema/$EntityDefinition.ts'
import type { EntityFieldName, EntityId, EntityType, Schema } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import type { Source } from '$/sources/$Source.ts'

export type ResolverContext = {
	filters: readonly ResolverFilter[]
	sorts: readonly unknown[]
	limit?: number
	publicEnv: any
}

export type ResolverFilter = {
	field: readonly (string | number)[]
	operator: string
	value?: unknown
}

/** When hydrate/live-query omits `LIMIT`, list field resolvers still need a cap. */
export const defaultResolverContextRowLimit = 64

export const resolverContextRowLimit = (
	context: ResolverContext,
) => context.limit ?? defaultResolverContextRowLimit

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
	acceptsParent?: readonly EntityIdProjectionName[]
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
	accepts: readonly EntityIdProjectionName[]
	resolve: (
		entityId: EntityId<_Schema, _EntityType>,
		context: ResolverContext,
	) => Promise<_Snapshot>
	fields: Partial<Record<EntityFieldName<_Schema, _EntityType>, FieldSelector<_Schema, _EntityType, _Snapshot>>>
	resolveLive?: {
		fields: readonly EntityFieldName<_Schema, _EntityType>[]
		run: (
			context: ResolveLiveContext<_Schema, _EntityType>,
		) => void | (() => void) | Promise<void | (() => void)>
	}
}

export type SourceResolverDefinition = {
	definitionIndex: number
	entityType: EntityType<typeof schema>
	accepts: readonly EntityIdProjectionName[]
	resolve: (
		entityId: any,
		context: ResolverContext,
	) => Promise<any>
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
	acceptsParent?: readonly EntityIdProjectionName[]
	select?: FieldSelectorObject<typeof schema, EntityType<typeof schema>, any>['select']
	resolveCount?: FieldSelectorObject<typeof schema, EntityType<typeof schema>, any>['resolveCount']
	resolveLive?: FieldSelectorObject<typeof schema, EntityType<typeof schema>, any>['resolveLive']
}

export const defineResolver = <
	const _EntityType extends EntityType<typeof schema>,
>(
	resolver: {
		entityType: _EntityType
		accepts: readonly EntityIdProjectionName[]
		resolve: (
			entityId: EntityId<typeof schema, _EntityType>,
			context: ResolverContext,
		) => Promise<any>
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
