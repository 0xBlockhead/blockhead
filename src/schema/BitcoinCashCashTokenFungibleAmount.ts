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
	entityType: EntityType.BitcoinCashCashTokenFungibleAmount,
	labels: {
		singular: 'Bitcoin Cash CashToken fungible amount',
		plural: 'Bitcoin Cash CashToken fungible amounts',
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
	amount: {
		primitiveType: type('bigint'),
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
