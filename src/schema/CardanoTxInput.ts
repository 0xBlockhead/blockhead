// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CardanoTxInputSelector {
	TransactionInputIndex = 'TransactionInputIndex',
}
export const CardanoTxInput = entity({
	entityType: EntityType.CardanoTxInput,
	labels: {
		singular: 'cardano transaction input',
		plural: 'cardano transaction inputs',
	},
})({
	$transaction: {
		label: 'transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CardanoTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	inputIndex: {
		label: 'input index',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	inputKind: {
		label: 'input kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	spentTxHash: {
		label: 'spent transaction hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	spentOutputIndex: {
		label: 'spent output index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$spentOutput: {
		label: 'spent output',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CardanoTxOutput,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	redeemerIndex: {
		label: 'redeemer index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TransactionInputIndex: [
			'$transaction',
			'inputIndex',
		],
	},
})
