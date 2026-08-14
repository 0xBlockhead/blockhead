// Generated from APP.ts.

import { SafeMultisigOperation } from '$/constants/Safe.ts'
import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, Hash32, lowercaseHexIdentityValue, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SafeMultisigTransaction,
	labels: {
		singular: 'Safe transaction',
		plural: 'Safe transactions',
	},
	description: 'A Safe-signed inner transaction identified by its EIP-712 safeTxHash. It is not the outer chain transaction that later executes it.',
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	safeTxHash: {
		primitiveType: Hash32,
		cardinality: EntityFieldCardinality.One,
		normalize: lowercaseHexIdentityValue,
	},
	$safe: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	$to: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	value: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	data: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	operation: {
		primitiveType: type.enumerated(...Object.values(SafeMultisigOperation)),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	nonce: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	safeTxGas: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	baseGas: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	gasPrice: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	gasToken: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	$refundReceiver: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	$proposer: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	$executor: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	isExecuted: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	isSuccessful: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	confirmationsRequired: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	submittedAtMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	executedAtMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	modifiedAtMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	$executionTransaction: {
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
})({
	selectors: {
		EvmNetworkSafeTxHash: [
			'$network',
			'safeTxHash',
		],
	},
})
