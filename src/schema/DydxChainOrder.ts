// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.DydxChainOrder,
	labels: {
		singular: 'dydx chain order',
		plural: 'dydx chain orders',
	},
})({
	$subaccount: {
		label: 'subaccount',
		entityType: EntityType.DydxChainSubaccount,
		cardinality: EntityFieldCardinality.One,
	},
	orderId: {
		label: 'order ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$market: {
		label: 'market',
		entityType: EntityType.DydxChainMarket,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	side: {
		label: 'side',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	orderType: {
		label: 'order type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timeInForce: {
		label: 'time in force',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	clientId: {
		label: 'client ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	goodTilBlock: {
		label: 'good til block',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	goodTilBlockTimeMs: {
		label: 'good til block time ms',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.DydxChainOrder_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		SubaccountOrderId: [
			'$subaccount',
			'orderId',
		],
	},
})
