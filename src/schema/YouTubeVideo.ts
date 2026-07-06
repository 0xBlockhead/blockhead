// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum YoutubeLiveBroadcastContent {
	None = 'none',
	Live = 'live',
	Upcoming = 'upcoming',
}
export enum YoutubeVideoSelector {
	VideoId = 'VideoId',
}
export default {
	entityType: EntityType.YoutubeVideo,
	label: 'YouTube video',
	labelPlural: 'YouTube Videos',
	selectors: [
		{
			name: YoutubeVideoSelector.VideoId,
			fields: [
				'videoId',
			],
		},
	],
	fields: [
		{
			name: 'videoId',
			label: 'Video ID',
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
			name: 'publishedAt',
			label: 'Published',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'publishedAtMs',
			label: 'Published',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'durationSeconds',
			label: 'Duration',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'categoryId',
			label: 'Category',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'liveBroadcastContent',
			label: 'Live status',
			type: EntityFieldType.Primitive,
			primitiveType: type.enumerated(...Object.values(YoutubeLiveBroadcastContent)),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tags',
			label: 'Tags',
			type: EntityFieldType.Primitive,
			primitiveType: type('string').array(),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'thumbnailUrl',
			label: 'Thumbnail',
			type: EntityFieldType.Primitive,
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$author',
			label: 'Author',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.YoutubeChannel,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.YoutubeVideo_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Youtube_Rest,
			],
		},
		{
			name: '$$comments',
			label: 'Comments',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.YoutubeComment,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			],
		},
	],
} as const satisfies EntityDefinition
