// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.NostrRepost,
	labels: {
		singular: 'Nostr repost',
		plural: 'Nostr reposts',
	},
	description: 'A Nostr repost is a kind-6 or kind-16 event keyed by event id and linked to the reposted note or article.',
})({
	eventId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	kind: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.NostrRelay_WebSocket,
		],
	},
	pubkey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.NostrRelay_WebSocket,
		],
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NostrRelay_WebSocket,
		],
	},
	tags: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	repostedEventId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NostrRelay_WebSocket,
		],
	},
	$author: {
		entityType: EntityType.NostrProfile,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NostrRelay_WebSocket,
		],
	},
	$repostedNote: {
		entityType: EntityType.NostrNote,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NostrRelay_WebSocket,
		],
	},
	$repostedArticle: {
		entityType: EntityType.NostrArticle,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
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
