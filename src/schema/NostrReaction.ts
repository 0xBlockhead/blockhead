// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NostrReactionSelector {
	CanonicalEventId = 'CanonicalEventId',
}
export default {
	entityType: EntityType.NostrReaction,
	label: 'Nostr reaction',
	labelPlural: 'Nostr reactions',
	description: 'A Nostr reaction is a kind-7 event keyed by event id and scoped to the note or article it reacts to.',
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
				label: 'Event ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'kind',
				label: 'Kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.NostrBand_Rest,
				],
		},
		{
				name: 'pubkey',
				label: 'Pubkey',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.NostrBand_Rest,
				],
		},
		{
				name: 'createdAt',
				label: 'Created',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NostrBand_Rest,
				],
		},
		{
				name: 'tags',
				label: 'Tags',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$author',
				label: 'Author',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.NostrProfile,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NostrBand_Rest,
				],
		},
		{
				name: '$targetNote',
				label: 'Target note',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.NostrNote,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NostrBand_Rest,
				],
		},
		{
				name: '$targetArticle',
				label: 'Target article',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.NostrArticle,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NostrBand_Rest,
				],
		},
		{
				name: 'content',
				label: 'Reaction',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NostrBand_Rest,
				],
		},
	],
} as const satisfies EntityDefinition
