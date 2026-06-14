import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum UtxoInputSelector {
	UtxoTransactionInputIndex = 'utxoTransactionInputIndex',
}

export default {
	entityType: EntityType.UtxoInput,

	label: 'UTXO Input',
	labelPlural: 'UTXO Inputs',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'inputIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$spentOutput',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoOutput,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'coinbaseScript',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'scriptSigAsm',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sequence',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'witness',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
