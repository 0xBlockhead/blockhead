import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BitcoinCashCashTokenFungibleAmountSelector {
	UtxoOutput = 'utxoOutput',
	Output = '$output',
}
export default {
	entityType: EntityType.BitcoinCashCashTokenFungibleAmount,
	label: 'Bitcoin cash cash token fungible amount',
	labelPlural: 'Bitcoin cash cash token fungible amounts',
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
			label: 'output',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoOutput,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$category',
			label: 'category',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BitcoinCashCashTokenCategory,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'amount',
			label: 'amount',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
