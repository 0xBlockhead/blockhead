// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EvmNetworkAccountSelector {
	EvmNetworkEvmAccount = 'EvmNetworkEvmAccount',
}
export default {
	entityType: EntityType.EvmNetworkAccount,
	label: 'EVM network account',
	labelPlural: 'EVM network accounts',
	selectors: [
		{
			name: EvmNetworkAccountSelector.EvmNetworkEvmAccount,
			fields: [
				'$network',
				'$actor',
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
			name: '$actor',
			label: 'actor',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmNetworkAccount_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$transactions',
			label: 'transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$tokenTransfers',
			label: 'token transfers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmTokenTransfer,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$internalTransfers',
			label: 'internal transfers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmInternalTransfer,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$ownedCoins',
			label: 'owned coins',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmNetworkActorCoinBalance,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$erc20TokenAllowances',
			label: 'erc20 token allowances',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmActorCoinAllowance,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
