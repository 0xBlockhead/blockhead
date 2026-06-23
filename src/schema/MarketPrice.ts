import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum MarketPriceSelector {
	Market = 'market',
}
export default {
	entityType: EntityType.MarketPrice,
	label: 'market price',
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
			label: 'market',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Market,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$parentMarket',
			label: 'parent market',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Market,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$quotes',
			label: 'quotes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Market_Timestamp,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	],
} as const satisfies EntityDefinition
