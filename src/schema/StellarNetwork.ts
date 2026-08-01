// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.StellarNetwork,
	labels: {
		singular: 'stellar network',
		plural: 'stellar networks',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	passphrase: {
		label: 'passphrase',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$ledgers: {
		label: 'ledgers',
		entityType: EntityType.StellarLedger,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		entityType: EntityType.StellarTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$operations: {
		label: 'operations',
		entityType: EntityType.StellarOperation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$accounts: {
		label: 'accounts',
		entityType: EntityType.StellarAccount,
		cardinality: EntityFieldCardinality.Many,
	},
	$$assets: {
		label: 'assets',
		entityType: EntityType.StellarAsset,
		cardinality: EntityFieldCardinality.Many,
	},
	$$claimableBalances: {
		label: 'claimable balances',
		entityType: EntityType.StellarClaimableBalance,
		cardinality: EntityFieldCardinality.Many,
	},
	$$contracts: {
		label: 'contracts',
		entityType: EntityType.SorobanContract,
		cardinality: EntityFieldCardinality.Many,
	},
	$$liquidityPools: {
		label: 'liquidity pools',
		entityType: EntityType.StellarLiquidityPool,
		cardinality: EntityFieldCardinality.Many,
	},
	$$offers: {
		label: 'offers',
		entityType: EntityType.StellarOffer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$trades: {
		label: 'trades',
		entityType: EntityType.StellarTrade,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.StellarNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})
