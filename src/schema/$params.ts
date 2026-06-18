import {
	EntityFieldType,
	type EntityFieldDefinitionByName,
	entityFieldPrimitiveValueIsValid,
	type EntityFieldName,
	type EntityType as SchemaEntityType,
} from '$/schema/$schema.ts'
import { schema, schemaMeta } from '$/schema/index.ts'

type RegisteredSchema = typeof schema
type PrimitiveEntityFieldName<
	_EntityType extends SchemaEntityType<RegisteredSchema>,
> = {
	readonly [
		_FieldName in EntityFieldName<RegisteredSchema, _EntityType>
	]: EntityFieldDefinitionByName<RegisteredSchema, _EntityType, _FieldName> extends {
		readonly type: EntityFieldType.Primitive
	} ?
		_FieldName
	:
		never
}[EntityFieldName<RegisteredSchema, _EntityType>]

export const matchSchemaPrimitiveParam = <
	const _EntityType extends SchemaEntityType<RegisteredSchema>,
	const _FieldName extends PrimitiveEntityFieldName<_EntityType>,
>(
	entityType: _EntityType,
	fieldName: _FieldName,
	value: unknown
) => entityFieldPrimitiveValueIsValid(
	schemaMeta.entityFieldDefinitionByEntityTypeAndName[entityType][fieldName],
	value
)

export const matchDecimalNonNegativeIntegerParam = (
	param: string
) => (
	/^(0|[1-9]\d*)$/.test(param)
	&& Number.isSafeInteger(Number(param))
)

export const matchSchemaNumberParam = <
	const _EntityType extends SchemaEntityType<RegisteredSchema>,
	const _FieldName extends PrimitiveEntityFieldName<_EntityType>,
>(
	entityType: _EntityType,
	fieldName: _FieldName,
	param: string
) => (
	matchDecimalNonNegativeIntegerParam(param)
	&& matchSchemaPrimitiveParam(
		entityType,
		fieldName,
		Number(param)
	)
)

export const matchSchemaBigIntParam = <
	const _EntityType extends SchemaEntityType<RegisteredSchema>,
	const _FieldName extends PrimitiveEntityFieldName<_EntityType>,
>(
	entityType: _EntityType,
	fieldName: _FieldName,
	param: string
) => (
	matchDecimalNonNegativeIntegerParam(param)
	&& matchSchemaPrimitiveParam(
		entityType,
		fieldName,
		BigInt(param)
	)
)
