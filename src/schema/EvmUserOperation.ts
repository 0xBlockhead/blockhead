// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		label: 'Operation hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	$bundledTransaction: {
		label: 'Bundled transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	$sender: {
		label: 'Sender',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Erc4337SmartAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	$block: {
		label: 'Bundled block',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	successful: {
		label: 'Successful',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	fee: {
		label: 'Fee',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	nonce: {
		label: 'Nonce',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	callGasLimit: {
		label: 'Call gas limit',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	verificationGasLimit: {
		label: 'Verification gas limit',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	preVerificationGas: {
		label: 'Pre-verification gas',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	maxFeePerGas: {
		label: 'Max fee per gas',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	maxPriorityFeePerGas: {
		label: 'Max priority fee per gas',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	gas: {
		label: 'Gas',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	gasUsed: {
		label: 'Gas used',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	gasPrice: {
		label: 'Gas price',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	entryPointVersion: {
		label: 'Entry point version',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	$entryPoint: {
		label: 'EntryPoint',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	initCode: {
		label: 'Init code',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	callData: {
		label: 'Call data',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	sponsorType: {
		label: 'Sponsor type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	paymasterAndData: {
		label: 'Paymaster data',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	signature: {
		label: 'Signature',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	$paymaster: {
		label: 'Paymaster',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Erc4337Paymaster,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	$bundler: {
		label: 'Bundler',
		type: EntityFieldType.EntityReference,
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
