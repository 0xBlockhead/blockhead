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
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	passphrase: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$ledgers: {
		entityType: EntityType.StellarLedger,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		entityType: EntityType.StellarTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$operations: {
		entityType: EntityType.StellarOperation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$accounts: {
		entityType: EntityType.StellarAccount,
		cardinality: EntityFieldCardinality.Many,
	},
	$$assets: {
		entityType: EntityType.StellarAsset,
		cardinality: EntityFieldCardinality.Many,
	},
	$$claimableBalances: {
		entityType: EntityType.StellarClaimableBalance,
		cardinality: EntityFieldCardinality.Many,
	},
	$$contracts: {
		entityType: EntityType.SorobanContract,
		cardinality: EntityFieldCardinality.Many,
	},
	$$liquidityPools: {
		entityType: EntityType.StellarLiquidityPool,
		cardinality: EntityFieldCardinality.Many,
	},
	$$offers: {
		entityType: EntityType.StellarOffer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$trades: {
		entityType: EntityType.StellarTrade,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
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
