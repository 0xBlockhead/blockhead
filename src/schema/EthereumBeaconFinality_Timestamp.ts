// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EthereumBeaconFinality_Timestamp,
	labels: {
		singular: 'ethereum beacon finality timestamp',
		plural: 'Ethereum beacon finality observations',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	currentJustifiedCheckpointEpoch: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	currentJustifiedCheckpointRoot: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	previousJustifiedCheckpointEpoch: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	previousJustifiedCheckpointRoot: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	finalizedCheckpointEpoch: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	finalizedCheckpointRoot: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		EvmNetworkTimestampMs: [
			'$network',
			'timestampMs',
		],
	},
})
