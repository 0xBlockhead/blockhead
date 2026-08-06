// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export default entity({
	entityType: EntityType.EvmNetworkAccount,
	labels: {
		singular: 'EVM network account',
		plural: 'EVM network accounts',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$actor: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.EvmNetworkAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockscout_Rest,
			Source.SafeTransactionService_Rest,
		],
	},
	$$queuedTransactions: {
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.SafeTransactionService_Rest,
		],
	},
	$$tokenTransfers: {
		entityType: EntityType.EvmTokenTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$internalTransfers: {
		entityType: EntityType.EvmInternalTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$ownedCoins: {
		entityType: EntityType.EvmNetworkActorCoinBalance,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Allium_Rest,
		],
	},
	$$nfts: {
		entityType: EntityType.EvmNft,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.OpenSea_Rest,
		],
	},
	$$erc20TokenAllowances: {
		entityType: EntityType.EvmActorCoinAllowance,
		cardinality: EntityFieldCardinality.Many,
	},
	$$aaveReservePositions: {
		entityType: EntityType.AaveReservePosition,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	$$eulerEvkVaultPositions: {
		entityType: EntityType.EulerEvkVaultPosition,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	$$gmxPositions: {
		entityType: EntityType.GmxPosition,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Gmx_Rest,
		],
	},
	$$morphoMarketPositions: {
		entityType: EntityType.MorphoMarketPosition,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Morpho_Graphql,
		],
	},
	$$morphoVaultPositions: {
		entityType: EntityType.MorphoVaultPosition,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Morpho_Graphql,
		],
	},
})({
	selectors: {
		EvmNetworkEvmAccount: [
			'$network',
			'$actor',
		],
	},
})
