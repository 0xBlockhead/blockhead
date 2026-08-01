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
		entityType: EntityType.StellarNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	assetKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	assetKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	assetCode: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	issuer: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$issuerAccount: {
		entityType: EntityType.StellarAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$claimableBalances: {
		entityType: EntityType.StellarClaimableBalance,
		cardinality: EntityFieldCardinality.Many,
	},
	$$liquidityPools: {
		entityType: EntityType.StellarLiquidityPool,
		cardinality: EntityFieldCardinality.Many,
	},
	$$trustlines: {
		entityType: EntityType.StellarTrustline,
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
})({
	selectors: {
		NetworkAssetKey: [
			'$network',
			'assetKey',
		],
	},
})
