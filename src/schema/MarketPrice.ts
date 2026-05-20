import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Market from '$/schema/Market.ts'
import Network from '$/schema/Network.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	entityType: EntityType.MarketPrice,

	label: 'Quote',
	labelPlural: 'Quotes',

	/**
	 * Quote stream id: which market, optional per-feed key, optional on-chain context.
	 * Timestamped spot/index prints live on `Market_Timestamp` (`$$quotes`).
	 */
	id: type({
		$market: Market.id,
		'feedKey?': 'string',
		'$network?': Network.id,
	}),

	fields: [
		{
			name: '$$parentMarket',
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
				Source.TradingView_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
