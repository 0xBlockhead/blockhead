import { type } from 'arktype'
import {
	MarketTimeIntervalUnit,
	marketOhlcCandleSources,
} from '$/constants/Market.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Market from '$/schema/Market.ts'
import { Source } from '$/sources/Source.ts'

export default {
	entityType: EntityType.Market_TimeInterval_Timestamp,

	label: 'OHLC interval',
	labelPlural: 'OHLC intervals',

	id: type({
		$market: Market.id,
		timeInterval: type({
			unit: type.valueOf(MarketTimeIntervalUnit),
			value: 'number',
		}),
		timestampMs: 'number',
		'feedKey?': 'string',
	}),

	fields: [
		{
			name: '$parentMarket',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Market,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
				...marketOhlcCandleSources,
			],
		},
		{
			name: 'open',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [...marketOhlcCandleSources],
		},
		{
			name: 'high',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [...marketOhlcCandleSources],
		},
		{
			name: 'low',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [...marketOhlcCandleSources],
		},
		{
			name: 'close',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [...marketOhlcCandleSources],
		},
		{
			name: 'volume',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'quoteVolume',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Coinpaprika_OpenApi,
				Source.CoinMarketCap_Rest,
			],
		},
		{
			name: 'tradeCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'vwap',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
