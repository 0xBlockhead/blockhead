import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export enum RedditCommentSelector {
	Fullname = 'fullname',
}


const RedditCommentFullname = type(
	'/^t1_[A-Za-z0-9]+$/' as type.cast<string>
)

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
			type: EntityFieldType.Primitive,
			primitiveType: RedditCommentFullname,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'body',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'author',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$$timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RedditComment_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'createdAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'depth',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$link',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.RedditLink,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$parentComment',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.RedditComment,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$$replies',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RedditComment,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
