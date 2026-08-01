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
		label: 'Pubkey',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	identifier: {
		label: 'Identifier',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	kind: {
		label: 'Kind',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$latestEvent: {
		label: 'Latest signed version',
		entityType: EntityType.NostrArticleEvent,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NostrBand_Rest,
			Source.Primal_Rest,
		],
	},
	$$events: {
		label: 'Signed versions',
		entityType: EntityType.NostrArticleEvent,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.NostrBand_Rest,
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
