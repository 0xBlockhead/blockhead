// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BeaconDataColumn_Timestamp,
	labels: {
		singular: 'beacon data column custody observation',
		plural: 'Beacon data column custody observations',
	},
})({
	$dataColumn: {
		entityType: EntityType.BeaconDataColumn,
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
	endpointUrl: {
		primitiveType: UrlString,
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
		DataColumnTimestampMsSource: [
			'$dataColumn',
			'timestampMs',
			'source',
		],
	},
})
