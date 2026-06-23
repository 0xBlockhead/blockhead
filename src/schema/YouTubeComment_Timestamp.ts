import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum YouTubeComment_TimestampSelector {
	YouTubeCommentTimestampMs = 'youTubeCommentTimestampMs',
	CommentTimestampMs = '$comment+timestampMs',
}
export default {
	entityType: EntityType.YouTubeComment_Timestamp,
	label: 'you tube comment timestamp',
	labelPlural: 'you tube comment observations',
	selectors: [
		{
			name: YouTubeComment_TimestampSelector.YouTubeCommentTimestampMs,
			fields: [
				'$comment',
				'timestampMs',
			],
		},
	],
	fields: [
		{
			name: '$comment',
			label: 'comment',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.YouTubeComment,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'likeCount',
			label: 'like count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'replyCount',
			label: 'reply count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
