import { type } from 'arktype'
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
	entityType: EntityType.Market_Timestamp,

	label: 'Market quote',
	labelPlural: 'Market quotes',

	id: type({
		$market: Market.id,
		timestampMs: 'number',
		'feedKey?': 'string',
	}),

	fields: [
		{
			name: 'price',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Blockscout_Rest,
				Source.Coingecko_Rest,
				Source.Coingecko_OpenApi,
				Source.CoinMarketCap_Rest,
				Source.Coinpaprika_OpenApi,
				Source.Defillama_OpenApi,
				Source.Defillama_Rest,
				Source.TradingView_Rest,
			],
		},
		{
			name: 'transport',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'providerAssetId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string | null'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'marketCap',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'volume24h',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'caip19',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
