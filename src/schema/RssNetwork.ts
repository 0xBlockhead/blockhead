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
		label: 'Scope',
		description: 'The fixed scope value that identifies this hub row.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	protocolName: {
		label: 'Protocol',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	homeUrl: {
		label: 'Home URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	docsUrl: {
		label: 'Docs URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registryName: {
		label: 'Registry name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	relationshipModel: {
		label: 'Connection model',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$rssFeeds: {
		label: 'Feeds',
		entityType: EntityType.RssFeed,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})
