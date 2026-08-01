// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.DydxChainMarket,
	labels: {
		singular: 'dydx chain market',
		plural: 'dydx chain markets',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.DydxChainNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	ticker: {
		label: 'ticker',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	baseAsset: {
		label: 'base asset',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	quoteAsset: {
		label: 'quote asset',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	marketKind: {
		label: 'market kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.DydxChainMarket_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkTicker: [
			'$network',
			'ticker',
		],
	},
})
