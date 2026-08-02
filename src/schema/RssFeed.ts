// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.RssFeed,
	labels: {
		singular: 'RSS feed',
		plural: 'RSS feeds',
	},
})({
	feedUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	title: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	siteUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	language: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastBuildDate: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	imageUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$items: {
		entityType: EntityType.RssItem,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Rss_Rest,
			Source.Rss2Json_Rest,
		],
	},
	$$timestamps: {
		entityType: EntityType.RssFeed_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		FeedUrl: [
			'feedUrl',
		],
	},
})
