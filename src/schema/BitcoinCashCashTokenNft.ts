import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BitcoinCashCashTokenNftSelector {
	UtxoOutput = 'utxoOutput',
	Output = '$output',
}
export default {
	entityType: EntityType.BitcoinCashCashTokenNft,
	label: 'Bitcoin cash cash token NFT',
	labelPlural: 'Bitcoin cash cash token NFTs',
	selectors: [
		{
			name: BitcoinCashCashTokenNftSelector.UtxoOutput,
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
			name: '$commitment',
			label: 'commitment',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BitcoinCashCashTokenCommitment,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'capability',
			label: 'capability',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
