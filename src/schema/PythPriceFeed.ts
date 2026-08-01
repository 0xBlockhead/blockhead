// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.PythPriceFeed,
	labels: {
		singular: 'Pyth price feed',
		plural: 'Pyth price feeds',
	},
})({
	priceFeedId: {
		label: 'Price feed ID',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	channel: {
		label: 'Channel',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	symbol: {
		label: 'Symbol',
		description: 'The short ticker or symbol used for display.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	assetClass: {
		label: 'Asset class',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	baseAsset: {
		label: 'Base asset',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	quoteAsset: {
		label: 'Quote asset',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$market: {
		label: 'Market',
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Timestamps',
		entityType: EntityType.PythPriceFeed_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		PriceFeedIdChannel: [
			'priceFeedId',
			'channel',
		],
	},
})
