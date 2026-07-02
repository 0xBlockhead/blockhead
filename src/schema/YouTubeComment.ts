// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum YoutubeCommentSelector {
	VideoIdCommentId = 'VideoIdCommentId',
}
export default {
	entityType: EntityType.YoutubeComment,
	label: 'YouTube comment',
	labelPlural: 'YouTube comments',
	selectors: [
		{
			name: YoutubeCommentSelector.VideoIdCommentId,
			fields: [
				'videoId',
				'commentId',
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
				name: 'commentId',
				label: 'Comment ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'text',
				label: 'Text',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'authorDisplayName',
				label: 'Author',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$author',
				label: 'Author channel',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.YoutubeChannel,
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
				name: '$video',
				label: 'Video',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.YoutubeVideo,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$parentComment',
				label: 'Parent comment',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.YoutubeComment,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.YoutubeComment_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Youtube_Rest,
					Source.Piped_Rest,
				],
		},
		{
				name: '$$replies',
				label: 'Replies',
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
