// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.RssNetwork,
	labels: {
		singular: 'RSS / Atom',
		plural: 'RSS / Atom',
	},
	description: 'RSS and Atom syndication feeds publish ordered item streams keyed by feed URL.',
})({
	scope: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	protocolName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	homeUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	docsUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registryName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	relationshipModel: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$rssFeeds: {
		entityType: EntityType.RssFeed,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.Local_Internal,
		],
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})
