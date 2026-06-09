import { type } from 'arktype'
import { lowercaseHexIdentityValue } from '$/schema/ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'

const NostrPubkey = type(
	'/^[0-9a-f]{64}$/' as type.cast<string>,
)

export default {
	entityType: EntityType.NostrProfile,

	label: 'Nostr profile',
	labelPlural: 'Nostr profiles',

	id: type({
		pubkey: NostrPubkey,
	}),

	identities: [
		{
			name: 'canonicalPubkey',
			fields: [
				{
					name: 'pubkey',
					normalize: lowercaseHexIdentityValue,
				},
			],
		},
	],

	fields: [
		{
			name: 'pubkey',
			type: EntityFieldType.Primitive,
			primitiveType: NostrPubkey,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'displayName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'about',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'nip05',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lud16',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lud06',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'website',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'metadataUpdatedAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$icon',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$banner',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$notes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NostrNote,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$articles',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NostrArticle,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$reposts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NostrRepost,
			cardinality: EntityFieldCardinality.Many,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
