// Generated from APP.ts. Do not edit by hand.

import { EvmInternalCallType } from '$/constants/Evm.ts'
import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EvmInternalTransferSelector {
	TransactionIndexInTransaction = 'TransactionIndexInTransaction',
}
export default {
	entityType: EntityType.EvmInternalTransfer,
	label: 'EVM internal transfer',
	labelPlural: 'EVM internal transfers',
	description: 'Native currency moved inside EVM transaction execution.',
	selectors: [
		{
			name: EvmInternalTransferSelector.TransactionIndexInTransaction,
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
			entityType: EntityType.EvmTransaction,
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
			name: '$from',
			label: 'From',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$to',
			label: 'To',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'value',
			label: 'Value',
			description: 'Native currency moved by the internal call.',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'callType',
			label: 'Call type',
			type: EntityFieldType.Primitive,
			primitiveType: type.enumerated(...Object.values(EvmInternalCallType)),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'success',
			label: 'Success',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$createdContract',
			label: 'Created contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
