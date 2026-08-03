// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmUserOperation,
	labels: {
		singular: 'User operation',
		plural: 'user operations',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	$bundledTransaction: {
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	$sender: {
		entityType: EntityType.Erc4337SmartAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	$block: {
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	successful: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	fee: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	nonce: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	callGasLimit: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	verificationGasLimit: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	preVerificationGas: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	maxFeePerGas: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	maxPriorityFeePerGas: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	gas: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	gasUsed: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	gasPrice: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	entryPointVersion: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	$entryPoint: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	initCode: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	callData: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	sponsorType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	paymasterAndData: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	signature: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	$paymaster: {
		entityType: EntityType.Erc4337Paymaster,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	$bundler: {
		entityType: EntityType.Erc4337Bundler,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
})({
	selectors: {
		EvmNetworkHash: [
			'$network',
			'hash',
		],
	},
})
