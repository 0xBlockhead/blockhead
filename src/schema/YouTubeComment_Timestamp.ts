// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum YoutubeComment_TimestampSelector {
	YoutubeCommentTimestampMs = 'YoutubeCommentTimestampMs',
}
export const YoutubeComment_Timestamp = entity({
	entityType: EntityType.YoutubeComment_Timestamp,
	labels: {
		singular: 'YouTube comment observation',
		plural: 'YouTube comment observations',
	},
})({
	$comment: {
		label: 'Comment',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.YoutubeComment,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	likeCount: {
		label: 'Likes',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	replyCount: {
		label: 'Replies',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		YoutubeCommentTimestampMs: [
			'$comment',
			'timestampMs',
		],
	},
})
