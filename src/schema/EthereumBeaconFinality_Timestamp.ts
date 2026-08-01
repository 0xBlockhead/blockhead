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
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	currentJustifiedCheckpointEpoch: {
		label: 'Current justified checkpoint epoch',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	currentJustifiedCheckpointRoot: {
		label: 'Current justified checkpoint root',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	previousJustifiedCheckpointEpoch: {
		label: 'Previous justified checkpoint epoch',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	previousJustifiedCheckpointRoot: {
		label: 'Previous justified checkpoint root',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	finalizedCheckpointEpoch: {
		label: 'Finalized checkpoint epoch',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	finalizedCheckpointRoot: {
		label: 'Finalized checkpoint root',
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
