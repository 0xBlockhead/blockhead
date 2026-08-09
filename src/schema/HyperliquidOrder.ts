// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HyperliquidOrder,
	labels: {
		singular: 'hyperliquid order',
		plural: 'hyperliquid orders',
	},
})({
	$account: {
		entityType: EntityType.HyperliquidAccount,
		cardinality: EntityFieldCardinality.One,
	},
	oid: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	cloid: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	coin: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	side: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	orderType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	limitPrice: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	originalSize: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	triggerCondition: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	triggerPrice: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	reduceOnly: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tif: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isTrigger: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isPositionTpsl: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.HyperliquidOrder_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		AccountOid: [
			'$account',
			'oid',
		],
		AccountCloid: [
			'$account',
			'cloid',
		],
	},
})
