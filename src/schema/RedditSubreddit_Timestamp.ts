import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import RedditSubreddit from '$/schema/RedditSubreddit.ts'
import { Source } from '$/sources/Source.ts'

export enum RedditSubreddit_TimestampSelector {
	RedditSubredditTimestampMs = 'redditSubredditTimestampMs',
}

export default {
	entityType: EntityType.RedditSubreddit_Timestamp,

	label: 'Reddit subreddit snapshot',
	labelPlural: 'Reddit subreddit snapshots',

	selectors: [
		{
			name: RedditSubreddit_TimestampSelector.RedditSubredditTimestampMs,
			fields: [
				'$subreddit',
				'timestampMs',
			],
		},
	],

	fields: [
		{
			name: '$subreddit',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.RedditSubreddit,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'subscriberCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Reddit_Rest,
				Source.Reddit_PublicJson,
			],
		},
		{
			name: 'activeUserCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Reddit_Rest,
				Source.Reddit_PublicJson,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
