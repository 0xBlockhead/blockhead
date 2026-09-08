// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.MevBuilder_Timestamp,
	labels: {
		singular: 'MEV builder timestamp',
		plural: 'MEV builder observations',
	},
})({
	$builder: {
		entityType: EntityType.MevBuilder,
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
	deliveredPayloadCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deliveredValueWei: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	relayCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	windowStartSlot: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	windowEndSlot: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sampleLimit: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		BuilderTimestampMsSourceSampleLimit: [
			'$builder',
			'timestampMs',
			'source',
			'sampleLimit',
		],
	},
})
