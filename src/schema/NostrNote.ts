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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	kind: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrRelay_WebSocket,
		],
	},
	pubkey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrRelay_WebSocket,
		],
	},
	content: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrRelay_WebSocket,
		],
	},
	sensitive: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrRelay_WebSocket,
			Source.Primal_Rest,
		],
	},
	contentWarning: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrRelay_WebSocket,
			Source.Primal_Rest,
		],
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrRelay_WebSocket,
		],
	},
	tags: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$author: {
		entityType: EntityType.NostrProfile,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrRelay_WebSocket,
		],
	},
	replyToEventId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrRelay_WebSocket,
		],
	},
	rootEventId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrRelay_WebSocket,
		],
	},
	$replyToNote: {
		entityType: EntityType.NostrNote,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrRelay_WebSocket,
			Source.Primal_Rest,
		],
	},
	$rootNote: {
		entityType: EntityType.NostrNote,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrRelay_WebSocket,
			Source.Primal_Rest,
		],
	},
	$$replies: {
		entityType: EntityType.NostrNote,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrRelay_WebSocket,
		],
	},
	$$reactions: {
		entityType: EntityType.NostrReaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrRelay_WebSocket,
		],
	},
})({
	selectors: {
		CanonicalEventId: [
			'eventId',
		],
	},
})
