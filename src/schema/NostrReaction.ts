// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const nostrRelayWebSocketSources = [
	Source.NostrRelay_WebSocket,
] as const

export default entity({
	entityType: EntityType.NostrReaction,
	labels: {
		singular: 'Nostr reaction',
		plural: 'Nostr reactions',
	},
	description: 'A Nostr reaction is a kind-7 event keyed by event id and scoped to the note or article it reacts to.',
})({
	eventId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	kind: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: nostrRelayWebSocketSources,
	},
	pubkey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: nostrRelayWebSocketSources,
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nostrRelayWebSocketSources,
	},
	tags: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$author: {
		entityType: EntityType.NostrProfile,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nostrRelayWebSocketSources,
	},
	$targetNote: {
		entityType: EntityType.NostrNote,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nostrRelayWebSocketSources,
	},
	$targetArticle: {
		entityType: EntityType.NostrArticle,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nostrRelayWebSocketSources,
	},
	content: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nostrRelayWebSocketSources,
	},
})({
	selectors: {
		CanonicalEventId: [
			'eventId',
		],
	},
})
