// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BitcoinCashCashTokenFungibleAmount,
	labels: {
		singular: 'Bitcoin Cash CashToken fungible amount',
		plural: 'Bitcoin Cash CashToken fungible amounts',
	},
})({
	$output: {
		label: 'Output',
		entityType: EntityType.UtxoOutput,
		cardinality: EntityFieldCardinality.One,
	},
	$category: {
		label: 'Category',
		entityType: EntityType.BitcoinCashCashTokenCategory,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.BitcoinCashNode_JsonRpc,
		],
	},
	amount: {
		label: 'Amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.BitcoinCashNode_JsonRpc,
		],
	},
})({
	selectors: {
		UtxoOutput: [
			'$output',
		],
	},
})
