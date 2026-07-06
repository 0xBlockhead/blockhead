// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EthereumBeaconFinality_TimestampSelector {
	EvmNetworkTimestampMs = 'EvmNetworkTimestampMs',
}
export default {
	entityType: EntityType.EthereumBeaconFinality_Timestamp,
	label: 'ethereum beacon finality timestamp',
	labelPlural: 'Ethereum beacon finality observations',
	selectors: [
		{
			name: EthereumBeaconFinality_TimestampSelector.EvmNetworkTimestampMs,
			fields: [
				'$network',
				'timestampMs',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'Network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'currentJustifiedCheckpointEpoch',
			label: 'Current justified checkpoint epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'currentJustifiedCheckpointRoot',
			label: 'Current justified checkpoint root',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'previousJustifiedCheckpointEpoch',
			label: 'Previous justified checkpoint epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'previousJustifiedCheckpointRoot',
			label: 'Previous justified checkpoint root',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'finalizedCheckpointEpoch',
			label: 'Finalized checkpoint epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'finalizedCheckpointRoot',
			label: 'Finalized checkpoint root',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
