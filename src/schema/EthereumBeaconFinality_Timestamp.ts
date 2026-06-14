import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'

export enum EthereumBeaconFinality_TimestampSelector {
	EvmNetworkTimestampMs = 'evmNetworkTimestampMs',
}

export default {
	entityType: EntityType.EthereumBeaconFinality_Timestamp,

	label: 'Beacon finality snapshot',
	labelPlural: 'Beacon finality snapshots',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'currentJustifiedCheckpointEpoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'currentJustifiedCheckpointRoot',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'previousJustifiedCheckpointEpoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'previousJustifiedCheckpointRoot',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'finalizedCheckpointEpoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'finalizedCheckpointRoot',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
