// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum MarketPriceSelector {
	Market = 'Market',
}
export default {
	entityType: EntityType.MarketPrice,
	label: 'Market price',
	labelPlural: 'market prices',
	selectors: [
		{
			name: MarketPriceSelector.Market,
			fields: [
				'$market',
			],
		},
	],
	fields: [
		{
				name: '$market',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Market,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$parentMarket',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Market,
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
					Source.Coingecko_Rest,
					Source.Coingecko_OpenApi,
					Source.CoinMarketCap_Rest,
					Source.Coinpaprika_OpenApi,
					Source.Defillama_OpenApi,
					Source.Defillama_Rest,
				],
		},
		{
				name: '$$quotes',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.Market_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Blockscout_Rest,
					Source.Coingecko_Rest,
					Source.Coingecko_OpenApi,
					Source.CoinMarketCap_Rest,
					Source.Coinpaprika_OpenApi,
					Source.Defillama_OpenApi,
					Source.Defillama_Rest,
				],
		},
	],
} as const satisfies EntityDefinition
