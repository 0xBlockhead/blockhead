// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.XPost_Timestamp,
	labels: {
		singular: 'X post observation',
		plural: 'X post observations',
	},
})({
	$post: {
		label: 'Post',
		entityType: EntityType.XPost,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this immutable post observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	likeCount: {
		label: 'Likes',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	retweetCount: {
		label: 'Retweets',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	replyCount: {
		label: 'Replies',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	quoteCount: {
		label: 'Quotes',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		XPostTimestampMsSource: [
			'$post',
			'timestampMs',
			'source',
		],
	},
})
