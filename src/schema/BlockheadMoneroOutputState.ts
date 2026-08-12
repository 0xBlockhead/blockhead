// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadMoneroOutputState,
	labels: {
		singular: 'blockhead monero output state',
		plural: 'blockhead monero output states',
	},
})({
	walletId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$wallet: {
		entityType: EntityType.BlockheadWallet,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$network: {
		entityType: EntityType.MoneroNetwork,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.MoneroWalletRpc_JsonRpc,
		],
	},
	$transaction: {
		entityType: EntityType.MoneroTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroWalletRpc_JsonRpc,
		],
	},
	$stealthOutput: {
		entityType: EntityType.MoneroStealthOutput,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	txHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	outputIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	accountIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroWalletRpc_JsonRpc,
		],
	},
	addressIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroWalletRpc_JsonRpc,
		],
	},
	amountAtomicUnits: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroWalletRpc_JsonRpc,
		],
	},
	keyImage: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroWalletRpc_JsonRpc,
		],
	},
	keyImageSignature: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	globalOutputIndex: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroWalletRpc_JsonRpc,
		],
	},
	$$timestamps: {
		entityType: EntityType.BlockheadMoneroOutputState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.MoneroWalletRpc_JsonRpc,
		],
	},
})({
	selectors: {
		WalletIdTxHashOutputIndex: [
			'walletId',
			'txHash',
			'outputIndex',
		],
	},
})
