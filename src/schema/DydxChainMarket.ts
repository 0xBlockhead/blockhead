// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { DecimalString } from '$/schema/DecimalString.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.DydxChainMarket,
	labels: {
		singular: 'dydx chain market',
		plural: 'dydx chain markets',
	},
})({
	$network: {
		entityType: EntityType.DydxChainNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	ticker: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	baseAsset: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	quoteAsset: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	marketKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	fundingRate: {
		primitiveType: DecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	oraclePrice: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	openInterest: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
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
