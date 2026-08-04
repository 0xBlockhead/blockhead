// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { DecimalString } from '$/schema/DecimalString.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.DydxChainPerpetualPosition_Timestamp,
	labels: {
		singular: 'dydx chain perpetual position timestamp',
		plural: 'dydx chain perpetual position observations',
	},
})({
	$subaccount: {
		entityType: EntityType.DydxChainSubaccount,
		cardinality: EntityFieldCardinality.One,
	},
	$market: {
		entityType: EntityType.DydxChainMarket,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	blockHeight: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	side: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	size: {
		primitiveType: DecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	entryPrice: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	unrealizedPnl: {
		primitiveType: DecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	realizedPnl: {
		primitiveType: DecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	netFunding: {
		primitiveType: DecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		SubaccountMarketTimestampMsSource: [
			'$subaccount',
			'$market',
			'timestampMs',
			'source',
		],
	},
})
