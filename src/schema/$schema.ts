import type { Type } from 'arktype'

import {
	EntityFieldCardinality,
	type EntityFieldCondition,
	EntityFieldType,
	EntityMetaKey,
	type EntityDefinition,
	type EntityFieldDefinition as EntityFieldDefinitionTemplate,
} from '$/schema/$EntityDefinition.ts'

export type Schema = readonly EntityDefinition[]

export type EntityType<_Schema extends Schema> = _Schema[number]['entityType']

export type EntityDefinitionForEntityType<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = Extract<_Schema[number], { entityType: _EntityType }>

export type EntityId<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = EntityDefinitionForEntityType<_Schema, _EntityType>['id']['infer']

export type EntityFieldName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = EntityDefinitionForEntityType<_Schema, _EntityType>['fields'][number]['name']

export type EntityBaseFieldDefinition<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = Exclude<
	EntityDefinitionForEntityType<_Schema, _EntityType>['fields'][number],
	{ when: EntityFieldCondition }
>

export type EntityConditionalFieldDefinition<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = Extract<
	EntityDefinitionForEntityType<_Schema, _EntityType>['fields'][number],
	{ when: EntityFieldCondition }
>

export type EntityBaseFieldName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = EntityBaseFieldDefinition<_Schema, _EntityType>['name']

export type EntityConditionalDiscriminatorName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = EntityConditionalFieldDefinition<_Schema, _EntityType>['when']['fieldName']

export type EntityConditionalDiscriminatorValue<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_DiscriminatorName extends EntityConditionalDiscriminatorName<_Schema, _EntityType>,
> = Extract<
	EntityConditionalFieldDefinition<_Schema, _EntityType>,
	{ when: { fieldName: _DiscriminatorName } }
>['when']['values'][number]

export type EntityConditionalFieldName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_DiscriminatorName extends EntityConditionalDiscriminatorName<_Schema, _EntityType>,
	_DiscriminatorValue extends EntityConditionalDiscriminatorValue<_Schema, _EntityType, _DiscriminatorName>,
> = EntityConditionalFieldDefinition<_Schema, _EntityType> extends infer _FieldDefinition ?
	_FieldDefinition extends {
		name: infer _FieldName
		when: {
			fieldName: _DiscriminatorName
			values: readonly (string | number)[]
		}
	} ?
		_DiscriminatorValue extends _FieldDefinition['when']['values'][number] ?
			_FieldName
		:
			never
	:
		never
:
	never

export type EntityFieldDefinition<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
> = Extract<EntityDefinitionForEntityType<_Schema, _EntityType>['fields'][number], { name: _FieldName }>

export type EntityFieldValue<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
> = (
	EntityFieldDefinition<_Schema, _EntityType, _FieldName> extends infer _FieldDefinition extends EntityFieldDefinitionTemplate ?
		EntityFieldValueFromDefinition<_Schema, _FieldDefinition>
	:
		never
)

export type EntityFieldValueFromDefinition<
	_Schema extends Schema,
	_EntityFieldDefinition extends _Schema[number]['fields'][number],
> = (
	_EntityFieldDefinition extends {
		type: EntityFieldType.Primitive
		primitiveType: infer _PrimitiveType extends Type<any, any>
	} ?
		{
			[EntityFieldCardinality.Zero]: undefined
			[EntityFieldCardinality.ZeroOrOne]: _PrimitiveType['infer'] | undefined
			[EntityFieldCardinality.One]: _PrimitiveType['infer']
			[EntityFieldCardinality.Many]: _PrimitiveType['infer'][]
			[EntityFieldCardinality.ZeroOrMany]: _PrimitiveType['infer'][] | undefined
		}[_EntityFieldDefinition['cardinality']]

	: _EntityFieldDefinition extends {
		type: EntityFieldType.EntityReference
		entityType: infer _RefEntityType extends EntityType<_Schema>
	} ?
		{
			[EntityFieldCardinality.Zero]: undefined
			[EntityFieldCardinality.ZeroOrOne]: Entity<_Schema, _RefEntityType> | undefined
			[EntityFieldCardinality.One]: Entity<_Schema, _RefEntityType>
		}[_EntityFieldDefinition['cardinality']]

	: _EntityFieldDefinition extends {
		type: EntityFieldType.EntitiesReference
		entityType: infer _RefEntityType extends EntityType<_Schema>
	} ?
		{
			[EntityFieldCardinality.Zero]: undefined
			[EntityFieldCardinality.Many]: Entity<_Schema, _RefEntityType>[]
			[EntityFieldCardinality.ZeroOrMany]: Entity<_Schema, _RefEntityType>[] | undefined
		}[_EntityFieldDefinition['cardinality']]

	:
		never
)

export type EntityFieldValues<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = (
	& {
		[
			_FieldDefinition in EntityDefinitionForEntityType<_Schema, _EntityType>['fields'][number] as (
				_FieldDefinition extends { cardinality: EntityFieldCardinality.One | EntityFieldCardinality.Many } ?
					_FieldDefinition['name']
				:
					never
			)
		]: EntityFieldValueFromDefinition<_Schema, _FieldDefinition>
	}
	& {
		[
			_FieldDefinition in EntityDefinitionForEntityType<_Schema, _EntityType>['fields'][number] as (
				_FieldDefinition extends { cardinality: EntityFieldCardinality.Zero | EntityFieldCardinality.ZeroOrOne | EntityFieldCardinality.ZeroOrMany } ?
					_FieldDefinition['name']
				:
					never
			)
		]?: EntityFieldValueFromDefinition<_Schema, _FieldDefinition>
	}
)

export type Entity<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = {
	[EntityMetaKey.Id]: EntityId<_Schema, _EntityType>
	[EntityMetaKey.Fields]?: Partial<EntityFieldValues<_Schema, _EntityType>>
} & Partial<EntityFieldValues<_Schema, _EntityType>>
