// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum RedditLinkSelector {
	Fullname = 'Fullname',
}
export default {
	entityType: EntityType.RedditLink,
	label: 'Reddit submission',
	labelPlural: 'Reddit submissions',
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
			label: 'Fullname',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'title',
			label: 'Title',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'selftext',
			label: 'Body',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'url',
			label: 'URL',
			description: 'The URL for the linked resource.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'permalink',
			label: 'Permalink',
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
			description: 'The time when the submission was created according to Reddit.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$subreddit',
			label: 'Subreddit',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.RedditSubreddit,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RedditLink_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Reddit_PublicJson,
			],
		},
		{
			name: '$$comments',
			label: 'Comments',
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
