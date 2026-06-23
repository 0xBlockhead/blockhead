import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum RedditCommentSelector {
	Fullname = 'fullname',
}
export default {
	entityType: EntityType.RedditComment,
	label: 'Reddit comment',
	labelPlural: 'Reddit comments',
	selectors: [
		{
			name: RedditCommentSelector.Fullname,
			fields: [
				'fullname',
			],
		},
	],
	fields: [
		{
			name: 'fullname',
			label: 'fullname',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'body',
			label: 'body',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'author',
			label: 'author',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RedditComment_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'createdAt',
			label: 'Created',
			description: 'The time when the subject was created according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'depth',
			label: 'depth',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$link',
			label: 'link',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.RedditLink,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$parentComment',
			label: 'parent comment',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.RedditComment,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$replies',
			label: 'replies',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RedditComment,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
