// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum SolanaTransaction_TimestampSelector {
	TransactionSlotSource = 'TransactionSlotSource',
}
export const SolanaTransaction_Timestamp = entity({
	entityType: EntityType.SolanaTransaction_Timestamp,
	labels: {
		singular: 'solana transaction timestamp',
		plural: 'Solana transaction observations',
	},
})({
	$transaction: {
		label: 'Transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SolanaTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	slot: {
		label: 'Slot',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
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
	feeLamports: {
		label: 'Fee',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Solana_JsonRpc,
			Source.Helius_Rest,
		],
	},
	computeUnitsConsumed: {
		label: 'Compute units consumed',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Solana_JsonRpc,
			Source.Helius_Rest,
		],
	},
	status: {
		label: 'Status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Solana_JsonRpc,
			Source.Helius_Rest,
		],
	},
	confirmationStatus: {
		label: 'Confirmation status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Solana_JsonRpc,
			Source.Helius_Rest,
		],
	},
	err: {
		label: 'Error',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Solana_JsonRpc,
			Source.Helius_Rest,
		],
	},
})({
	selectors: {
		TransactionSlotSource: [
			'$transaction',
			'slot',
			'source',
		],
	},
})
