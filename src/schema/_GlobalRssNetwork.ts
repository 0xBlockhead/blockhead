// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum _GlobalRssNetworkSelector {
	Scope = 'Scope',
}
export const _GlobalRssNetwork = entity({
	entityType: EntityType._GlobalRssNetwork,
	labels: {
		singular: 'global RSS network',
		plural: 'global RSS networks',
	},
})({
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this hub row.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$observedFeeds: {
		label: 'observed feeds',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.RssFeed,
		cardinality: EntityFieldCardinality.Many,
	},
	$$observedItems: {
		label: 'observed items',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.RssItem,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType._GlobalRssNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})
