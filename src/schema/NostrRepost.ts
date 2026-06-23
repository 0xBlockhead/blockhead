import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum NostrRepostSelector {
	CanonicalEventId = 'canonicalEventId',
	EventId = 'eventId',
}
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
			label: 'event ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'kind',
			label: 'kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'pubkey',
			label: 'public key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'createdAt',
			label: 'Created',
			description: 'The time when the subject was created according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tags',
			label: 'tags',
			type: EntityFieldType.Primitive,
			primitiveType: type("string[][]"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'repostedEventId',
			label: 'reposted event ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$author',
			label: 'author',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NostrProfile,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$repostedNote',
			label: 'reposted note',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NostrNote,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$repostedArticle',
			label: 'reposted article',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NostrArticle,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
