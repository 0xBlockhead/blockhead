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
		label: 'account',
		entityType: EntityType.HyperliquidAccount,
		cardinality: EntityFieldCardinality.One,
	},
	oid: {
		label: 'oid',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	cloid: {
		label: 'cloid',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	coin: {
		label: 'coin',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
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
	limitPrice: {
		label: 'limit price',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	originalSize: {
		label: 'original size',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	triggerCondition: {
		label: 'trigger condition',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	triggerPrice: {
		label: 'trigger price',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	reduceOnly: {
		label: 'reduce only',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tif: {
		label: 'tif',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isTrigger: {
		label: 'is trigger',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isPositionTpsl: {
		label: 'is position tpsl',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
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
