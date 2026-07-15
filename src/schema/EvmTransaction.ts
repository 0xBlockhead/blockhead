// Generated from APP.ts. Do not edit by hand.

import { EvmTransactionEnvelopeType, EvmTransactionExecutionStatus, EvmTransactionKind } from '$/constants/Evm.ts'
import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum EvmTransactionSelector {
	EvmNetworkTxHash = 'EvmNetworkTxHash',
}
export const EvmTransaction = entity({
	entityType: EntityType.EvmTransaction,
	labels: {
		singular: 'EVM transaction',
		plural: 'EVM transactions',
	},
	description: 'A transaction submitted to or included in an EVM-compatible network.',
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	txHash: {
		label: 'Transaction hash',
		description: 'The transaction hash in its network.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	envelopeType: {
		label: 'Transaction envelope type',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(EvmTransactionEnvelopeType)),
		cardinality: EntityFieldCardinality.One,
	},
	kind: {
		label: 'Kind',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(EvmTransactionKind)),
		cardinality: EntityFieldCardinality.One,
	},
	$from: {
		label: 'From',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$to: {
		label: 'To',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	value: {
		label: 'Value',
		description: 'The native asset amount sent by the transaction.',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	nonce: {
		label: 'Nonce',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	indexInBlock: {
		label: 'Index in block',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gas: {
		label: 'Gas limit',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasPrice: {
		label: 'Gas price',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasUsed: {
		label: 'Gas used',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cumulativeGasUsed: {
		label: 'Cumulative gas used',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	effectiveGasPrice: {
		label: 'Effective gas price',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	input: {
		label: 'Input data',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	r: {
		label: 'Signature r',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	s: {
		label: 'Signature s',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	v: {
		label: 'Signature v',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	executionStatus: {
		label: 'Status',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(EvmTransactionExecutionStatus)),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$block: {
		label: 'Block',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$logs: {
		label: 'Receipt logs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmLog,
		cardinality: EntityFieldCardinality.Many,
	},
	$$internalTransfers: {
		label: 'Internal transfers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmInternalTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokenTransfers: {
		label: 'Token transfers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmTokenTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$userOperations: {
		label: 'User operations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmUserOperation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$traces: {
		label: 'Traces',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmTrace,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		EvmNetworkTxHash: [
			'$network',
			'txHash',
		],
	},

	facets: {
		ContractCreation: facet({
			path: [
				'kind',
			],
			is: 'ContractCreation',
		})({
			$contract: {
				label: 'Created contract',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmContract,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
		}),
		FeeMarket: facet({
			path: [
				'envelopeType',
			],
			isOneOf: [
				'FeeMarket',
				'Blob',
				'SetCode',
			],
		})({
			maxFeePerGas: {
				label: 'Max fee',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			maxPriorityFeePerGas: {
				label: 'Priority fee',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
		}),
		Blob: facet({
			path: [
				'envelopeType',
			],
			is: 'Blob',
		})({
			maxFeePerBlobGas: {
				label: 'Max fee per blob gas',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			blobGasUsed: {
				label: 'Blob gas used',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$$blobs: {
				label: 'Blobs',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EvmBlob,
				cardinality: EntityFieldCardinality.Many,
			},
		}),
		SetCode: facet({
			path: [
				'envelopeType',
			],
			is: 'SetCode',
		})({
			$$authorizations: {
				label: 'EIP-7702 authorizations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.Eip7702Authorization,
				cardinality: EntityFieldCardinality.Many,
			},
		}),
	},
})
