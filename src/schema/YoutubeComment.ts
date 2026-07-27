// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	commentId: {
		label: 'Comment ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	text: {
		label: 'Text',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	authorDisplayName: {
		label: 'Author',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$author: {
		label: 'Author channel',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.YoutubeChannel,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	publishedAt: {
		label: 'Published',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	publishedAtMs: {
		label: 'Published',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$video: {
		label: 'Video',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.YoutubeVideo,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$parentComment: {
		label: 'Parent comment',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.YoutubeComment,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.YoutubeComment_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Youtube_Rest,
			Source.Piped_Rest,
		],
	},
	$$replies: {
		label: 'Replies',
		type: EntityFieldType.EntitiesReference,
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
