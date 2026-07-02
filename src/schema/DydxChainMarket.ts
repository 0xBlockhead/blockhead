import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { MarketKind } from '$/constants/Market.ts'
export enum DydxChainMarketSelector {
	NetworkTicker = '$network+ticker',
}
export default {
	entityType: EntityType.DydxChainMarket,
	label: 'dydx chain market',
	labelPlural: 'dydx chain markets',
	selectors: [
		{
			name: DydxChainMarketSelector.NetworkTicker,
			fields: [
				'$network',
				'ticker',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.DydxChainNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'ticker',
			label: 'ticker',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'baseAsset',
			label: 'base asset',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'quoteAsset',
			label: 'quote asset',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'marketKind',
			label: 'market kind',
			type: EntityFieldType.Primitive,
			primitiveType: type.enumerated(...Object.values(MarketKind)),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.DydxChainMarket_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
