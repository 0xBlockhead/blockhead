import { parseLoadSubsetOptions } from '@tanstack/svelte-db'

import { schema } from '$/schema/$schema.ts'
import type {
	EntityFieldValue,
	EntityFieldValues,
	EntityId,
	EntityType,
	Schema,
} from '$/schema/$schema.ts'
import type { Source } from '$/sources/$Sources.ts'

export type ResolverLoadSubset = ReturnType<typeof parseLoadSubsetOptions>

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

export type EntityFieldResolver<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_ResolverFieldKey extends string = string,
> = {
	entityType: _EntityType
	fieldName: _ResolverFieldKey
	source: Source
	resolve: (
		scopedEntityId: EntityId<_Schema, _EntityType>,
		context?: ResolverLoadSubset,
	) => Promise<EntityFieldValue<_Schema, _EntityType, _ResolverFieldKey>>
}

export const defineEntityResolver = <_EntityType extends EntityType<typeof schema>>(
	entityResolver: EntityResolver<typeof schema, _EntityType>,
) => entityResolver

export const defineEntityFieldResolver = <
	_EntityType extends EntityType<typeof schema>,
	_ResolverFieldKey extends string,
>(
	entityFieldResolver: EntityFieldResolver<typeof schema, _EntityType, _ResolverFieldKey>,
) => entityFieldResolver
