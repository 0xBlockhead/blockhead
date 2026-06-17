import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Market from '$/schema/Market.ts'
import { Source } from '$/sources/Source.ts'

export enum MarketPriceSelector {
	Market = 'market',
}

export default {
	entityType: EntityType.MarketPrice,

	label: 'Quote stream',
	labelPlural: 'Quote streams',

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
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
