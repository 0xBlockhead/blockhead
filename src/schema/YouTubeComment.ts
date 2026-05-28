import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

const YouTubeVideoId = type(
	'/^[A-Za-z0-9_-]{11}$/' as type.cast<string>,
)

export default {
	entityType: EntityType.YouTubeComment,

	label: 'YouTube comment',
	labelPlural: 'YouTube comments',

	id: type({
		videoId: YouTubeVideoId,
		commentId: 'string',
	}),

	fields: [
		{
			name: 'text',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'authorDisplayName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'authorChannelId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$author',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.YouTubeChannel,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'likeCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'replyCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'publishedAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'publishedAtMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$video',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.YouTubeVideo,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$parentComment',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.YouTubeComment,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$replies',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.YouTubeComment,
			cardinality: EntityFieldCardinality.Many,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
