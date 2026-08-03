// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const solanaJsonRpcSources = [
	Source.Solana_JsonRpc,
] as const

export default entity({
	entityType: EntityType.SolanaTransaction,
	labels: {
		singular: 'solana transaction',
		plural: 'Solana transactions',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	signature: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$block: {
		entityType: EntityType.SolanaBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$feePayer: {
		entityType: EntityType.SolanaAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slot: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeLamports: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	computeUnitsConsumed: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.SolanaTransaction_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: solanaJsonRpcSources,
	},
	$$instructions: {
		entityType: EntityType.SolanaInstruction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: solanaJsonRpcSources,
	},
})({
	selectors: {
		NetworkSignature: [
			'$network',
			'signature',
		],
	},
})
