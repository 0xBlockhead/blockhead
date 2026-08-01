// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CardanoTxInput,
	labels: {
		singular: 'cardano transaction input',
		plural: 'cardano transaction inputs',
	},
})({
	$transaction: {
		label: 'transaction',
		entityType: EntityType.CardanoTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	inputIndex: {
		label: 'input index',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	inputKind: {
		label: 'input kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	spentTxHash: {
		label: 'spent transaction hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	spentOutputIndex: {
		label: 'spent output index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$spentOutput: {
		label: 'spent output',
		entityType: EntityType.CardanoTxOutput,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	redeemerIndex: {
		label: 'redeemer index',
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
