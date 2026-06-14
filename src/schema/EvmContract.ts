import { type } from 'arktype'

import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAbi } from '$/schema/EvmAbi.ts'
import { Source } from '$/sources/Source.ts'

export enum EvmContractSelector {
	EvmNetworkAddress = 'evmNetworkAddress',
}


const storageSlotRead = type({
	slot: ZeroExHex,
	value: ZeroExHex,
})

export default {
	entityType: EntityType.EvmContract,

	label: 'EVM Contract',
	labelPlural: 'EVM Contracts',

	selectors: [
		{
			name: EvmContractSelector.EvmNetworkAddress,
			fields: [
				'$network',
				'address',
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
			name: 'address',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'precompileName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$deployer',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Sourcify_Rest,
				Source.Blockscout_Rest,
				Source.Etherscan_Rest,
			],
		},
		{
			name: '$creationTransaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmTransaction,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
				Source.Sourcify_Rest,
				Source.Etherscan_Rest,
			],
		},
		{
			name: '$implementation',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
				Source.Sourcify_Rest,
				Source.Etherscan_Rest,
			],
		},
		{
			name: 'codeHash',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Voltaire_JsonRpc,
				Source.Blockscout_Rest,
				Source.Etherscan_Rest,
			],
		},
		{
			name: 'code',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Voltaire_JsonRpc,
				Source.Blockscout_Rest,
				Source.Etherscan_Rest,
			],
		},
		{
			name: 'abi',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAbi,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Sourcify_Rest,
				Source.Etherscan_Rest,
				Source.Blockscout_Rest,
			],
		},
		{
			name: 'storageSlotReads',
			type: EntityFieldType.Primitive,
			primitiveType: storageSlotRead,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Voltaire_JsonRpc,
				Source.Blockscout_Rest,
				Source.Etherscan_Rest,
			],
		},
		{
			name: '$verification',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContractVerification,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Sourcify_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
