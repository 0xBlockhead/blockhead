import { type } from 'arktype'
import { lowercaseHexIdentityValue } from '$/schema/ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const NostrEventId = type(
	'/^[0-9a-f]{64}$/' as type.cast<string>,
)

const NostrPubkey = type(
	'/^[0-9a-f]{64}$/' as type.cast<string>,
)

export default {
	entityType: EntityType.NostrNote,

	label: 'Nostr note',
	labelPlural: 'Nostr notes',

	id: type({
		eventId: NostrEventId,
	}),

	identities: [
		{
			name: 'canonicalEventId',
			fields: [
				{
					name: 'eventId',
					normalize: lowercaseHexIdentityValue,
				},
			],
		},
	],

	fields: [
		{
			name: 'eventId',
			type: EntityFieldType.Primitive,
			primitiveType: NostrEventId,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'pubkey',
			type: EntityFieldType.Primitive,
			primitiveType: NostrPubkey,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'content',
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
			name: 'tags',
			type: EntityFieldType.Primitive,
			primitiveType: type('string[][]'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$author',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NostrProfile,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'replyToEventId',
			type: EntityFieldType.Primitive,
			primitiveType: NostrEventId,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'rootEventId',
			type: EntityFieldType.Primitive,
			primitiveType: NostrEventId,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$replyToNote',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NostrNote,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$replies',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NostrNote,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$reactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NostrReaction,
			cardinality: EntityFieldCardinality.Many,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
