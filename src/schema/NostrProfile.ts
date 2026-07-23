// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NostrProfileSelector {
	CanonicalPubkey = 'CanonicalPubkey',
}
export const NostrProfile = entity({
	entityType: EntityType.NostrProfile,
	labels: {
		singular: 'Nostr profile',
		plural: 'Nostr profiles',
	},
	description: 'A Nostr profile is replaceable kind-0 metadata keyed by a 64-character lowercase hex public key.',
})({
	pubkey: {
		label: 'Pubkey',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$latestMetadataEvent: {
		label: 'Latest signed metadata',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.NostrProfileMetadataEvent,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NostrBand_Rest,
			Source.Primal_Rest,
		],
	},
	$$metadataEvents: {
		label: 'Signed metadata versions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.NostrProfileMetadataEvent,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.NostrBand_Rest,
			Source.Primal_Rest,
		],
	},
	$$notes: {
		label: 'Notes',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.NostrNote,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrBand_Rest,
		],
	},
	$$articles: {
		label: 'Articles',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.NostrArticle,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrBand_Rest,
		],
	},
	$$reposts: {
		label: 'Reposts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.NostrRepost,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
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
