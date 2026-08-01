// Generated from APP.ts.

import { CoinId } from '$/constants/Coin.ts'
import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.Coin,
	labels: {
		singular: 'Coin',
		plural: 'coins',
	},
	description: 'A market-facing coin or crypto asset identity used across price, market, and network contexts.',
})({
	coinId: {
		primitiveType: type.enumerated(...Object.values(CoinId)),
		cardinality: EntityFieldCardinality.One,
	},
	symbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$logo: {
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.Coin_Timestamp,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$coinInstances: {
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$marketsWithCoinAsBase: {
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.ZeroOrMany,
		defaultSources: [
			Source.Constants_Internal,
			Source.Coingecko_Rest,
			Source.Coinpaprika_Rest,
		],
	},
	$$marketsWithCoinAsQuote: {
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.ZeroOrMany,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	$$bridgeCapabilities: {
		entityType: EntityType.CoinBridgeCapability,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$assetSupplyTimestamps: {
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
