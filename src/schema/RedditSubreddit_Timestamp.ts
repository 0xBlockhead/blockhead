// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum RedditSubreddit_TimestampSelector {
	SubredditTimestampMsSource = 'SubredditTimestampMsSource',
}
export default {
	entityType: EntityType.RedditSubreddit_Timestamp,
	label: 'Reddit subreddit timestamp',
	labelPlural: 'Reddit subreddit observations',
	selectors: [
		{
			name: RedditSubreddit_TimestampSelector.SubredditTimestampMsSource,
			fields: [
				'$subreddit',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$subreddit',
				label: 'Subreddit',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.RedditSubreddit,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'subscriberCount',
				label: 'Subscribers',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'activeUserCount',
				label: 'Active users',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
