// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.RssFeed_Timestamp,
	labels: {
		singular: 'RSS feed observation',
		plural: 'RSS feed observations',
	},
})({
	$feed: {
		entityType: EntityType.RssFeed,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	reachable: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	observedItemCount: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	fetchWindowKind: {
		primitiveType: type.unit('Feed'),
		cardinality: EntityFieldCardinality.One,
	},
	error: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		FeedTimestampMsSource: [
			'$feed',
			'timestampMs',
			'source',
		],
	},
})
