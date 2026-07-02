// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum Erc4337PaymasterSelector {
	EvmNetworkAddress = 'EvmNetworkAddress',
}
export default {
	entityType: EntityType.Erc4337Paymaster,
	label: 'ERC-4337 paymaster',
	labelPlural: 'ERC-4337 paymasters',
	selectors: [
		{
			name: Erc4337PaymasterSelector.EvmNetworkAddress,
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
				entityType: EntityType.Erc4337Paymaster_Timestamp,
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
