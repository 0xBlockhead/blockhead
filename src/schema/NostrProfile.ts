// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.NostrProfile,
	labels: {
		singular: 'Nostr profile',
		plural: 'Nostr profiles',
	},
	description: 'A Nostr profile is replaceable kind-0 metadata keyed by a 64-character lowercase hex public key.',
})({
	pubkey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$latestMetadataEvent: {
		entityType: EntityType.NostrProfileMetadataEvent,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NostrRelay_WebSocket,
			Source.Primal_Rest,
		],
	},
	$$metadataEvents: {
		entityType: EntityType.NostrProfileMetadataEvent,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Primal_Rest,
		],
	},
	$$notes: {
		entityType: EntityType.NostrNote,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrRelay_WebSocket,
		],
	},
	$$articles: {
		entityType: EntityType.NostrArticle,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.NostrRelay_WebSocket,
		],
	},
	$$reposts: {
		entityType: EntityType.NostrRepost,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.NostrRelay_WebSocket,
		],
	},
})({
	selectors: {
		CanonicalPubkey: [
			'pubkey',
		],
	},
})
