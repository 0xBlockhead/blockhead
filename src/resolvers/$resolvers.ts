import type { QueryClient } from '@tanstack/query-core'
import { parseLoadSubsetOptions } from '@tanstack/svelte-db'

import type {
	EntityFieldValue,
	EntityFieldValues,
	EntityId,
	EntityType,
	Schema,
} from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import type { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'

export type ResolverLoadSubset<_Source extends Source = Source> = ReturnType<typeof parseLoadSubsetOptions> & {
	/** Keys validated by provider+source env schemas for this resolver’s source (empty object when no env schema exists). */
	publicEnv: SourcePublicEnvFor<_Source>
}

/** `loadSubsetOptions.limit` from the live query (undefined when the query has no `LIMIT`). */
export const resolverLoadSubsetRowLimit = (
	context: ResolverLoadSubset | undefined,
): number | undefined => context?.limit

export const sourcePublicEnv = <_Source extends Source>(
	context: ResolverLoadSubset | undefined,
	_source: _Source,
): SourcePublicEnvFor<_Source> => (
	(context?.publicEnv ?? {}) as SourcePublicEnvFor<_Source>
)

export type ResolveLiveContext<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = {
	parentEntityId: EntityId<_Schema, _EntityType>
	queryClient: QueryClient
	signal: AbortSignal
	invalidate: (
		fieldNames: readonly string[],
		options?: {
			parentEntityIds?: readonly EntityId<_Schema, _EntityType>[]
			sources?: readonly Source[]
		},
	) => void | Promise<void>
	/**
	 * Deletes entity-field rows for the given field whose parent matches `parentEntityIds`
	 * (default: current `parentEntityId`) and optional `sources` filter.
	 */
	deleteEntityFieldRows: (
		fieldName: string,
		options?: {
			parentEntityIds?: readonly EntityId<_Schema, _EntityType>[]
			sources?: readonly Source[]
		},
	) => void
	/** Direct TanStack DB query-collection upserts (no refetch). */
	writeEntityFieldUpserts: (
		fieldName: string,
		rows: readonly {
			parentEntityId?: EntityId<_Schema, _EntityType>
			parentIdKey?: string
			source: Source
			value: unknown
		}[],
	) => void
}

export type EntityLiveResolver<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = {
	entityType: _EntityType
	source: Source
	resolveLive: (ctx: ResolveLiveContext<_Schema, _EntityType>) => (
		void
		| Promise<void>
		| (() => void)
		| Promise<() => void>
	)
}

export type EntityLiveResolverDefinition<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = Omit<EntityLiveResolver<_Schema, _EntityType>, 'source'>

export type EntityResolver<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = {
	entityType: _EntityType
	source: Source
	resolve: (
		entityId: EntityId<_Schema, _EntityType>,
		context?: ResolverLoadSubset,
	) => Promise<Partial<EntityFieldValues<_Schema, _EntityType>>>
}

export type EntityResolverDefinition<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = Omit<EntityResolver<_Schema, _EntityType>, 'source'>

export type EntityFieldResolver<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_ResolverFieldKey extends string = string,
> = {
	entityType: _EntityType
	fieldName: _ResolverFieldKey
	source: Source
	/** Long-running sync; wire via `useEntityFieldResolveLive` / `runEntityFieldResolveLiveForParent` in `$/lib/db/resolveLive.svelte.ts` (default field list: `entityFieldNamesWithResolveLiveByEntityType` from `$/resolvers/index.ts`). */
	resolveLive?: (ctx: ResolveLiveContext<_Schema, _EntityType>) => (
		void
	| Promise<void>
	| (() => void)
	| Promise<() => void>
	)
	resolve: (
		scopedEntityId: EntityId<_Schema, _EntityType>,
		context?: ResolverLoadSubset,
	) => Promise<EntityFieldValue<_Schema, _EntityType, _ResolverFieldKey>>
}

export type EntityFieldResolverDefinition<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_ResolverFieldKey extends string = string,
> = Omit<EntityFieldResolver<_Schema, _EntityType, _ResolverFieldKey>, 'source'>

export const defineEntityResolver = <_EntityType extends EntityType<typeof schema>>(
	entityResolver: EntityResolverDefinition<typeof schema, _EntityType>,
) => entityResolver

export const defineEntityFieldResolver = <
	_EntityType extends EntityType<typeof schema>,
	_ResolverFieldKey extends string,
>(
	entityFieldResolver: EntityFieldResolverDefinition<
		typeof schema,
		_EntityType,
		_ResolverFieldKey
	>,
) => entityFieldResolver

export const defineEntityLiveResolver = <_EntityType extends EntityType<typeof schema>>(
	entityLiveResolver: EntityLiveResolverDefinition<typeof schema, _EntityType>,
) => entityLiveResolver
