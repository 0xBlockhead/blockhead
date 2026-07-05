// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum StellarAssetSelector {
	NetworkAssetKey = 'NetworkAssetKey',
}
export default {
	entityType: EntityType.StellarAsset,
	label: 'stellar asset',
	labelPlural: 'stellar assets',
	selectors: [
		{
			name: StellarAssetSelector.NetworkAssetKey,
			fields: [
				'$network',
				'assetKey',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.StellarNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'assetKey',
				label: 'asset key',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'assetKind',
				label: 'asset kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'assetCode',
				label: 'asset code',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'issuer',
				label: 'issuer',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$issuerAccount',
				label: 'issuer account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.StellarAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$claimableBalances',
				label: 'claimable balances',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.StellarClaimableBalance,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$liquidityPools',
				label: 'liquidity pools',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.StellarLiquidityPool,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$trustlines',
				label: 'trustlines',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.StellarTrustline,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$offers',
				label: 'offers',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.StellarOffer,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$trades',
				label: 'trades',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.StellarTrade,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
