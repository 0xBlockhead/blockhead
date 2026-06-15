import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'

export enum EvmUserOperationSelector {
	EvmNetworkHash = 'evmNetworkHash',
}

export default {
	entityType: EntityType.EvmUserOperation,

	label: 'User operation',
	labelPlural: 'User operations',

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
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: '$bundledTransaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmTransaction,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: '$sender',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Erc4337SmartAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: '$block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: 'successful',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: 'fee',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: 'nonce',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: 'callGasLimit',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: 'verificationGasLimit',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: 'preVerificationGas',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: 'maxFeePerGas',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: 'maxPriorityFeePerGas',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: 'gas',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: 'gasUsed',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: 'gasPrice',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: 'entryPointVersion',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: '$entryPoint',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: 'initCode',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: 'callData',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: 'sponsorType',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: 'paymasterAndData',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: 'signature',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: '$paymaster',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Erc4337Paymaster,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: '$bundler',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Erc4337Bundler,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
