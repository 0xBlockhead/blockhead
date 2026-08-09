// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadStateChannel_Timestamp,
	labels: {
		singular: 'blockhead state channel timestamp',
		plural: 'blockhead state channel observations',
	},
})({
	$channel: {
		entityType: EntityType.BlockheadStateChannel,
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
	totalDeposited: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	balance0: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	balance1: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	turnNum: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	status: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		ChannelTimestampMsSource: [
			'$channel',
			'timestampMs',
			'source',
		],
	},
})
