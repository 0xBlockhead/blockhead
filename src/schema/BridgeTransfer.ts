// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BridgeTransferSelector {
	SourceTransferId = 'SourceTransferId',
	SourceTxSourceLogIndex = 'SourceTxSourceLogIndex',
}
export default {
	entityType: EntityType.BridgeTransfer,
	label: 'bridge transfer',
	labelPlural: 'bridge transfers',
	selectors: [
		{
			name: BridgeTransferSelector.SourceTransferId,
			fields: [
				'source',
				'transferId',
			],
		},
		{
			name: BridgeTransferSelector.SourceTxSourceLogIndex,
			fields: [
				'$sourceTx',
				'source',
				'logIndex',
			],
		},
	],
	fields: [
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'transferId',
				label: 'transfer ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$sourceTx',
				label: 'source tx',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmTransaction,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'logIndex',
				label: 'log index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$destinationTx',
				label: 'destination tx',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmTransaction,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$sender',
				label: 'sender',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$recipient',
				label: 'recipient',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$fromNetwork',
				label: 'from network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmNetwork,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$toNetwork',
				label: 'to network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmNetwork,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$fromToken',
				label: 'from token',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmCoinInstance,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$toToken',
				label: 'to token',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmCoinInstance,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'amountIn',
				label: 'amount in',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'amountOut',
				label: 'amount out',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'railId',
				label: 'rail ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'settlementModel',
				label: 'settlement model',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'verificationModel',
				label: 'verification model',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'assetOutcome',
				label: 'asset outcome',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BridgeTransfer_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
