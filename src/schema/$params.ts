import {
	entityFieldAddressKey,
	entityFieldPrimitiveValueIsValid,
	type EntityType as SchemaEntityType,
} from '$/schema/$schema.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { schema, schemaMeta } from '$/schema/index.ts'

type RegisteredSchema = typeof schema

export const matchSchemaPrimitiveParam = <
	const _EntityType extends SchemaEntityType<RegisteredSchema>,
>(
	entityType: _EntityType,
	fieldName: string,
	value: string | number | bigint | object
) => {
	const fieldDefinition = schemaMeta.entityFieldDefinitionByEntityTypePathAndName[entityType][
		entityFieldAddressKey(entityType, [], fieldName)
	]
	// oxlint-disable-next-line typescript/no-unnecessary-condition -- route params can name fields outside the generated schema type surface at runtime
	if (fieldDefinition === undefined)
		return false

	return (
		fieldDefinition.type === EntityFieldType.Primitive
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

export const matchDecimalNonNegativeBigIntParam = (
	param: string
) => /^(0|[1-9]\d*)$/.test(param)

export const matchSchemaNumberParam = <
	const _EntityType extends SchemaEntityType<RegisteredSchema>,
>(
	entityType: _EntityType,
	fieldName: string,
	param: string
) => (
	matchDecimalNonNegativeBigIntParam(param)
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
	matchDecimalNonNegativeBigIntParam(param)
	&& matchSchemaPrimitiveParam(
		entityType,
		fieldName,
		BigInt(param)
	)
)
