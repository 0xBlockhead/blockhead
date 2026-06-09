import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const RedditCommentFullname = type(
	'/^t1_[A-Za-z0-9]+$/' as type.cast<string>,
)

export default {
	entityType: EntityType.RedditComment,

	label: 'Reddit comment',
	labelPlural: 'Reddit comments',

	id: type({
		fullname: RedditCommentFullname,
	}),

	fields: [
		{
			name: 'body',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'author',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'score',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RedditComment_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'createdAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'depth',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$link',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.RedditLink,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$parentComment',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.RedditComment,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$replies',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RedditComment,
			cardinality: EntityFieldCardinality.Many,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
