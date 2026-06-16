import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum RedditLinkSelector {
	Fullname = 'fullname',
}


const RedditLinkFullname = type(
	'/^t3_[A-Za-z0-9]+$/' as type.cast<string>
)

export default {
	entityType: EntityType.RedditLink,

	label: 'Reddit post',
	labelPlural: 'Reddit posts',

	selectors: [
		{
			name: RedditLinkSelector.Fullname,
			fields: [
				'fullname',
			],
		},
	],

	fields: [
		{
			name: 'fullname',
			type: EntityFieldType.Primitive,
			primitiveType: RedditLinkFullname,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'title',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'selftext',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'url',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'permalink',
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
			name: '$$timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RedditLink_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'createdAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$subreddit',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.RedditSubreddit,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$comments',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RedditComment,
			cardinality: EntityFieldCardinality.Many,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
