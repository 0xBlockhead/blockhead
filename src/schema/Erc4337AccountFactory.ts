// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum Erc4337AccountFactorySelector {
	EvmNetworkAddress = 'EvmNetworkAddress',
}
export const Erc4337AccountFactory = entity({
	entityType: EntityType.Erc4337AccountFactory,
	labels: {
		singular: 'ERC-4337 account factory',
		plural: 'ERC-4337 account factories',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		type: EntityFieldType.Primitive,
		primitiveType: (EvmAddress),
		cardinality: EntityFieldCardinality.One,
	},
	$contract: {
		label: 'Contract',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'Timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Erc4337AccountFactory_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$userOperations: {
		label: 'User operations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmUserOperation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$smartAccounts: {
		label: 'Smart accounts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Erc4337SmartAccount,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		EvmNetworkAddress: [
			'$network',
			'address',
		],
	},
})
