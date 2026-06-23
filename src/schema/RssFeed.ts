import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
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
			label: 'feed URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'title',
			label: 'title',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'description',
			label: 'Description',
			description: 'A human-readable description from the source domain.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'link',
			label: 'link',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'siteUrl',
			label: 'site URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'language',
			label: 'language',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lastBuildDate',
			label: 'last build date',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'imageUrl',
			label: 'image URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$items',
			label: 'items',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RssItem,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
