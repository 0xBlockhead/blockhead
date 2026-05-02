import type { Type as ArktypeType } from 'arktype'
import type { EntityType } from '$/schema/$EntityType.ts'
import type { Source } from '$/sources/index.ts'

export enum EntityMetaKey {
	ParentId = '__parentId',
	ParentIdKey = '__parentIdKey',
	Id = '__id',
	IdKey = '__idKey',
	Source = '__source',
	Fields = '__fields',
	Value = '__value',
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
