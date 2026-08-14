// Generated from APP.ts.

import { EvmTransactionEnvelopeType, EvmTransactionExecutionStatus, EvmTransactionKind } from '$/constants/Evm.ts'
import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Hash32, lowercaseHexIdentityValue, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
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
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	txHash: {
		primitiveType: Hash32,
		cardinality: EntityFieldCardinality.One,
		normalize: lowercaseHexIdentityValue,
	},
	envelopeType: {
		primitiveType: type.enumerated(...Object.values(EvmTransactionEnvelopeType)),
		cardinality: EntityFieldCardinality.One,
	},
	kind: {
		primitiveType: type.enumerated(...Object.values(EvmTransactionKind)),
		cardinality: EntityFieldCardinality.One,
	},
	$from: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$to: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	value: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	nonce: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	indexInBlock: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gas: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasPrice: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasUsed: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cumulativeGasUsed: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	effectiveGasPrice: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	input: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	r: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	s: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	v: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	executionStatus: {
		primitiveType: type.enumerated(...Object.values(EvmTransactionExecutionStatus)),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$block: {
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$logs: {
		entityType: EntityType.EvmLog,
		cardinality: EntityFieldCardinality.Many,
	},
	$$internalTransfers: {
		entityType: EntityType.EvmInternalTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$stateChanges: {
		entityType: EntityType.EvmStateChange,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	$$tokenTransfers: {
		entityType: EntityType.EvmTokenTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokenApprovals: {
		entityType: EntityType.EvmTokenApproval,
		cardinality: EntityFieldCardinality.Many,
	},
	$$userOperations: {
		entityType: EntityType.EvmUserOperation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$traces: {
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
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			maxPriorityFeePerGas: {
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
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			blobGasUsed: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$$blobs: {
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
				entityType: EntityType.Eip7702Authorization,
				cardinality: EntityFieldCardinality.Many,
			},
		}),
	},
})
