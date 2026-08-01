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
		label: 'Feed',
		entityType: EntityType.RssFeed,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	reachable: {
		label: 'Reachable',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	observedItemCount: {
		label: 'Observed items',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	fetchWindowKind: {
		label: 'Fetch window',
		primitiveType: type.unit('Feed'),
		cardinality: EntityFieldCardinality.One,
	},
	error: {
		label: 'Error',
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
