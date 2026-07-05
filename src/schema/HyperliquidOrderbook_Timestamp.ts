// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HyperliquidOrderbook_TimestampSelector {
	NetworkBookKeyTimestampMsSource = 'NetworkBookKeyTimestampMsSource',
}
export default {
	entityType: EntityType.HyperliquidOrderbook_Timestamp,
	label: 'hyperliquid orderbook timestamp',
	labelPlural: 'hyperliquid orderbook observations',
	selectors: [
		{
			name: HyperliquidOrderbook_TimestampSelector.NetworkBookKeyTimestampMsSource,
			fields: [
				'$network',
				'bookKey',
				'timestampMs',
				'source',
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
				name: 'bookKey',
				label: 'book key',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
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
				name: '$perpMarket',
				label: 'perp market',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.HyperliquidPerpMarket,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$spotPair',
				label: 'spot pair',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.HyperliquidSpotPair,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'bids',
				label: 'bids',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'asks',
				label: 'asks',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'nSigFigs',
				label: 'n sig figs',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'mantissa',
				label: 'mantissa',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'depthLimit',
				label: 'depth limit',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
