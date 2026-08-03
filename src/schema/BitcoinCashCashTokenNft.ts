// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const bitcoinCashNodeJsonRpcSources = [
	Source.BitcoinCashNode_JsonRpc,
] as const

export default entity({
	entityType: EntityType.BitcoinCashCashTokenNft,
	labels: {
		singular: 'Bitcoin Cash CashToken NFT',
		plural: 'Bitcoin Cash CashToken NFTs',
	},
})({
	$output: {
		entityType: EntityType.UtxoOutput,
		cardinality: EntityFieldCardinality.One,
	},
	$category: {
		entityType: EntityType.BitcoinCashCashTokenCategory,
		cardinality: EntityFieldCardinality.One,
		defaultSources: bitcoinCashNodeJsonRpcSources,
	},
	$commitment: {
		entityType: EntityType.BitcoinCashCashTokenCommitment,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: bitcoinCashNodeJsonRpcSources,
	},
	capability: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: bitcoinCashNodeJsonRpcSources,
	},
})({
	selectors: {
		UtxoOutput: [
			'$output',
		],
	},
})
