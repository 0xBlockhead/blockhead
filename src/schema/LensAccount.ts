import { type } from 'arktype'

import { EvmAddress, lowercaseHexIdentityValue } from '$/schema/ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
	type EntityIdentityValueNormalizer,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const lowercaseIdentityValue: EntityIdentityValueNormalizer = (value) => (
	String(value).toLowerCase()
)

export default {
	entityType: EntityType.LensAccount,

	label: 'Lens account',
	labelPlural: 'Lens accounts',

	id: type.or(
		type({
			address: EvmAddress,
			'+': 'reject',
		}),
		type({
			localName: 'string',
			'+': 'reject',
		}),
		type({
			legacyProfileId: 'string',
			'+': 'reject',
		}),
	),

	lookups: [
		{
			name: 'localName',
			fields: [
				{
					name: 'localName',
					normalize: lowercaseIdentityValue,
				},
			],
		},
		{
			name: 'legacyProfileId',
			fields: [
				'legacyProfileId',
			],
		},
	],

	identities: [
		{
			name: 'address',
			fields: [
				{
					name: 'address',
					normalize: lowercaseHexIdentityValue,
				},
			],
		},
	],

	fields: [
		{
			name: 'address',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'legacyProfileId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'localName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'displayName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'bio',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'followerCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'followingCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LensAccount_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Lens_Graphql,
			],
		},
		{
			name: '$icon',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lens_Graphql,
			],
		},
		{
			name: '$$posts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LensPost,
			cardinality: EntityFieldCardinality.Many,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
