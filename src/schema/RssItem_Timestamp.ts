// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.RssItem_Timestamp,
	labels: {
		singular: 'RSS item observation',
		plural: 'RSS item observations',
	},
})({
	$item: {
		label: 'Item',
		entityType: EntityType.RssItem,
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
	observed: {
		label: 'Observed',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	reachable: {
		label: 'Feed reachable',
		primitiveType: type('boolean'),
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
		ItemTimestampMsSource: [
			'$item',
			'timestampMs',
			'source',
		],
	},
})
