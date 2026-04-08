import type { Type as ArktypeType } from 'arktype'
import type { EntityType } from '$/schema/$EntityType.ts'
import type { Source } from '$/sources/$Sources.ts'

export enum EntityMetaKey {
	ParentId = '#parentId',
	ParentIdKey = '#parentIdKey',
	Id = '#id',
	IdKey = '#idKey',
	Source = '#source',
	Fields = '#fields',
	Value = '#value',
}

export enum EntityFieldType {
	Primitive = 'Primitive',
	EntityReference = 'EntityReference',
	EntitiesReference = 'EntitiesReference',
}

export type EntityDefinition = {
	readonly entityType: EntityType
	readonly label: string
	readonly labelPlural: string
	readonly id: ArktypeType
	readonly fields: readonly EntityFieldDefinition[]
}

export enum EntityFieldCardinality {
	Zero = 'Zero',
	One = 'One',
	ZeroOrOne = 'ZeroOrOne',
	Many = 'Many',
	ZeroOrMany = 'ZeroOrMany',
}

export type EntityFieldDefinition = (
	| {
		name: string
		type: EntityFieldType.Primitive
		primitiveType: ArktypeType
		cardinality: EntityFieldCardinality.One | EntityFieldCardinality.ZeroOrOne | EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
		defaultSources?: Source[]
	}
	| {
		name: `$${string}`
		type: EntityFieldType.EntityReference
		entityType: EntityType
		cardinality: EntityFieldCardinality.Zero | EntityFieldCardinality.One | EntityFieldCardinality.ZeroOrOne
		defaultSources?: Source[]
	}
	| {
		name: `$$${string}`
		type: EntityFieldType.EntitiesReference
		entityType: EntityType
		cardinality: EntityFieldCardinality.Zero | EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
		defaultSources?: Source[]
	}
)

export type EntityIdFromDefinition<_EntityDefinition extends EntityDefinition> = (
	_EntityDefinition['id']['infer']
)
