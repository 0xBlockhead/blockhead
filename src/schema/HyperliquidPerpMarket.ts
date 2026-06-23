import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum HyperliquidPerpMarketSelector {
	NetworkCoin = 'networkCoin',
}
export default {
	entityType: EntityType.HyperliquidPerpMarket,
	label: 'hyperliquid perp market',
	labelPlural: 'hyperliquid perp markets',
	selectors: [
		{
			name: HyperliquidPerpMarketSelector.NetworkCoin,
			fields: [
				'$network',
				'coin',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'coin',
			label: 'coin',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HyperliquidPerpMarket_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
