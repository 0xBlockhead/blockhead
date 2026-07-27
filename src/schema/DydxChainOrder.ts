// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.DydxChainSubaccount,
		cardinality: EntityFieldCardinality.One,
	},
	orderId: {
		label: 'order ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$market: {
		label: 'market',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.DydxChainMarket,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	side: {
		label: 'side',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	orderType: {
		label: 'order type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timeInForce: {
		label: 'time in force',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	clientId: {
		label: 'client ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	goodTilBlock: {
		label: 'good til block',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	goodTilBlockTimeMs: {
		label: 'good til block time ms',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
