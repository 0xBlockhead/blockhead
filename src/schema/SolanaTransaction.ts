// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SolanaTransaction,
	labels: {
		singular: 'solana transaction',
		plural: 'Solana transactions',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	signature: {
		label: 'Signature',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$block: {
		label: 'Block',
		entityType: EntityType.SolanaBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$feePayer: {
		label: 'Fee payer',
		entityType: EntityType.SolanaAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slot: {
		label: 'Slot',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeLamports: {
		label: 'Fee',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	computeUnitsConsumed: {
		label: 'Compute units consumed',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'Status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		entityType: EntityType.SolanaTransaction_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Solana_JsonRpc,
		],
	},
	$$instructions: {
		label: 'Instructions',
		entityType: EntityType.SolanaInstruction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Solana_JsonRpc,
		],
	},
})({
	selectors: {
		NetworkSignature: [
			'$network',
			'signature',
		],
	},
})
