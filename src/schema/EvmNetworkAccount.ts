// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum EvmNetworkAccountSelector {
	EvmNetworkEvmAccount = 'EvmNetworkEvmAccount',
}
export const EvmNetworkAccount = entity({
	entityType: EntityType.EvmNetworkAccount,
	labels: {
		singular: 'EVM network account',
		plural: 'EVM network accounts',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$actor: {
		label: 'actor',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmNetworkAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	$$tokenTransfers: {
		label: 'token transfers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmTokenTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$internalTransfers: {
		label: 'internal transfers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmInternalTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$ownedCoins: {
		label: 'owned coins',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmNetworkActorCoinBalance,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Allium_Rest,
		],
	},
	$$erc20TokenAllowances: {
		label: 'erc20 token allowances',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmActorCoinAllowance,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		EvmNetworkEvmAccount: [
			'$network',
			'$actor',
		],
	},
})
