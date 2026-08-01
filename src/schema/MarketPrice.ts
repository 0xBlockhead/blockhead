// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.MarketPrice,
	labels: {
		singular: 'Market price',
		plural: 'market prices',
	},
})({
	$market: {
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.One,
	},
	$parentMarket: {
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Constants_Internal,
			Source.Coingecko_Rest,
			Source.CoinMarketCap_Rest,
			Source.Coinpaprika_Rest,
			Source.Defillama_Rest,
			Source.TradingView_Rest,
		],
	},
	$$quotes: {
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Market_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockscout_Rest,
			Source.Coingecko_Rest,
			Source.CoinMarketCap_Rest,
			Source.Coinpaprika_Rest,
			Source.Defillama_Rest,
			Source.TradingView_Rest,
		],
	},
})({
	selectors: {
		Market: [
			'$market',
		],
	},
})
