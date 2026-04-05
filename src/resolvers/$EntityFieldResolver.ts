import type { ResolverLoadSubset } from '$/data/tanstackDb/resolverLoadSubset.ts'
import type { Source } from '$/sources/$Sources.ts'

import type {
	Entity,
	EntityId,
	EntitySchemaFieldName,
	RegisteredEntityType,
} from '$/schema/$schema.ts'
import type { EntityType } from '$/schema/$EntityType.ts'

export type EntityFieldResolverContext = {
	loadSubset?: ResolverLoadSubset
}

/** One schema field: `entityId` → primitive, embedded id, id(s), or (for `_Global` list fields) provider-defined list payload. */
export type EntityFieldResolver<
	_EntityType extends RegisteredEntityType,
	_Field extends (
		& EntitySchemaFieldName<_EntityType>
		& keyof Entity<_EntityType>
	),
> = {
	entityType: _EntityType
	field: _Field
	resolve: (
		entityId: EntityId<_EntityType>,
		context?: EntityFieldResolverContext,
	) => Promise<Entity<_EntityType>[_Field]>
}

export type ScopedEntityFieldResolver = AnyEntityFieldResolver & { source: Source }

export type AnyEntityFieldResolver = {
	entityType: EntityType
	field: string
	resolve: (
		entityId: EntityId,
		context?: EntityFieldResolverContext,
	) => Promise<unknown>
}
