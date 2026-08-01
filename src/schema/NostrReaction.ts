// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.NostrReaction,
	labels: {
		singular: 'Nostr reaction',
		plural: 'Nostr reactions',
	},
	description: 'A Nostr reaction is a kind-7 event keyed by event id and scoped to the note or article it reacts to.',
})({
	eventId: {
		label: 'Event ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	kind: {
		label: 'Kind',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.NostrBand_Rest,
		],
	},
	pubkey: {
		label: 'Pubkey',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.NostrBand_Rest,
		],
	},
	createdAt: {
		label: 'Created',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NostrBand_Rest,
		],
	},
	tags: {
		label: 'Tags',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$author: {
		label: 'Author',
		entityType: EntityType.NostrProfile,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NostrBand_Rest,
		],
	},
	$targetNote: {
		label: 'Target note',
		entityType: EntityType.NostrNote,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NostrBand_Rest,
		],
	},
	$targetArticle: {
		label: 'Target article',
		entityType: EntityType.NostrArticle,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NostrBand_Rest,
		],
	},
	content: {
		label: 'Reaction',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NostrBand_Rest,
		],
	},
})({
	selectors: {
		CanonicalEventId: [
			'eventId',
		],
	},
})
