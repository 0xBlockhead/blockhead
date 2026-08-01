// Generated from APP.ts.

import { EvmTransactionEnvelopeType, EvmTransactionExecutionStatus, EvmTransactionKind } from '$/constants/Evm.ts'
import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmTransaction,
	labels: {
		singular: 'EVM transaction',
		plural: 'EVM transactions',
	},
	description: 'A transaction submitted to or included in an EVM-compatible network.',
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	txHash: {
		label: 'Transaction hash',
		description: 'The transaction hash in its network.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	envelopeType: {
		label: 'Transaction envelope type',
		primitiveType: type.enumerated(...Object.values(EvmTransactionEnvelopeType)),
		cardinality: EntityFieldCardinality.One,
	},
	kind: {
		label: 'Kind',
		primitiveType: type.enumerated(...Object.values(EvmTransactionKind)),
		cardinality: EntityFieldCardinality.One,
	},
	$from: {
		label: 'From',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$to: {
		label: 'To',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	value: {
		label: 'Value',
		description: 'The native asset amount sent by the transaction.',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	nonce: {
		label: 'Nonce',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	indexInBlock: {
		label: 'Index in block',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gas: {
		label: 'Gas limit',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasPrice: {
		label: 'Gas price',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasUsed: {
		label: 'Gas used',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cumulativeGasUsed: {
		label: 'Cumulative gas used',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	effectiveGasPrice: {
		label: 'Effective gas price',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	input: {
		label: 'Input data',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	r: {
		label: 'Signature r',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	s: {
		label: 'Signature s',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	v: {
		label: 'Signature v',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	executionStatus: {
		label: 'Status',
		primitiveType: type.enumerated(...Object.values(EvmTransactionExecutionStatus)),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$block: {
		label: 'Block',
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$logs: {
		label: 'Receipt logs',
		entityType: EntityType.EvmLog,
		cardinality: EntityFieldCardinality.Many,
	},
	$$internalTransfers: {
		label: 'Internal transfers',
		entityType: EntityType.EvmInternalTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokenTransfers: {
		label: 'Token transfers',
		entityType: EntityType.EvmTokenTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$userOperations: {
		label: 'User operations',
		entityType: EntityType.EvmUserOperation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$traces: {
		label: 'Traces',
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
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			maxPriorityFeePerGas: {
				label: 'Priority fee',
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
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			blobGasUsed: {
				label: 'Blob gas used',
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$$blobs: {
				label: 'Blobs',
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
				entityType: EntityType.Eip7702Authorization,
				cardinality: EntityFieldCardinality.Many,
			},
		}),
	},
})
