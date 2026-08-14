// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BeaconExecutionPayloadEnvelope_Timestamp,
	labels: {
		singular: 'Beacon execution payload envelope observation',
		plural: 'Beacon execution payload envelope observations',
	},
})({
	$envelope: {
		entityType: EntityType.BeaconExecutionPayloadEnvelope,
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
		EnvelopeTimestampMsSource: [
			'$envelope',
			'timestampMs',
			'source',
		],
	},
})
