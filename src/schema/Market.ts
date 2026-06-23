import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { MarketKind } from '$/constants/Market.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'
import { marketAsset } from '$/schema/MarketAsset.ts'
export enum MarketSelector {
	BaseQuoteMarketVenueKind = 'baseQuoteMarketVenueKind',
	BaseQuoteMarketVenueMarketKind = '$base+$quote+$marketVenue+marketKind',
}
export default {
	entityType: EntityType.Market,
	label: 'market',
	labelPlural: 'markets',
	description: 'A tradeable market or quote pair on a venue.',
	selectors: [
		{
			name: MarketSelector.BaseQuoteMarketVenueKind,
			fields: [
				'$base',
				'$quote',
				'$marketVenue',
				'marketKind',
			],
		},
	],
	fields: [
		{
			name: '$base',
			label: 'base',
			type: EntityFieldType.Primitive,
			primitiveType: marketAsset,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$quote',
			label: 'quote',
			type: EntityFieldType.Primitive,
			primitiveType: marketAsset,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$marketVenue',
			label: 'market venue',
			type: EntityFieldType.Primitive,
			primitiveType: type({ marketVenueId: type.valueOf(MarketVenueId) }),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'marketKind',
			label: 'market kind',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(MarketKind),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'venueLabel',
			label: 'venue label',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'providerExchangeIds',
			label: 'provider exchange ids',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$baseCoin',
			label: 'base coin',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Coin,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$marketPrices',
			label: 'market prices',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MarketPrice,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$marketTimeIntervalTimestamps',
			label: 'market time interval timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Market_TimeInterval_Timestamp,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$derivativeTimestamps',
			label: 'derivative timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Market_Derivative_Timestamp,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$oracleFeeds',
			label: 'oracle feeds',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.OracleFeed,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	],
} as const satisfies EntityDefinition
