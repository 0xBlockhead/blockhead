// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HyperliquidPerpMarket_TimestampSelector {
	PerpMarketTimestampMsSource = 'PerpMarketTimestampMsSource',
}
export default {
	entityType: EntityType.HyperliquidPerpMarket_Timestamp,
	label: 'hyperliquid perp market timestamp',
	labelPlural: 'hyperliquid perp market observations',
	selectors: [
		{
			name: HyperliquidPerpMarket_TimestampSelector.PerpMarketTimestampMsSource,
			fields: [
				'$perpMarket',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$perpMarket',
				label: 'perp market',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.HyperliquidPerpMarket,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'maxLeverage',
				label: 'max leverage',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'onlyIsolated',
				label: 'only isolated',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
