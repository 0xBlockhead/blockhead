import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
export enum EvmContractSelector {
	EvmNetworkAddress = 'evmNetworkAddress',
	NetworkAddress = '$network+address',
}
export default {
	entityType: EntityType.EvmContract,
	label: 'EVM contract',
	labelPlural: 'EVM contracts',
	description: 'A smart contract account and its contract-specific metadata on an EVM-compatible network.',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'address',
			label: 'Address',
			description: 'The address or account identifier used by the source protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'precompileName',
			label: 'precompile name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$deployer',
			label: 'deployer',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$creationTransaction',
			label: 'creation transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmTransaction,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$implementation',
			label: 'implementation',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'codeHash',
			label: 'code hash',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'code',
			label: 'code',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'abi',
			label: 'ABI',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'storageSlotReads',
			label: 'storage slot reads',
			type: EntityFieldType.Primitive,
			primitiveType: type({"slot": "string", "value": "string"}),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$verification',
			label: 'verification',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContractVerification,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
