// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum SolanaTransaction_TimestampSelector {
	TransactionSlotSource = 'TransactionSlotSource',
}
export default {
	entityType: EntityType.SolanaTransaction_Timestamp,
	label: 'solana transaction timestamp',
	labelPlural: 'Solana transaction observations',
	selectors: [
		{
			name: SolanaTransaction_TimestampSelector.TransactionSlotSource,
			fields: [
				'$transaction',
				'slot',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$transaction',
				label: 'Transaction',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.SolanaTransaction,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'slot',
				label: 'Slot',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
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
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Solana_JsonRpc,
					Source.Helius_Rest,
				],
		},
		{
				name: 'feeLamports',
				label: 'Fee',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Solana_JsonRpc,
					Source.Helius_Rest,
				],
		},
		{
				name: 'computeUnitsConsumed',
				label: 'Compute units consumed',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Solana_JsonRpc,
					Source.Helius_Rest,
				],
		},
		{
				name: 'status',
				label: 'Status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Solana_JsonRpc,
					Source.Helius_Rest,
				],
		},
		{
				name: 'confirmationStatus',
				label: 'Confirmation status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Solana_JsonRpc,
					Source.Helius_Rest,
				],
		},
		{
				name: 'err',
				label: 'Error',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Solana_JsonRpc,
					Source.Helius_Rest,
				],
		},
	],
} as const satisfies EntityDefinition
