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
		label: 'Feed URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	title: {
		label: 'Title',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	link: {
		label: 'Link',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	siteUrl: {
		label: 'Site URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	language: {
		label: 'Language',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastBuildDate: {
		label: 'Last build',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	imageUrl: {
		label: 'Image URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$items: {
		label: 'Items',
		entityType: EntityType.RssItem,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Rss_Rest,
			Source.Rss2Json_Rest,
		],
	},
	$$timestamps: {
		label: 'Observations',
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
