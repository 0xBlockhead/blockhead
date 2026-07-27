// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.RssFeed,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	reachable: {
		label: 'Reachable',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	observedItemCount: {
		label: 'Observed items',
		type: EntityFieldType.Primitive,
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	fetchWindowKind: {
		label: 'Fetch window',
		type: EntityFieldType.Primitive,
		primitiveType: type.unit('Feed'),
		cardinality: EntityFieldCardinality.One,
	},
	error: {
		label: 'Error',
		type: EntityFieldType.Primitive,
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
