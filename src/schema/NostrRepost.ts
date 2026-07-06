// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NostrRepostSelector {
	CanonicalEventId = 'CanonicalEventId',
}
export default {
	entityType: EntityType.NostrRepost,
	label: 'Nostr repost',
	labelPlural: 'Nostr reposts',
	description: 'A Nostr repost is a kind-6 or kind-16 event keyed by event id and linked to the reposted note or article.',
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
			name: 'repostedEventId',
			label: 'Reposted event ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NostrBand_Rest,
			],
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
			name: '$repostedNote',
			label: 'Reposted note',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NostrNote,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NostrBand_Rest,
			],
		},
		{
			name: '$repostedArticle',
			label: 'Reposted article',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NostrArticle,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NostrBand_Rest,
			],
		},
	],
} as const satisfies EntityDefinition
