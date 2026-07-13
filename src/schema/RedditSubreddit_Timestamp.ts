// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum RedditSubreddit_TimestampSelector {
	SubredditTimestampMsSource = 'SubredditTimestampMsSource',
}
export const RedditSubreddit_Timestamp = entity({
	entityType: EntityType.RedditSubreddit_Timestamp,
	labels: {
		singular: 'Reddit subreddit timestamp',
		plural: 'Reddit subreddit observations',
	},
})({
	$subreddit: {
		label: 'Subreddit',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.RedditSubreddit,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	subscriberCount: {
		label: 'Subscribers',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	activeUserCount: {
		label: 'Active users',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		SubredditTimestampMsSource: [
			'$subreddit',
			'timestampMs',
			'source',
		],
	},
})
