// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum RedditCommentSelector {
	Fullname = 'Fullname',
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
			label: 'Fullname',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'body',
			label: 'Body',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'author',
			label: 'Author',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAt',
			label: 'Created',
			description: 'The time when the comment was created according to Reddit.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'depth',
			label: 'Depth',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$link',
			label: 'Submission',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.RedditLink,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$parentComment',
			label: 'Parent comment',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.RedditComment,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RedditComment_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Reddit_PublicJson,
			],
		},
		{
			name: '$$replies',
			label: 'Replies',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RedditComment,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
				Source.Reddit_PublicJson,
			],
		},
	],
} as const satisfies EntityDefinition
