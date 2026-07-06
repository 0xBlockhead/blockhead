// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum Erc4337AccountFactorySelector {
	EvmNetworkAddress = 'EvmNetworkAddress',
}
export default {
	entityType: EntityType.Erc4337AccountFactory,
	label: 'ERC-4337 account factory',
	labelPlural: 'ERC-4337 account factories',
	selectors: [
		{
			name: Erc4337AccountFactorySelector.EvmNetworkAddress,
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
			type: EntityFieldType.Primitive,
			primitiveType: (EvmAddress),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$contract',
			label: 'Contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'Timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Erc4337AccountFactory_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$userOperations',
			label: 'User operations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmUserOperation,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$smartAccounts',
			label: 'Smart accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Erc4337SmartAccount,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
