// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NostrNoteSelector {
	CanonicalEventId = 'CanonicalEventId',
}
export default {
	entityType: EntityType.NostrNote,
	label: 'Nostr note',
	labelPlural: 'Nostr notes',
	description: 'A Nostr text note is a kind-1 event addressed by event id; author, reply, root, reaction, and relay facets remain separate fields.',
	selectors: [
		{
			name: NostrNoteSelector.CanonicalEventId,
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
				Source.Constants_Internal,
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
				Source.Constants_Internal,
				Source.NostrBand_Rest,
			],
		},
		{
			name: 'content',
			label: 'Text',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
				Source.NostrBand_Rest,
			],
		},
		{
			name: 'createdAt',
			label: 'Created',
			description: 'The event creation time normalized to Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
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
				Source.Constants_Internal,
				Source.NostrBand_Rest,
			],
		},
		{
			name: 'replyToEventId',
			label: 'Reply to event ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NostrBand_Rest,
			],
		},
		{
			name: 'rootEventId',
			label: 'Root event ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NostrBand_Rest,
			],
		},
		{
			name: '$replyToNote',
			label: 'Reply to note',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NostrNote,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NostrBand_Rest,
			],
		},
		{
			name: '$$replies',
			label: 'Replies',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NostrNote,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
				Source.NostrBand_Rest,
			],
		},
		{
			name: '$$reactions',
			label: 'Reactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NostrReaction,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
				Source.NostrBand_Rest,
			],
		},
	],
} as const satisfies EntityDefinition
