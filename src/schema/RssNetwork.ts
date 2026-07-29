// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	docsUrl: {
		label: 'Docs URL',
		type: EntityFieldType.Primitive,
		primitiveType: UrlString,
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
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})
