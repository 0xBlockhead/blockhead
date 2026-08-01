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
		label: 'channel',
		entityType: EntityType.BlockheadStateChannel,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	totalDeposited: {
		label: 'total deposited',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	balance0: {
		label: 'balance0',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	balance1: {
		label: 'balance1',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	turnNum: {
		label: 'turn num',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	status: {
		label: 'status',
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
