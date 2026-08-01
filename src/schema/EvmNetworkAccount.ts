// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmNetworkAccount,
	labels: {
		singular: 'EVM network account',
		plural: 'EVM network accounts',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$actor: {
		label: 'actor',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.EvmNetworkAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	$$tokenTransfers: {
		label: 'token transfers',
		entityType: EntityType.EvmTokenTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$internalTransfers: {
		label: 'internal transfers',
		entityType: EntityType.EvmInternalTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$ownedCoins: {
		label: 'owned coins',
		entityType: EntityType.EvmNetworkActorCoinBalance,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Allium_Rest,
		],
	},
	$$erc20TokenAllowances: {
		label: 'erc20 token allowances',
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
