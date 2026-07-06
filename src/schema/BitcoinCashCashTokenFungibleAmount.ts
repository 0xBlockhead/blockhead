// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BitcoinCashCashTokenFungibleAmountSelector {
	UtxoOutput = 'UtxoOutput',
}
export default {
	entityType: EntityType.BitcoinCashCashTokenFungibleAmount,
	label: 'Bitcoin Cash CashToken fungible amount',
	labelPlural: 'Bitcoin Cash CashToken fungible amounts',
	selectors: [
		{
			name: BitcoinCashCashTokenFungibleAmountSelector.UtxoOutput,
			fields: [
				'$output',
			],
		},
	],
	fields: [
		{
			name: '$output',
			label: 'Output',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoOutput,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$category',
			label: 'Category',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BitcoinCashCashTokenCategory,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'amount',
			label: 'Amount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
