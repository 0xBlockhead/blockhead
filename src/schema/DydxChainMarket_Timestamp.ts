// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { DecimalString } from '$/schema/DecimalString.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.DydxChainMarket_Timestamp,
	labels: {
		singular: 'dydx chain market timestamp',
		plural: 'dydx chain market observations',
	},
})({
	$market: {
		entityType: EntityType.DydxChainMarket,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
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
})({
	selectors: {
		MarketTimestampMsSource: [
			'$market',
			'timestampMs',
			'source',
		],
	},
})
