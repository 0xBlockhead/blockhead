// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	assetKey: {
		label: 'asset key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	assetKind: {
		label: 'asset kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	assetCode: {
		label: 'asset code',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	issuer: {
		label: 'issuer',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$issuerAccount: {
		label: 'issuer account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$claimableBalances: {
		label: 'claimable balances',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.StellarClaimableBalance,
		cardinality: EntityFieldCardinality.Many,
	},
	$$liquidityPools: {
		label: 'liquidity pools',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.StellarLiquidityPool,
		cardinality: EntityFieldCardinality.Many,
	},
	$$trustlines: {
		label: 'trustlines',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.StellarTrustline,
		cardinality: EntityFieldCardinality.Many,
	},
	$$offers: {
		label: 'offers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.StellarOffer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$trades: {
		label: 'trades',
		type: EntityFieldType.EntitiesReference,
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
