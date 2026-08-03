// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.NostrArticle,
	labels: {
		singular: 'Nostr article',
		plural: 'Nostr articles',
	},
	description: 'A Nostr long-form article is a replaceable kind-30023 event addressed by author public key and identifier.',
})({
	pubkey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	identifier: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	kind: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$latestEvent: {
		entityType: EntityType.NostrArticleEvent,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NostrRelay_WebSocket,
			Source.Primal_Rest,
		],
	},
	$$events: {
		entityType: EntityType.NostrArticleEvent,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Primal_Rest,
		],
	},
})({
	selectors: {
		CanonicalCoordinate: [
			'kind',
			'pubkey',
			'identifier',
		],
	},
})
