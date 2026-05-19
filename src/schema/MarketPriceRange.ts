import { type } from 'arktype'
import { MarketPriceRangeType, MarketTimeIntervalUnit } from '$/constants/Market.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Market from '$/schema/Market.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	entityType: EntityType.MarketPriceRange,

	label: 'OHLC range',
	labelPlural: 'OHLC ranges',

	/**
	 * Series identity: market + window + kind. Payload is in `pointCount` / `rangePayload`
	 * (interpretation by `rangeType`).
	 */
	id: type({
		$market: Market.id,
		timeInterval: type({
			unit: type.valueOf(MarketTimeIntervalUnit),
			value: 'number',
		}),
		rangeType: type.valueOf(MarketPriceRangeType),
	}),

	fields: [
		{
			name: '$$parentMarket',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Market,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Coingecko_Rest,
				Source.Defillama_OpenApi,
				Source.Coinpaprika_OpenApi,
				Source.CoinMarketCap_Rest,
			],
		},
		{
			name: 'pointCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'rangePayload',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
