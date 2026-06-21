import { type } from 'arktype'

import {
	conditionalOn,
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
	type EntityFieldDefinition,
	type EntityResolvedFieldValues,
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
		name: 'indexedKinds',
		type: EntityFieldType.Primitive,
		primitiveType: type.valueOf(VerifyType).array(),
		cardinality: EntityFieldCardinality.One,
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

const _indexedCondition = conditionalOn(
	baseFields,
	'indexedKinds',
	[
		VerifyType.A,
	],
	{
		itemIndex: 0,
	}
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
	{
		name: 'requiredConditional',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		when: _condition,
	},
] as const satisfies readonly EntityFieldDefinition[]

const verifySchema = [
	{
		entityType: 'Verify',
		label: 'Verify',
		labelPlural: 'Verifies',
		selectors: [
			{
				name: 'kind',
				fields: [
					'kind',
				],
			},
		],
		fields: fieldsWithConditional,
	},
] as const satisfies readonly EntityDefinition[]

const _activeResolvedFields: EntityResolvedFieldValues<typeof verifySchema, 'Verify'> = {
	kind: VerifyType.A,
	manyKinds: [],
	indexedKinds: [],
	requiredConditional: 'value',
}

const _inactiveResolvedFields: EntityResolvedFieldValues<typeof verifySchema, 'Verify'> = {
	kind: VerifyType.B,
	manyKinds: [],
	indexedKinds: [],
}

// @ts-expect-error non-zero conditional fields are required when the discriminator branch is active
const _missingRequiredConditionalResolvedFields: EntityResolvedFieldValues<typeof verifySchema, 'Verify'> = {
	kind: VerifyType.A,
	manyKinds: [],
	indexedKinds: [],
}

// @ts-expect-error discriminator must be a real field
conditionalOn(baseFields, 'missing', [VerifyType.A])

// @ts-expect-error discriminator must be primitive
conditionalOn(baseFields, '$ref', [VerifyType.A])

// @ts-expect-error discriminator must be required
conditionalOn(baseFields, 'optionalKind', [VerifyType.A])

// @ts-expect-error discriminator must be singular
conditionalOn(baseFields, 'manyKinds', [VerifyType.A])

// @ts-expect-error indexed discriminator must specify item index
conditionalOn(baseFields, 'indexedKinds', [VerifyType.A])

// @ts-expect-error scalar discriminator cannot specify item index
conditionalOn(baseFields, 'kind', [VerifyType.A], {
	itemIndex: 0,
})

// @ts-expect-error discriminator cannot itself be conditional
conditionalOn(fieldsWithConditional, 'conditional', ['value'])

// @ts-expect-error values must match the discriminator field type
conditionalOn(baseFields, 'kind', ['C'])
