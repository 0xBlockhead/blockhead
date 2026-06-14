import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import SolanaNetwork from '$/schema/SolanaNetwork.ts'
import { Source } from '$/sources/Source.ts'

export enum SolanaNetwork_TimestampSelector {
	SolanaNetworkTimestampMs = 'solanaNetworkTimestampMs',
}

export default {
	entityType: EntityType.SolanaNetwork_Timestamp,

	label: 'Solana network snapshot',
	labelPlural: 'Solana network snapshots',

	selectors: [
		{
			name: SolanaNetwork_TimestampSelector.SolanaNetworkTimestampMs,
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
			entityType: EntityType.SolanaNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'absoluteSlot',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Solana_JsonRpc,
			],
		},
		{
			name: 'blockHeight',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Solana_JsonRpc,
			],
		},
		{
			name: 'epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Solana_JsonRpc,
			],
		},
		{
			name: 'slotIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Solana_JsonRpc,
			],
		},
		{
			name: 'slotsInEpoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Solana_JsonRpc,
			],
		},
		{
			name: 'transactionCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Solana_JsonRpc,
			],
		},
		{
			name: 'currentValidatorCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Solana_JsonRpc,
			],
		},
		{
			name: 'delinquentValidatorCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Solana_JsonRpc,
			],
		},
		{
			name: 'totalActivatedStakeLamports',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Solana_JsonRpc,
			],
		},
		{
			name: 'solanaCoreVersion',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Solana_JsonRpc,
			],
		},
		{
			name: 'featureSet',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Solana_JsonRpc,
			],
		},
		{
			name: 'health',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Solana_JsonRpc,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
