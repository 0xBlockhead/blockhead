import type { EntityFieldResolverContext } from '$/resolvers/$EntityFieldResolver.ts'
import { resolveRegisteredEntityField } from '$/resolvers/$resolveEntity.ts'
import type { EntityId } from '$/schema/$schema.ts'
import type { EntityType } from '$/schema/$EntityType.ts'

/** Routes and ad-hoc live queries use this; it delegates to the resolver registry. */
export const resolveEntityField = async (
	entityType: EntityType,
	field: string,
	entityId: EntityId,
	context?: EntityFieldResolverContext,
) => resolveRegisteredEntityField(entityType, field, entityId, context)
