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
		entityType: EntityType.SolanaTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	slot: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Solana_JsonRpc,
			Source.Helius,
		],
	},
	feeLamports: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Solana_JsonRpc,
			Source.Helius,
		],
	},
	computeUnitsConsumed: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Solana_JsonRpc,
		],
	},
	status: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Solana_JsonRpc,
			Source.Helius,
		],
	},
	confirmationStatus: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Solana_JsonRpc,
		],
	},
	err: {
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
