// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum RedditSubredditSelector {
	Name = 'Name',
}
export default {
	entityType: EntityType.RedditSubreddit,
	label: 'Reddit subreddit',
	labelPlural: 'Reddit subreddits',
	selectors: [
		{
			name: RedditSubredditSelector.Name,
			fields: [
				'name',
			],
		},
	],
	fields: [
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable subreddit name.',
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
			name: 'publicDescription',
			label: 'Public description',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAt',
			label: 'Created',
			description: 'The time when the subreddit was created according to Reddit.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'over18',
			label: 'Over 18',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$icon',
			label: 'Icon',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RedditSubreddit_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Reddit_PublicJson,
			],
		},
		{
			name: '$$links',
			label: 'Submissions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RedditLink,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
				Source.Reddit_PublicJson,
			],
		},
	],
} as const satisfies EntityDefinition
