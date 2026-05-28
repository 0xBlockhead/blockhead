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
	readonly id: ArktypeType<any, any>
	readonly fields: readonly EntityFieldDefinition[]
}

export enum EntityFieldCardinality {
	Zero = 'Zero',
	One = 'One',
	ZeroOrOne = 'ZeroOrOne',
	Many = 'Many',
	ZeroOrMany = 'ZeroOrMany',
}

export type EntityFieldCondition<
	_FieldName extends string = string,
	_Value extends string | number = string | number,
> = {
	readonly fieldName: _FieldName
	readonly values: readonly _Value[]
}

type EntityFieldDefinitionBase = {
	defaultSources?: Source[]
	when?: EntityFieldCondition
}

export type EntityFieldDefinition = (
	| (EntityFieldDefinitionBase & {
		name: string
		type: EntityFieldType.Primitive
		primitiveType: ArktypeType<any, any>
		cardinality: EntityFieldCardinality.One | EntityFieldCardinality.ZeroOrOne | EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
	})
	| (EntityFieldDefinitionBase & {
		name: `$${string}`
		type: EntityFieldType.EntityReference
		entityType: EntityType
		cardinality: EntityFieldCardinality.Zero | EntityFieldCardinality.One | EntityFieldCardinality.ZeroOrOne
	})
	| (EntityFieldDefinitionBase & {
		name: `$$${string}`
		type: EntityFieldType.EntitiesReference
		entityType: EntityType
		cardinality: EntityFieldCardinality.Zero | EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
	})
)

export type EntityIdFromDefinition<_EntityDefinition extends EntityDefinition> = (
	_EntityDefinition['id']['infer']
)

type NonConditionalPrimitiveFieldName<
	_Fields extends readonly EntityFieldDefinition[],
> = Exclude<
	_Fields[number],
	{ when: EntityFieldCondition }
> extends infer _Field ?
	_Field extends {
		name: infer _FieldName extends string
		type: EntityFieldType.Primitive
		primitiveType: {
			infer: string | number
		}
	} ?
		_FieldName
	:
		never
:
	never

type PrimitiveFieldValue<
	_Fields extends readonly EntityFieldDefinition[],
	_FieldName extends string,
> = _Fields[number] extends infer _Field ?
	_Field extends {
		name: _FieldName
		type: EntityFieldType.Primitive
		primitiveType: {
			infer: infer _Value extends string | number
		}
	} ?
		_Value
	:
		never
:
	never

export const conditionalOn = <
	const _Fields extends readonly EntityFieldDefinition[],
	const _FieldName extends NonConditionalPrimitiveFieldName<_Fields>,
	const _Values extends readonly PrimitiveFieldValue<_Fields, _FieldName>[],
>(
	_fields: _Fields,
	fieldName: _FieldName,
	values: _Values,
) => ({
	fieldName,
	values,
})
