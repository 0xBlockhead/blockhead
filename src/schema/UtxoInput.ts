import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum UtxoInputSelector {
	UtxoTransactionInputIndex = 'utxoTransactionInputIndex',
	TransactionInputIndex = '$transaction+inputIndex',
}
export default {
	entityType: EntityType.UtxoInput,
	label: 'UTXO input',
	labelPlural: 'UTXO inputs',
	selectors: [
		{
			name: UtxoInputSelector.UtxoTransactionInputIndex,
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
			entityType: EntityType.UtxoTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'inputIndex',
			label: 'input index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$spentOutput',
			label: 'spent output',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoOutput,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'coinbaseScript',
			label: 'coinbase script',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'scriptSigAsm',
			label: 'script sig asm',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sequence',
			label: 'sequence',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'witness',
			label: 'witness',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
