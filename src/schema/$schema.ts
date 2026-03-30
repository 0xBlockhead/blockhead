import type { EntityDefinition, EntityFromDefinition, EntityIdFromDefinition } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export const schema = [
	(await import('$/schema/_Global.ts')).default,
] as const satisfies readonly EntityDefinition[]

export const entityDefinitionByType = (
	Object.fromEntries(
		schema
			.map((definition) => [
				definition.entityType,
				definition,
			])
	)
)

export type Entity<_EntityType extends EntityType = EntityType> = (
	_EntityType extends keyof typeof entityDefinitionByType ?
		EntityFromDefinition<typeof entityDefinitionByType[_EntityType]>
	:
		{ $id: unknown }
)

export type EntityId<_EntityType extends EntityType = EntityType> = (
	_EntityType extends keyof typeof entityDefinitionByType ?
		EntityIdFromDefinition<typeof entityDefinitionByType[_EntityType]>
	:
		unknown
)
