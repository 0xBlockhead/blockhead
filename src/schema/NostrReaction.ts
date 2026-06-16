import { type } from 'arktype'
import { lowercaseHexIdentityValue } from '$/schema/ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum NostrReactionSelector {
	CanonicalEventId = 'canonicalEventId',
}


const NostrEventId = type(
	'/^[0-9a-f]{64}$/' as type.cast<string>
)

const NostrPubkey = type(
	'/^[0-9a-f]{64}$/' as type.cast<string>
)

export default {
	entityType: EntityType.NostrReaction,

	label: 'Nostr reaction',
	labelPlural: 'Nostr reactions',

	selectors: [
		{
			name: NostrReactionSelector.CanonicalEventId,
			fields: [
				'eventId',
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
			name: '$targetNote',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NostrNote,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$targetArticle',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NostrArticle,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'content',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
