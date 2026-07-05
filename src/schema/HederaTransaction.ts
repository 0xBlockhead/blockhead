// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HederaTransactionSelector {
	NetworkConsensusTimestamp = 'NetworkConsensusTimestamp',
	NetworkTransactionIdNonce = 'NetworkTransactionIdNonce',
}
export default {
	entityType: EntityType.HederaTransaction,
	label: 'hedera transaction',
	labelPlural: 'hedera transactions',
	selectors: [
		{
			name: HederaTransactionSelector.NetworkConsensusTimestamp,
			fields: [
				'$network',
				'consensusTimestamp',
			],
		},
		{
			name: HederaTransactionSelector.NetworkTransactionIdNonce,
			fields: [
				'$network',
				'transactionId',
				'nonce',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.HederaNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'consensusTimestamp',
				label: 'consensus timestamp',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'transactionId',
				label: 'transaction ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'nonce',
				label: 'nonce',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'transactionType',
				label: 'transaction type',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'payerAccount',
				label: 'payer account',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'result',
				label: 'result',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'chargedTxFeeTinybar',
				label: 'charged transaction fee tinybar',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'validStartTimestamp',
				label: 'valid start timestamp',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'nodeAccountId',
				label: 'node account ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'scheduled',
				label: 'scheduled',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$block',
				label: 'block',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.HederaBlock,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$schedule',
				label: 'schedule',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.HederaSchedule,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$hbarTransfers',
				label: 'hbar transfers',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HederaHbarTransfer,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$tokenTransfers',
				label: 'token transfers',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HederaTokenTransfer,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$contractResults',
				label: 'contract results',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HederaContractResult,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
