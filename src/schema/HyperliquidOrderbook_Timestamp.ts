// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HyperliquidOrderbook_Timestamp,
	labels: {
		singular: 'hyperliquid orderbook timestamp',
		plural: 'hyperliquid orderbook observations',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	bookKey: {
		label: 'book key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$perpMarket: {
		label: 'perp market',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HyperliquidPerpMarket,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$spotPair: {
		label: 'spot pair',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HyperliquidSpotPair,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bids: {
		label: 'bids',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	asks: {
		label: 'asks',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nSigFigs: {
		label: 'n sig figs',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mantissa: {
		label: 'mantissa',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	depthLimit: {
		label: 'depth limit',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkBookKeyTimestampMsSource: [
			'$network',
			'bookKey',
			'timestampMs',
			'source',
		],
	},
})
