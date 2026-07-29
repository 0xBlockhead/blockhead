// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.UtxoInput,
	labels: {
		singular: 'UTXO input',
		plural: 'UTXO inputs',
	},
})({
	$transaction: {
		label: 'Transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.UtxoTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	indexInTransaction: {
		label: 'Index in transaction',
		type: EntityFieldType.Primitive,
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$spentOutput: {
		label: 'Spent output',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.UtxoOutput,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	coinbaseScript: {
		label: 'Coinbase script',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	scriptSigAsm: {
		label: 'Script sig asm',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sequence: {
		label: 'Sequence',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	witness: {
		label: 'Witness',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		TransactionIndexInTransaction: [
			'$transaction',
			'indexInTransaction',
		],
	},
})
