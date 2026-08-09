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
		entityType: EntityType.BlockheadStateChannel,
		cardinality: EntityFieldCardinality.One,
	},
	version: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	stateData: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	intent: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	allocations: {
		primitiveType: type({
			destination: type('string'),
			token: type('string'),
			amount: type('bigint'),
		}).array(),
		cardinality: EntityFieldCardinality.One,
	},
	signatures: {
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.One,
	},
	isFinal: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	timestamp: {
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
