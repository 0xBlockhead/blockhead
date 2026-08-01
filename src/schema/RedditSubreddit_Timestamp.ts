// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.RedditSubreddit_Timestamp,
	labels: {
		singular: 'Reddit subreddit timestamp',
		plural: 'Reddit subreddit observations',
	},
})({
	$subreddit: {
		label: 'Subreddit',
		entityType: EntityType.RedditSubreddit,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	subscriberCount: {
		label: 'Subscribers',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	activeUserCount: {
		label: 'Active users',
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
