// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NostrArticleSelector {
	CanonicalCoordinate = 'CanonicalCoordinate',
}
export const NostrArticle = entity({
	entityType: EntityType.NostrArticle,
	labels: {
		singular: 'Nostr article',
		plural: 'Nostr articles',
	},
	description: 'A Nostr long-form article is a replaceable kind-30023 event addressed by author public key and identifier.',
})({
	pubkey: {
		label: 'Pubkey',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	identifier: {
		label: 'Identifier',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	kind: {
		label: 'Kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$latestEvent: {
		label: 'Latest signed version',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.NostrArticleEvent,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NostrBand_Rest,
			Source.Primal_Rest,
		],
	},
	$$events: {
		label: 'Signed versions',
		type: EntityFieldType.EntitiesReference,
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
