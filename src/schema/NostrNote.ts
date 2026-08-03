// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const constantsInternalNostrRelayWebSocketSources = [
	Source.Constants_Internal,
	Source.NostrRelay_WebSocket,
] as const
const constantsInternalNostrRelayWebSocketPrimalRestSources = [
	Source.Constants_Internal,
	Source.NostrRelay_WebSocket,
	Source.Primal_Rest,
] as const

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
		defaultSources: constantsInternalNostrRelayWebSocketSources,
	},
	pubkey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: constantsInternalNostrRelayWebSocketSources,
	},
	content: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: constantsInternalNostrRelayWebSocketSources,
	},
	sensitive: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: constantsInternalNostrRelayWebSocketPrimalRestSources,
	},
	contentWarning: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: constantsInternalNostrRelayWebSocketPrimalRestSources,
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: constantsInternalNostrRelayWebSocketSources,
	},
	tags: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$author: {
		entityType: EntityType.NostrProfile,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: constantsInternalNostrRelayWebSocketSources,
	},
	replyToEventId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: constantsInternalNostrRelayWebSocketSources,
	},
	rootEventId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: constantsInternalNostrRelayWebSocketSources,
	},
	$replyToNote: {
		entityType: EntityType.NostrNote,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: constantsInternalNostrRelayWebSocketPrimalRestSources,
	},
	$rootNote: {
		entityType: EntityType.NostrNote,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: constantsInternalNostrRelayWebSocketPrimalRestSources,
	},
	$$replies: {
		entityType: EntityType.NostrNote,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: constantsInternalNostrRelayWebSocketSources,
	},
	$$reactions: {
		entityType: EntityType.NostrReaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: constantsInternalNostrRelayWebSocketSources,
	},
})({
	selectors: {
		CanonicalEventId: [
			'eventId',
		],
	},
})
