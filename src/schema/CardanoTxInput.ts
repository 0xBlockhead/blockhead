// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CardanoTxInputSelector {
	TransactionInputIndex = 'TransactionInputIndex',
}
export default {
	entityType: EntityType.CardanoTxInput,
	label: 'cardano transaction input',
	labelPlural: 'cardano transaction inputs',
	selectors: [
		{
			name: CardanoTxInputSelector.TransactionInputIndex,
			fields: [
				'$transaction',
				'inputIndex',
			],
		},
	],
	fields: [
		{
				name: '$transaction',
				label: 'transaction',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.CardanoTransaction,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'inputIndex',
				label: 'input index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'inputKind',
				label: 'input kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'spentTxHash',
				label: 'spent transaction hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'spentOutputIndex',
				label: 'spent output index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$spentOutput',
				label: 'spent output',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.CardanoTxOutput,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'redeemerIndex',
				label: 'redeemer index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
