// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum RssNetworkSelector {
	Scope = 'Scope',
}
export const RssNetwork = entity({
	entityType: EntityType.RssNetwork,
	label: 'RSS / Atom',
	labelPlural: 'RSS / Atom',
	description: 'RSS and Atom syndication feeds publish ordered item streams keyed by feed URL.',
})({
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this hub row.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	protocolName: {
		label: 'Protocol',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	homeUrl: {
		label: 'Home URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	docsUrl: {
		label: 'Docs URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registryName: {
		label: 'Registry name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	relationshipModel: {
		label: 'Connection model',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$rssFeeds: {
		label: 'Feeds',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.RssFeed,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	$$observedItems: {
		label: 'Items',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.RssItem,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Rss_Rest,
			Source.Rss2Json_Rest,
		],
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})
