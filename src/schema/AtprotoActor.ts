import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
	type EntityIdentityValueNormalizer,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const lowercaseIdentityValue: EntityIdentityValueNormalizer = (value) => (
	String(value).toLowerCase()
)

const Did = type(
	'/^did:(plc:[a-z2-7]+|web:[A-Za-z0-9._:%-]+)$/' as type.cast<string>,
)

export default {
	entityType: EntityType.AtprotoActor,

	label: 'AT Protocol actor',
	labelPlural: 'AT Protocol actors',

	id: type.or(
		type({
			did: Did,
			'+': 'reject',
		}),
		type({
			handle: 'string',
			'+': 'reject',
		}),
	),

	lookups: [
		{
			name: 'handle',
			fields: [
				{
					name: 'handle',
					normalize: lowercaseIdentityValue,
				},
			],
		},
	],

	identities: [
		{
			name: 'did',
			fields: [
				{
					name: 'did',
					normalize: lowercaseIdentityValue,
				},
			],
		},
	],

	fields: [
		{
			name: 'did',
			type: EntityFieldType.Primitive,
			primitiveType: Did,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'displayName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'handle',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$icon',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Atproto_Xrpc,
				Source.Atproto_BskySocial_Xrpc,
			],
		},
		{
			name: '$banner',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Atproto_Xrpc,
				Source.Atproto_BskySocial_Xrpc,
			],
		},
		{
			name: 'followersCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'followsCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'postsCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AtprotoActor_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Atproto_Xrpc,
				Source.Atproto_BskySocial_Xrpc,
			],
		},
		{
			name: 'indexedAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'description',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$posts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AtprotoPost,
			cardinality: EntityFieldCardinality.Many,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
