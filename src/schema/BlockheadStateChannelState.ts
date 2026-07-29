// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadStateChannel,
		cardinality: EntityFieldCardinality.One,
	},
	version: {
		label: 'version',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	stateData: {
		label: 'state data',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	intent: {
		label: 'intent',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	allocations: {
		label: 'allocations',
		type: EntityFieldType.Primitive,
		primitiveType: type({
			destination: type('string'),
			token: type('string'),
			amount: type('bigint'),
		}).array(),
		cardinality: EntityFieldCardinality.One,
	},
	signatures: {
		label: 'signatures',
		type: EntityFieldType.Primitive,
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.One,
	},
	isFinal: {
		label: 'is final',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	timestamp: {
		label: 'timestamp',
		type: EntityFieldType.Primitive,
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
