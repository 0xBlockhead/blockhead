// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.YoutubeComment,
	labels: {
		singular: 'YouTube comment',
		plural: 'YouTube comments',
	},
})({
	videoId: {
		label: 'Video ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	commentId: {
		label: 'Comment ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	text: {
		label: 'Text',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	authorDisplayName: {
		label: 'Author',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$author: {
		label: 'Author channel',
		entityType: EntityType.YoutubeChannel,
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
	$video: {
		label: 'Video',
		entityType: EntityType.YoutubeVideo,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$parentComment: {
		label: 'Parent comment',
		entityType: EntityType.YoutubeComment,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		entityType: EntityType.YoutubeComment_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Youtube_Rest,
			Source.Piped_Rest,
		],
	},
	$$replies: {
		label: 'Replies',
		entityType: EntityType.YoutubeComment,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Youtube_Rest,
		],
	},
})({
	selectors: {
		VideoIdCommentId: [
			'videoId',
			'commentId',
		],
	},
})
