import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadQuilibriumPendingTransactionSelector {
	AccountStateTransactionAddress = '$accountState+transactionAddress',
}
export default {
	entityType: EntityType.BlockheadQuilibriumPendingTransaction,
	label: 'blockhead quilibrium pending transaction',
	labelPlural: 'blockhead quilibrium pending transactions',
	selectors: [
		{
			name: BlockheadQuilibriumPendingTransactionSelector.AccountStateTransactionAddress,
			fields: [
				'$accountState',
				'transactionAddress',
			],
		},
	],
	fields: [
		{
			name: '$accountState',
			label: 'account state',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadQuilibriumAccountState,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transactionAddress',
			label: 'transaction address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$account',
			label: 'account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.QuilibriumAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$refundAccount',
			label: 'refund account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.QuilibriumAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'coinAddress',
			label: 'coin address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'amount',
			label: 'amount',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'deliveryType',
			label: 'delivery type',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'deliveryAddress',
			label: 'delivery address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'observedAt',
			label: 'observed AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
