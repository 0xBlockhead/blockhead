// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EthereumBeaconFinality_TimestampSelector {
	EvmNetworkTimestampMs = 'EvmNetworkTimestampMs',
}
export const EthereumBeaconFinality_Timestamp = entity({
	entityType: EntityType.EthereumBeaconFinality_Timestamp,
	labels: {
		singular: 'ethereum beacon finality timestamp',
		plural: 'Ethereum beacon finality observations',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	currentJustifiedCheckpointEpoch: {
		label: 'Current justified checkpoint epoch',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	currentJustifiedCheckpointRoot: {
		label: 'Current justified checkpoint root',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	previousJustifiedCheckpointEpoch: {
		label: 'Previous justified checkpoint epoch',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	previousJustifiedCheckpointRoot: {
		label: 'Previous justified checkpoint root',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	finalizedCheckpointEpoch: {
		label: 'Finalized checkpoint epoch',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	finalizedCheckpointRoot: {
		label: 'Finalized checkpoint root',
		type: EntityFieldType.Primitive,
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
