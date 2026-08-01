// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadStateChannelState,
	labels: {
		singular: 'blockhead state channel state',
		plural: 'blockhead state channel states',
	},
})({
	$channel: {
		label: 'channel',
		entityType: EntityType.BlockheadStateChannel,
		cardinality: EntityFieldCardinality.One,
	},
	version: {
		label: 'version',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	stateData: {
		label: 'state data',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	intent: {
		label: 'intent',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	allocations: {
		label: 'allocations',
		primitiveType: type({
			destination: type('string'),
			token: type('string'),
			amount: type('bigint'),
		}).array(),
		cardinality: EntityFieldCardinality.One,
	},
	signatures: {
		label: 'signatures',
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.One,
	},
	isFinal: {
		label: 'is final',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	timestamp: {
		label: 'timestamp',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		ChannelVersionStateData: [
			'$channel',
			'version',
			'stateData',
		],
	},
})
