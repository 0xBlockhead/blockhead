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
	entityType: EntityType.SolanaValidator_Timestamp,
	labels: {
		singular: 'solana validator timestamp',
		plural: 'Solana validator observations',
	},
})({
	$validator: {
		entityType: EntityType.SolanaValidator,
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
	},
	nodePubkey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: solanaJsonRpcSources,
	},
	activatedStakeLamports: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: solanaJsonRpcSources,
	},
	commission: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: solanaJsonRpcSources,
	},
	delinquent: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: solanaJsonRpcSources,
	},
	lastVoteSlot: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: solanaJsonRpcSources,
	},
	rootSlot: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: solanaJsonRpcSources,
	},
	epochCredits: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: solanaJsonRpcSources,
	},
})({
	selectors: {
		ValidatorSlotSource: [
			'$validator',
			'slot',
			'source',
		],
	},
})
