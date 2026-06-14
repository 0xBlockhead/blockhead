import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import EvmTransaction from '$/schema/EvmTransaction.ts'

export enum BridgeTransactionSelector {
	EvmAccountEvmTransactionCreatedAt = 'evmAccountEvmTransactionCreatedAt',
}

export default {
	entityType: EntityType.BridgeTransaction,

	label: 'Bridge Transaction',
	labelPlural: 'Bridge Transactions',

	selectors: [
		{
			name: BridgeTransactionSelector.EvmAccountEvmTransactionCreatedAt,
			fields: [
				'$account',
				'$sourceTx',
				'createdAt',
			],
		},
	],

	fields: [
		{
			name: '$account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$sourceTx',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'createdAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
