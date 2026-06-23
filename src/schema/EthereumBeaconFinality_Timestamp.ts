import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum EthereumBeaconFinality_TimestampSelector {
	EvmNetworkTimestampMs = 'evmNetworkTimestampMs',
	NetworkTimestampMs = '$network+timestampMs',
}
export default {
	entityType: EntityType.EthereumBeaconFinality_Timestamp,
	label: 'ethereum beacon finality timestamp',
	labelPlural: 'ethereum beacon finality observations',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'currentJustifiedCheckpointEpoch',
			label: 'current justified checkpoint epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'currentJustifiedCheckpointRoot',
			label: 'current justified checkpoint root',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'previousJustifiedCheckpointEpoch',
			label: 'previous justified checkpoint epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'previousJustifiedCheckpointRoot',
			label: 'previous justified checkpoint root',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'finalizedCheckpointEpoch',
			label: 'finalized checkpoint epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'finalizedCheckpointRoot',
			label: 'finalized checkpoint root',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
