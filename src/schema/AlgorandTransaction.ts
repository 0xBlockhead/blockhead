import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AlgorandTransactionSelector {
	NetworkTxId = '$network+txId',
}
export default {
	entityType: EntityType.AlgorandTransaction,
	label: 'algorand transaction',
	labelPlural: 'algorand transactions',
	selectors: [
		{
			name: AlgorandTransactionSelector.NetworkTxId,
			fields: [
				'$network',
				'txId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AlgorandNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'txId',
			label: 'transaction ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'round',
			label: 'round',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sender',
			label: 'sender',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transactionType',
			label: 'transaction type',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'fee',
			label: 'fee',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'group',
			label: 'group',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$group',
			label: 'group',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AlgorandTransactionGroup,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'parentTransactionId',
			label: 'parent transaction ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'innerTransactionIndex',
			label: 'inner transaction index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'innerTxns',
			label: 'inner txns',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'logs',
			label: 'logs',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'payload',
			label: 'payload',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$proofs',
			label: 'proofs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AlgorandTransactionProof,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
