// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BeaconBlock_Timestamp,
	labels: {
		singular: 'beacon block observation',
		plural: 'Beacon block observations',
	},
})({
	$block: {
		entityType: EntityType.BeaconBlock,
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
	canonical: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	executionOptimistic: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	finalized: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		BlockTimestampMsSource: [
			'$block',
			'timestampMs',
			'source',
		],
	},
})
