// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const blockscoutRestSources = [
	Source.Blockscout_Rest,
] as const

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
		defaultSources: blockscoutRestSources,
	},
	$bundledTransaction: {
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestSources,
	},
	$sender: {
		entityType: EntityType.Erc4337SmartAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestSources,
	},
	$block: {
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestSources,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestSources,
	},
	successful: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestSources,
	},
	fee: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestSources,
	},
	nonce: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestSources,
	},
	callGasLimit: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestSources,
	},
	verificationGasLimit: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestSources,
	},
	preVerificationGas: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestSources,
	},
	maxFeePerGas: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestSources,
	},
	maxPriorityFeePerGas: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestSources,
	},
	gas: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestSources,
	},
	gasUsed: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestSources,
	},
	gasPrice: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestSources,
	},
	entryPointVersion: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestSources,
	},
	$entryPoint: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestSources,
	},
	initCode: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestSources,
	},
	callData: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestSources,
	},
	sponsorType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestSources,
	},
	paymasterAndData: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestSources,
	},
	signature: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestSources,
	},
	$paymaster: {
		entityType: EntityType.Erc4337Paymaster,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestSources,
	},
	$bundler: {
		entityType: EntityType.Erc4337Bundler,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestSources,
	},
})({
	selectors: {
		EvmNetworkHash: [
			'$network',
			'hash',
		],
	},
})
