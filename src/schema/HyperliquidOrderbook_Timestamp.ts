// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	bookKey: {
		label: 'book key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$perpMarket: {
		label: 'perp market',
		entityType: EntityType.HyperliquidPerpMarket,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$spotPair: {
		label: 'spot pair',
		entityType: EntityType.HyperliquidSpotPair,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bids: {
		label: 'bids',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	asks: {
		label: 'asks',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nSigFigs: {
		label: 'n sig figs',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mantissa: {
		label: 'mantissa',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	depthLimit: {
		label: 'depth limit',
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
