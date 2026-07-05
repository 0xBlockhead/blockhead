// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HederaHbarTransferSelector {
	TransactionAccountIdTransferIndex = 'TransactionAccountIdTransferIndex',
}
export default {
	entityType: EntityType.HederaHbarTransfer,
	label: 'hedera hbar transfer',
	labelPlural: 'hedera hbar transfers',
	selectors: [
		{
			name: HederaHbarTransferSelector.TransactionAccountIdTransferIndex,
			fields: [
				'$transaction',
				'accountId',
				'transferIndex',
			],
		},
	],
	fields: [
		{
				name: '$transaction',
				label: 'transaction',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.HederaTransaction,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'accountId',
				label: 'account ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'transferIndex',
				label: 'transfer index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'amountTinybar',
				label: 'amount tinybar',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'isApproval',
				label: 'is approval',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$account',
				label: 'account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.HederaAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
