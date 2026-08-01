// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { YoutubeLiveBroadcastContent } from '$/schema/YoutubeLiveBroadcastContent.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.YoutubeVideo,
	labels: {
		singular: 'YouTube video',
		plural: 'YouTube Videos',
	},
})({
	videoId: {
		label: 'Video ID',
		primitiveType: type('string'),
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
	publishedAt: {
		label: 'Published',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	publishedAtMs: {
		label: 'Published',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	durationSeconds: {
		label: 'Duration',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	categoryId: {
		label: 'Category',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	liveBroadcastContent: {
		label: 'Live status',
		primitiveType: type.enumerated(...Object.values(YoutubeLiveBroadcastContent)),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tags: {
		label: 'Tags',
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	thumbnailUrl: {
		label: 'Thumbnail',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$author: {
		label: 'Author',
		entityType: EntityType.YoutubeChannel,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$thumbnail: {
		label: 'Thumbnail',
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		entityType: EntityType.YoutubeVideo_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Youtube_Rest,
		],
	},
	$$comments: {
		label: 'Comments',
		entityType: EntityType.YoutubeComment,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Youtube_Rest,
			Source.Piped_Rest,
		],
	},
})({
	selectors: {
		VideoId: [
			'videoId',
		],
	},
})
