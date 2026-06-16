import { type } from 'arktype'
import { lowercaseHexIdentityValue } from '$/schema/ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum NostrRepostSelector {
	CanonicalEventId = 'canonicalEventId',
}


const NostrEventId = type(
	'/^[0-9a-f]{64}$/' as type.cast<string>
)

const NostrPubkey = type(
	'/^[0-9a-f]{64}$/' as type.cast<string>
)

export default {
	entityType: EntityType.NostrRepost,

	label: 'Nostr repost',
	labelPlural: 'Nostr reposts',

	selectors: [
		{
			name: NostrRepostSelector.CanonicalEventId,
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
			name: 'repostedEventId',
			type: EntityFieldType.Primitive,
			primitiveType: NostrEventId,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$author',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NostrProfile,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$repostedNote',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NostrNote,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$repostedArticle',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NostrArticle,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
