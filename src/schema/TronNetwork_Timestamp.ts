// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum TronNetwork_TimestampSelector {
	NetworkTimestampMsSource = 'NetworkTimestampMsSource',
}
export default {
	entityType: EntityType.TronNetwork_Timestamp,
	label: 'tron network timestamp',
	labelPlural: 'tron network observations',
	selectors: [
		{
			name: TronNetwork_TimestampSelector.NetworkTimestampMsSource,
			fields: [
				'$network',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'Network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
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
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'latestBlockHeight',
			label: 'Latest block height',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
		{
			name: 'latestBlockHash',
			label: 'Latest block hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
		{
			name: 'latestBlockTimeMs',
			label: 'Latest block time',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
		{
			name: 'latestBlockTransactionCount',
			label: 'Latest block transactions',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
		{
			name: 'witnessCount',
			label: 'Witness count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
		{
			name: 'activeWitnessCount',
			label: 'Active witnesses',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
		{
			name: 'nodeBlockHeight',
			label: 'Node block height',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
		{
			name: 'solidityBlockHeight',
			label: 'Solidity block height',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
		{
			name: 'currentPeerCount',
			label: 'Current peers',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
		{
			name: 'maintenanceIntervalMs',
			label: 'Maintenance interval',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
		{
			name: 'transactionFeeSun',
			label: 'Transaction fee sun',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
		{
			name: 'createAccountFeeSun',
			label: 'Create account fee sun',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
	],
} as const satisfies EntityDefinition
