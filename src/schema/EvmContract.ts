import { type } from 'arktype'

import { EvmAddress, ZeroExHex } from '$/schema/$ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Network from '$/schema/EvmNetwork.ts'
import { Source } from '$/sources/$Source.ts'

const storageSlotRead = type({
	slot: ZeroExHex,
	value: ZeroExHex,
})

export default {
	entityType: EntityType.EvmContract,

	label: 'EVM Contract',
	labelPlural: 'EVM Contracts',

	id: type({
		$network: Network.id,
		address: EvmAddress,
	}),

	fields: [
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
			entityType: EntityType.Actor,
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
			name: 'bytecodeHash',
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
			primitiveType: type('string'),
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
