import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
export enum Erc4337AccountFactorySelector {
	EvmNetworkAddress = 'evmNetworkAddress',
	NetworkAddress = '$network+address',
}
export default {
	entityType: EntityType.Erc4337AccountFactory,
	label: 'erc4337 account factory',
	labelPlural: 'erc4337 account factories',
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
			name: '$contract',
			label: 'contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Erc4337AccountFactory_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$userOperations',
			label: 'user operations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmUserOperation,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$smartAccounts',
			label: 'smart accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Erc4337SmartAccount,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
