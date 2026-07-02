// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum YoutubeComment_TimestampSelector {
	YoutubeCommentTimestampMs = 'YoutubeCommentTimestampMs',
}
export default {
	entityType: EntityType.YoutubeComment_Timestamp,
	label: 'YouTube comment observation',
	labelPlural: 'YouTube comment observations',
	selectors: [
		{
			name: YoutubeComment_TimestampSelector.YoutubeCommentTimestampMs,
			fields: [
				'$comment',
				'timestampMs',
			],
		},
	],
	fields: [
		{
				name: '$comment',
				label: 'Comment',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.YoutubeComment,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'likeCount',
				label: 'Likes',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'replyCount',
				label: 'Replies',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
