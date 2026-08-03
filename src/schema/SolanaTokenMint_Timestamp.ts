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
	entityType: EntityType.SolanaTokenMint_Timestamp,
	labels: {
		singular: 'solana token mint timestamp',
		plural: 'Solana token mint observations',
	},
})({
	$mint: {
		entityType: EntityType.SolanaTokenMint,
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
	supply: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: solanaJsonRpcSources,
	},
	decimals: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: solanaJsonRpcSources,
	},
	mintAuthorityPubkey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: solanaJsonRpcSources,
	},
	freezeAuthorityPubkey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: solanaJsonRpcSources,
	},
	isInitialized: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: solanaJsonRpcSources,
	},
})({
	selectors: {
		MintSlotSource: [
			'$mint',
			'slot',
			'source',
		],
	},
})
