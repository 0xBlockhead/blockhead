import type { EntityFieldResolverContext } from '$/resolvers/$EntityFieldResolver.ts'

import type { Entity, EntityId, RegisteredEntityType } from '$/schema/$schema.ts'
import type { EntityType } from '$/schema/$EntityType.ts'

/** `entityId` → partial row (multiple schema fields). Merge in `resolveEntity` only fills gaps with `entityFieldResolvers`; do not branch on “already loaded” here. */
export type EntityResolver<_EntityType extends RegisteredEntityType> = {
	entityType: _EntityType
	resolve: (
		entityId: EntityId<_EntityType>,
		context?: EntityFieldResolverContext,
	) => Promise<Partial<Entity<_EntityType>>>
}

/** Registry / dispatch shape; implementations use {@link EntityResolver} for a narrowed `entityId`. */
export type AnyEntityResolver = {
	entityType: EntityType
	resolve: (
		entityId: EntityId,
		context?: EntityFieldResolverContext,
	) => Promise<Partial<Entity>>
}
