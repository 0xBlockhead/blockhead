// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.StellarAsset,
	labels: {
		singular: 'stellar asset',
		plural: 'stellar assets',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.StellarNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	assetKey: {
		label: 'asset key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	assetKind: {
		label: 'asset kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	assetCode: {
		label: 'asset code',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	issuer: {
		label: 'issuer',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$issuerAccount: {
		label: 'issuer account',
		entityType: EntityType.StellarAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$claimableBalances: {
		label: 'claimable balances',
		entityType: EntityType.StellarClaimableBalance,
		cardinality: EntityFieldCardinality.Many,
	},
	$$liquidityPools: {
		label: 'liquidity pools',
		entityType: EntityType.StellarLiquidityPool,
		cardinality: EntityFieldCardinality.Many,
	},
	$$trustlines: {
		label: 'trustlines',
		entityType: EntityType.StellarTrustline,
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
})({
	selectors: {
		NetworkAssetKey: [
			'$network',
			'assetKey',
		],
	},
})
