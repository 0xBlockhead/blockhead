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
		label: 'Coin ID',
		primitiveType: type.enumerated(...Object.values(CoinId)),
		cardinality: EntityFieldCardinality.One,
	},
	symbol: {
		label: 'Symbol',
		description: 'The short ticker or symbol used for display.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$logo: {
		label: 'Logo',
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Timestamps',
		entityType: EntityType.Coin_Timestamp,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$coinInstances: {
		label: 'Coin instances',
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$marketsWithCoinAsBase: {
		label: 'Markets with coin as base',
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.ZeroOrMany,
		defaultSources: [
			Source.Constants_Internal,
			Source.Coingecko_Rest,
			Source.Coinpaprika_Rest,
		],
	},
	$$marketsWithCoinAsQuote: {
		label: 'Markets with coin as quote',
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.ZeroOrMany,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	$$bridgeCapabilities: {
		label: 'Bridge capabilities',
		entityType: EntityType.CoinBridgeCapability,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$assetSupplyTimestamps: {
		label: 'Asset supply timestamps',
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
