import { type } from 'arktype'

import { ZeroExHex } from '$/schema/$ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { evmTraceTreeNode } from '$/schema/EvmTrace.ts'
import {
	EvmTransactionEnvelopeType,
	EvmTransactionExecutionStatus,
	EvmTransactionKind,
} from '$/constants/Evm.ts'
import Network from '$/schema/Network.ts'
import { Source } from '$/sources/$Source.ts'

// Signed execution-layer transaction (RPC/indexer).
export default {
	entityType: EntityType.EvmTransaction,

	label: 'EVM Transaction',
	labelPlural: 'EVM Transactions',

	id: type({
		$network: Network.id,
		txHash: ZeroExHex,
	}),

	fields: [
		{
			name: '$block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$from',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Actor,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$to',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Actor,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'transactionIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'value',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'nonce',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'input',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'gas',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'kind',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(EvmTransactionKind),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'envelopeType',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(EvmTransactionEnvelopeType),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'executionStatus',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(EvmTransactionExecutionStatus),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'gasPrice',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'gasUsed',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'cumulativeGasUsed',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'effectiveGasPrice',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'maxFeePerGas',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'maxPriorityFeePerGas',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'blobGasUsed',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: 'maxFeePerBlobGas',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: '$$blobs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmBlob,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: '$$userOperations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmUserOperation,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: '$$tokenTransfers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmTokenTransfer,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Blockscout_Rest,
				Source.Etherscan_Rest,
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: '$$internalTransfers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmInternalTransfer,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Blockscout_Rest,
				Source.Etherscan_Rest,
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: '$$logs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmLog,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Voltaire_JsonRpc,
				Source.Blockscout_Rest,
			],
		},
		{
			name: 'traceRoot',
			type: EntityFieldType.Primitive,
			primitiveType: evmTraceTreeNode,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: 'traceUnavailable',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
				Source.Voltaire_JsonRpc,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
