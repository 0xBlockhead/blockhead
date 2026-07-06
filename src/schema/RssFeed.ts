// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum RssFeedSelector {
	FeedUrl = 'FeedUrl',
}
export default {
	entityType: EntityType.RssFeed,
	label: 'RSS feed',
	labelPlural: 'RSS feeds',
	selectors: [
		{
			name: RssFeedSelector.FeedUrl,
			fields: [
				'feedUrl',
			],
		},
	],
	fields: [
		{
			name: 'feedUrl',
			label: 'Feed URL',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'title',
			label: 'Title',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'description',
			label: 'Description',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'link',
			label: 'Link',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'siteUrl',
			label: 'Site URL',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'language',
			label: 'Language',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lastBuildDate',
			label: 'Last build',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'imageUrl',
			label: 'Image URL',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$items',
			label: 'Items',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RssItem,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Rss_Rest,
				Source.Rss2Json_Rest,
			],
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RssFeed_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
