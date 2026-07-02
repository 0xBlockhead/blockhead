// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum EvmUserOperationSelector {
	EvmNetworkHash = 'EvmNetworkHash',
}
export default {
	entityType: EntityType.EvmUserOperation,
	label: 'User operation',
	labelPlural: 'user operations',
	selectors: [
		{
			name: EvmUserOperationSelector.EvmNetworkHash,
			fields: [
				'$network',
				'hash',
			],
		},
	],
	fields: [
		{
				name: '$network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'hash',
				label: 'Operation hash',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Blockscout_Rest,
				],
		},
		{
				name: '$bundledTransaction',
				label: 'Bundled transaction',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmTransaction,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
		},
		{
				name: '$sender',
				label: 'Sender',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Erc4337SmartAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
		},
		{
				name: '$block',
				label: 'Bundled block',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmBlock,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
		},
		{
				name: 'successful',
				label: 'Successful',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
		},
		{
				name: 'fee',
				label: 'Fee',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
		},
		{
				name: 'nonce',
				label: 'Nonce',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
		},
		{
				name: 'callGasLimit',
				label: 'Call gas limit',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
		},
		{
				name: 'verificationGasLimit',
				label: 'Verification gas limit',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
		},
		{
				name: 'preVerificationGas',
				label: 'Pre-verification gas',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
		},
		{
				name: 'maxFeePerGas',
				label: 'Max fee per gas',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
		},
		{
				name: 'maxPriorityFeePerGas',
				label: 'Max priority fee per gas',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
		},
		{
				name: 'gas',
				label: 'Gas',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
		},
		{
				name: 'gasUsed',
				label: 'Gas used',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
		},
		{
				name: 'gasPrice',
				label: 'Gas price',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
		},
		{
				name: 'entryPointVersion',
				label: 'Entry point version',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
		},
		{
				name: '$entryPoint',
				label: 'EntryPoint',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmContract,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
		},
		{
				name: 'initCode',
				label: 'Init code',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
		},
		{
				name: 'callData',
				label: 'Call data',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
		},
		{
				name: 'sponsorType',
				label: 'Sponsor type',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
		},
		{
				name: 'paymasterAndData',
				label: 'Paymaster data',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
		},
		{
				name: 'signature',
				label: 'Signature',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
		},
		{
				name: '$paymaster',
				label: 'Paymaster',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Erc4337Paymaster,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
		},
		{
				name: '$bundler',
				label: 'Bundler',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Erc4337Bundler,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
				],
		},
	],
} as const satisfies EntityDefinition
