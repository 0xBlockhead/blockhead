// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BitcoinCashCashTokenNftSelector {
	UtxoOutput = 'UtxoOutput',
}
export default {
	entityType: EntityType.BitcoinCashCashTokenNft,
	label: 'Bitcoin Cash CashToken NFT',
	labelPlural: 'Bitcoin Cash CashToken NFTs',
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
			name: '$commitment',
			label: 'Commitment',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BitcoinCashCashTokenCommitment,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'capability',
			label: 'Capability',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
