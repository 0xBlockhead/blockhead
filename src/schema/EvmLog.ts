// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum EvmLogSelector {
	TransactionIndexInTransaction = 'TransactionIndexInTransaction',
}
export default {
	entityType: EntityType.EvmLog,
	label: 'EVM log',
	labelPlural: 'EVM logs',
	description: 'An event log emitted by an EVM transaction receipt.',
	selectors: [
		{
			name: EvmLogSelector.TransactionIndexInTransaction,
			fields: [
				'$transaction',
				'indexInTransaction',
			],
		},
	],
	fields: [
		{
			name: 'indexInTransaction',
			label: 'Index in transaction',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$transaction',
			label: 'Transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$block',
			label: 'Block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$topics',
			label: 'Topics',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmTopic,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'data',
			label: 'Data',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'removed',
			label: 'Removed',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$emitter',
			label: 'Emitter contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$tokenTransfers',
			label: 'Token transfers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmTokenTransfer,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
