// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum EvmContractSelector {
	EvmNetworkAddress = 'EvmNetworkAddress',
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
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'address',
				label: 'Address',
				description: 'The address or account identifier used by the source protocol.',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'precompileName',
				label: 'Precompile name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$deployer',
				label: 'Deployer',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$creationTransaction',
				label: 'Creation transaction',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmTransaction,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$implementation',
				label: 'Implementation',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmContract,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'codeHash',
				label: 'Code hash',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'code',
				label: 'Code',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'abi',
				label: 'ABI',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'storageSlotReads',
				label: 'Storage slot reads',
				type: EntityFieldType.Primitive,
				primitiveType: type({ 'slot': type('string'), 'value': type('string') }),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$verification',
				label: 'Verification',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmContractVerification,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
