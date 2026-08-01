// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SolanaTransaction_Timestamp,
	labels: {
		singular: 'solana transaction timestamp',
		plural: 'Solana transaction observations',
	},
})({
	$transaction: {
		label: 'Transaction',
		entityType: EntityType.SolanaTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	slot: {
		label: 'Slot',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Solana_JsonRpc,
			Source.Helius,
		],
	},
	feeLamports: {
		label: 'Fee',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Solana_JsonRpc,
			Source.Helius,
		],
	},
	computeUnitsConsumed: {
		label: 'Compute units consumed',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Solana_JsonRpc,
		],
	},
	status: {
		label: 'Status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Solana_JsonRpc,
			Source.Helius,
		],
	},
	confirmationStatus: {
		label: 'Confirmation status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Solana_JsonRpc,
		],
	},
	err: {
		label: 'Error',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Solana_JsonRpc,
			Source.Helius,
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
