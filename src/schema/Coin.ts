// Generated from APP.ts. Do not edit by hand.

import { CoinId } from '$/constants/Coin.ts'
import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CoinSelector {
	CoinId = 'CoinId',
}
export const Coin = entity({
	entityType: EntityType.Coin,
	label: 'Coin',
	labelPlural: 'coins',
	description: 'A market-facing coin or crypto asset identity used across price, market, and network contexts.',
})({
	coinId: {
		label: 'Coin ID',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(CoinId)),
		cardinality: EntityFieldCardinality.One,
	},
	symbol: {
		label: 'Symbol',
		description: 'The short ticker or symbol used for display.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	decimals: {
		label: 'Decimals',
		description: 'The number of decimal places used to display the amount.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$logo: {
		label: 'Logo',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Coin_Timestamp,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$coinInstances: {
		label: 'Coin instances',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$marketsWithCoinAsBase: {
		label: 'Markets with coin as base',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$marketsWithCoinAsQuote: {
		label: 'Markets with coin as quote',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$bridgeCapabilities: {
		label: 'Bridge capabilities',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CoinBridgeCapability,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$assetSupplyTimestamps: {
		label: 'Asset supply timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AssetSupply_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		CoinId: [
			'coinId',
		],
	},
})
