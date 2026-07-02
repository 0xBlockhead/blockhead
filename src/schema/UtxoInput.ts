// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum UtxoInputSelector {
	TransactionIndexInTransaction = 'TransactionIndexInTransaction',
}
export default {
	entityType: EntityType.UtxoInput,
	label: 'UTXO input',
	labelPlural: 'UTXO inputs',
	selectors: [
		{
			name: UtxoInputSelector.TransactionIndexInTransaction,
			fields: [
				'$transaction',
				'indexInTransaction',
			],
		},
	],
	fields: [
		{
				name: '$transaction',
				label: 'Transaction',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.UtxoTransaction,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'indexInTransaction',
				label: 'Index in transaction',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$spentOutput',
				label: 'Spent output',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.UtxoOutput,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'coinbaseScript',
				label: 'Coinbase script',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'scriptSigAsm',
				label: 'Script sig asm',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'sequence',
				label: 'Sequence',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'witness',
				label: 'Witness',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
