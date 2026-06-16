import { type } from 'arktype'

import {
	conditionalOn,
	EntityFieldCardinality,
	EntityFieldType,
	type EntityFieldDefinition,
} from './$schema.ts'
import { EntityType } from './EntityType.ts'

enum VerifyType {
	A = 'A',
	B = 'B',
}

const baseFields = [
	{
		name: 'kind',
		type: EntityFieldType.Primitive,
		primitiveType: type.valueOf(VerifyType),
		cardinality: EntityFieldCardinality.One,
	},
	{
		name: 'optionalKind',
		type: EntityFieldType.Primitive,
		primitiveType: type.valueOf(VerifyType),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	{
		name: 'manyKinds',
		type: EntityFieldType.Primitive,
		primitiveType: type.valueOf(VerifyType),
		cardinality: EntityFieldCardinality.Many,
	},
	{
		name: '$ref',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
] as const satisfies readonly EntityFieldDefinition[]

const _condition = conditionalOn(
	baseFields,
	'kind',
	[
		VerifyType.A,
	]
)

const fieldsWithConditional = [
	...baseFields,
	{
		name: 'conditional',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		when: _condition,
	},
] as const satisfies readonly EntityFieldDefinition[]

// @ts-expect-error discriminator must be a real field
conditionalOn(baseFields, 'missing', [VerifyType.A])

// @ts-expect-error discriminator must be primitive
conditionalOn(baseFields, '$ref', [VerifyType.A])

// @ts-expect-error discriminator must be required
conditionalOn(baseFields, 'optionalKind', [VerifyType.A])

// @ts-expect-error discriminator must be singular
conditionalOn(baseFields, 'manyKinds', [VerifyType.A])

// @ts-expect-error discriminator cannot itself be conditional
conditionalOn(fieldsWithConditional, 'conditional', ['value'])

// @ts-expect-error values must match the discriminator field type
conditionalOn(baseFields, 'kind', ['C'])
