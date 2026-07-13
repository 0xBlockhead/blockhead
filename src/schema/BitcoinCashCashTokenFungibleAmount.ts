// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum BitcoinCashCashTokenFungibleAmountSelector {
	UtxoOutput = 'UtxoOutput',
}
export const BitcoinCashCashTokenFungibleAmount = entity({
	entityType: EntityType.BitcoinCashCashTokenFungibleAmount,
	labels: {
		singular: 'Bitcoin Cash CashToken fungible amount',
		plural: 'Bitcoin Cash CashToken fungible amounts',
	},
})({
	$output: {
		label: 'Output',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.UtxoOutput,
		cardinality: EntityFieldCardinality.One,
	},
	$category: {
		label: 'Category',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BitcoinCashCashTokenCategory,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.BitcoinCashNode_JsonRpc,
		],
	},
	amount: {
		label: 'Amount',
		type: EntityFieldType.Primitive,
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
