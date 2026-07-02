// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum RssItemSelector {
	FeedUrlGuid = 'FeedUrlGuid',
}
export default {
	entityType: EntityType.RssItem,
	label: 'RSS item',
	labelPlural: 'RSS items',
	selectors: [
		{
			name: RssItemSelector.FeedUrlGuid,
			fields: [
				'feedUrl',
				'guid',
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
				name: 'guid',
				label: 'GUID',
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
				name: 'link',
				label: 'Link',
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
				name: 'content',
				label: 'Content',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'author',
				label: 'Author',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'publishedAt',
				label: 'Published',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'updatedAt',
				label: 'Updated',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'categories',
				label: 'Categories',
				type: EntityFieldType.Primitive,
				primitiveType: type('string').array(),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'enclosureUrl',
				label: 'Enclosure URL',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'commentsUrl',
				label: 'Comments URL',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$feed',
				label: 'Feed',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.RssFeed,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.RssItem_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
