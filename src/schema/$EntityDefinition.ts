import type { Type as ArktypeType } from 'arktype'
import type { Entity, EntityId } from '$/schema/$schema.ts'
import type { EntityType } from '$/schema/$EntityType.ts'
import type { Source } from '$/sources/$Sources.ts'

export enum EntityFieldType {
	Primitive = 'Primitive',
	EntityReference = 'EntityReference',
	EntitiesReference = 'EntitiesReference',
}

export type EntityDefinition = {
	readonly entityType: EntityType
	readonly label: string
	readonly icon?: string
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
		cardinality: EntityFieldCardinality.One | EntityFieldCardinality.ZeroOrOne
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

type EntityFieldValue<_EntityFieldDefinition extends EntityFieldDefinition> = (
	_EntityFieldDefinition extends { type: EntityFieldType.Primitive } ?
		{
			[EntityFieldCardinality.Zero]: undefined
			[EntityFieldCardinality.ZeroOrOne]: _EntityFieldDefinition['primitiveType']['infer'] | undefined
			[EntityFieldCardinality.One]: _EntityFieldDefinition['primitiveType']['infer']
			[EntityFieldCardinality.Many]: _EntityFieldDefinition['primitiveType']['infer'][]
			[EntityFieldCardinality.ZeroOrMany]: _EntityFieldDefinition['primitiveType']['infer'][] | undefined
		}[_EntityFieldDefinition['cardinality']]

	: _EntityFieldDefinition extends { type: EntityFieldType.EntityReference } ?
		{
			[EntityFieldCardinality.Zero]: undefined
			[EntityFieldCardinality.ZeroOrOne]: Entity<_EntityFieldDefinition['entityType']> | undefined
			[EntityFieldCardinality.One]: Entity<_EntityFieldDefinition['entityType']>
		}[_EntityFieldDefinition['cardinality']]

	: _EntityFieldDefinition extends { type: EntityFieldType.EntitiesReference } ?
		{
			[EntityFieldCardinality.Zero]: undefined
			[EntityFieldCardinality.Many]: Entity<_EntityFieldDefinition['entityType']>[]
			[EntityFieldCardinality.ZeroOrMany]: Entity<_EntityFieldDefinition['entityType']>[] | undefined
		}[_EntityFieldDefinition['cardinality']]

	:
		never
)

export type EntityFromDefinition<_EntityDefinition extends EntityDefinition> = (
	& {
		$id: EntityIdFromDefinition<_EntityDefinition>
	}
	& {
		[
			_EntityFieldDefinition in _EntityDefinition['fields'][number] as (
				_EntityFieldDefinition extends { cardinality: EntityFieldCardinality.One | EntityFieldCardinality.Many } ?
					_EntityFieldDefinition['name']
				:
					never
			)
		]: EntityFieldValue<_EntityFieldDefinition>
	}
	& {
		[
			_EntityFieldDefinition in _EntityDefinition['fields'][number] as (
				_EntityFieldDefinition extends { cardinality: EntityFieldCardinality.Zero | EntityFieldCardinality.ZeroOrOne | EntityFieldCardinality.ZeroOrMany } ?
					_EntityFieldDefinition['name']
				:
					never
			)
		]?: EntityFieldValue<_EntityFieldDefinition>
	}
)

export type EntityWithSource<_Entity extends EntityFromDefinition<any>> = (
	& _Entity
	& {
		$source: Source
	}
)
