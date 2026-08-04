// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmContract,
	labels: {
		singular: 'EVM contract',
		plural: 'EVM contracts',
	},
	description: 'A smart contract account and its contract-specific metadata on an EVM-compatible network.',
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	precompileName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$deployer: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$creationTransaction: {
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$implementation: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	threshold: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	nonce: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	version: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	$$owners: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	$$modules: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	$fallbackHandler: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	$guard: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	codeHash: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	code: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	abi: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	storageSlotReads: {
		primitiveType: type({
			slot: type('string'),
			value: type('string'),
		}),
		cardinality: EntityFieldCardinality.Many,
	},
	$$storageReads: {
		entityType: EntityType.EvmStorageRead_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$nfts: {
		entityType: EntityType.EvmNft,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.OpenSea_Rest,
		],
	},
	$verification: {
		entityType: EntityType.EvmContractVerification,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		EvmNetworkAddress: [
			'$network',
			'address',
		],
	},
})
