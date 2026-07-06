// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum Erc4337SmartAccountSelector {
	EvmNetworkAddress = 'EvmNetworkAddress',
}
export default {
	entityType: EntityType.Erc4337SmartAccount,
	label: 'ERC-4337 smart account',
	labelPlural: 'ERC-4337 smart accounts',
	selectors: [
		{
			name: Erc4337SmartAccountSelector.EvmNetworkAddress,
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
			name: 'userOperationsCount',
			label: 'User operations',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$contract',
			label: 'Contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$factory',
			label: 'Factory',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Erc4337AccountFactory,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'Timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Erc4337SmartAccount_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$userOperations',
			label: 'User operations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmUserOperation,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
