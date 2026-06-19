import {
	EntityFieldType,
	entityFieldPrimitiveValueIsValid,
	type EntityType as SchemaEntityType,
} from '$/schema/$schema.ts'
import { schema, schemaMeta } from '$/schema/index.ts'

type RegisteredSchema = typeof schema

export const matchSchemaPrimitiveParam = <
	const _EntityType extends SchemaEntityType<RegisteredSchema>,
>(
	entityType: _EntityType,
	fieldName: string,
	value: unknown
) => {
	const fieldDefinition = schemaMeta.entityFieldDefinitionByEntityTypeAndName[entityType][fieldName]
	return (
		fieldDefinition?.type === EntityFieldType.Primitive
		&& entityFieldPrimitiveValueIsValid(
			fieldDefinition,
			value
		)
	)
}

export const matchDecimalNonNegativeIntegerParam = (
	param: string
) => (
	/^(0|[1-9]\d*)$/.test(param)
	&& Number.isSafeInteger(Number(param))
)

export const matchSchemaNumberParam = <
	const _EntityType extends SchemaEntityType<RegisteredSchema>,
>(
	entityType: _EntityType,
	fieldName: string,
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
>(
	entityType: _EntityType,
	fieldName: string,
	param: string
) => (
	matchDecimalNonNegativeIntegerParam(param)
	&& matchSchemaPrimitiveParam(
		entityType,
		fieldName,
		BigInt(param)
	)
)
