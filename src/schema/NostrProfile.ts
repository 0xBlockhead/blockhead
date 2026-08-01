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
		label: 'Pubkey',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$latestMetadataEvent: {
		label: 'Latest signed metadata',
		entityType: EntityType.NostrProfileMetadataEvent,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NostrBand_Rest,
			Source.Primal_Rest,
		],
	},
	$$metadataEvents: {
		label: 'Signed metadata versions',
		entityType: EntityType.NostrProfileMetadataEvent,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.NostrBand_Rest,
			Source.Primal_Rest,
		],
	},
	$$notes: {
		label: 'Notes',
		entityType: EntityType.NostrNote,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrBand_Rest,
		],
	},
	$$articles: {
		label: 'Articles',
		entityType: EntityType.NostrArticle,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.NostrBand_Rest,
		],
	},
	$$reposts: {
		label: 'Reposts',
		entityType: EntityType.NostrRepost,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.NostrBand_Rest,
		],
	},
})({
	selectors: {
		CanonicalPubkey: [
			'pubkey',
		],
	},
})
