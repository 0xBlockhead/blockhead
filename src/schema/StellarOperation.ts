import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum StellarOperationSelector {
	TransactionOperationIndex = '$transaction+operationIndex',
}
export default {
	entityType: EntityType.StellarOperation,
	label: 'stellar operation',
	labelPlural: 'stellar operations',
	selectors: [
		{
			name: StellarOperationSelector.TransactionOperationIndex,
			fields: [
				'$transaction',
				'operationIndex',
			],
		},
	],
	fields: [
		{
			name: '$transaction',
			label: 'transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StellarTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'operationIndex',
			label: 'operation index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'operationType',
			label: 'operation type',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'sourceAccount',
			label: 'source account',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'body',
			label: 'body',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'resultCode',
			label: 'result code',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
