import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum YouTubeCommentSelector {
	VideoIdCommentId = 'videoIdCommentId',
}
export default {
	entityType: EntityType.YouTubeComment,
	label: 'you tube comment',
	labelPlural: 'you tube comments',
	selectors: [
		{
			name: YouTubeCommentSelector.VideoIdCommentId,
			fields: [
				'videoId',
				'commentId',
			],
		},
	],
	fields: [
		{
			name: 'videoId',
			label: 'video ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'commentId',
			label: 'comment ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'text',
			label: 'text',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'authorDisplayName',
			label: 'author display name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'authorChannelId',
			label: 'author channel ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$author',
			label: 'author',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.YouTubeChannel,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'publishedAt',
			label: 'published AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'publishedAtMs',
			label: 'published AT ms',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$video',
			label: 'video',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.YouTubeVideo,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$parentComment',
			label: 'parent comment',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.YouTubeComment,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.YouTubeComment_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$replies',
			label: 'replies',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.YouTubeComment,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
