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
		entityType: EntityType.RssItem,
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
	observed: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	reachable: {
		primitiveType: type('boolean'),
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
		ItemTimestampMsSource: [
			'$item',
			'timestampMs',
			'source',
		],
	},
})
