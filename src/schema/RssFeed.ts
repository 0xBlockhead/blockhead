import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'

export enum RssFeedSelector {
	FeedUrl = 'feedUrl',
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
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'title',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'description',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'link',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'siteUrl',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'language',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lastBuildDate',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'imageUrl',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$items',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RssItem,
			cardinality: EntityFieldCardinality.Many,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
