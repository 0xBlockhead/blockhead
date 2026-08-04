// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.DydxChainOrder_Timestamp,
	labels: {
		singular: 'dydx chain order timestamp',
		plural: 'dydx chain order observations',
	},
})({
	$order: {
		entityType: EntityType.DydxChainOrder,
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
	status: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	price: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	size: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	totalFilled: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		OrderTimestampMsSource: [
			'$order',
			'timestampMs',
			'source',
		],
	},
})
