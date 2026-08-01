// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.NostrNote,
	labels: {
		singular: 'Nostr note',
		plural: 'Nostr notes',
	},
	description: 'A Nostr text note is a kind-1 event addressed by event id; author, reply, root, reaction, and relay facets remain separate fields.',
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
			Source.Constants_Internal,
			Source.NostrBand_Rest,
		],
	},
	pubkey: {
		label: 'Pubkey',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrBand_Rest,
		],
	},
	content: {
		label: 'Text',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrBand_Rest,
		],
	},
	sensitive: {
		label: 'Sensitive',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrBand_Rest,
			Source.Primal_Rest,
		],
	},
	contentWarning: {
		label: 'Content warning',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrBand_Rest,
			Source.Primal_Rest,
		],
	},
	createdAt: {
		label: 'Created',
		description: 'The event creation time normalized to Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
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
			Source.Constants_Internal,
			Source.NostrBand_Rest,
		],
	},
	replyToEventId: {
		label: 'Reply to event ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrBand_Rest,
		],
	},
	rootEventId: {
		label: 'Root event ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrBand_Rest,
		],
	},
	$replyToNote: {
		label: 'Reply to note',
		entityType: EntityType.NostrNote,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrBand_Rest,
			Source.Primal_Rest,
		],
	},
	$rootNote: {
		label: 'Root note',
		entityType: EntityType.NostrNote,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrBand_Rest,
			Source.Primal_Rest,
		],
	},
	$$replies: {
		label: 'Replies',
		entityType: EntityType.NostrNote,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrBand_Rest,
		],
	},
	$$reactions: {
		label: 'Reactions',
		entityType: EntityType.NostrReaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
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
