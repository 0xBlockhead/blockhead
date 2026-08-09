// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HyperliquidFill,
	labels: {
		singular: 'hyperliquid fill',
		plural: 'hyperliquid fills',
	},
})({
	$account: {
		entityType: EntityType.HyperliquidAccount,
		cardinality: EntityFieldCardinality.One,
	},
	tid: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	oid: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	coin: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	side: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	direction: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	price: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	size: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	startPosition: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	closedPnl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fee: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeToken: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timeMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	hash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	crossed: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$order: {
		entityType: EntityType.HyperliquidOrder,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$transaction: {
		entityType: EntityType.HyperliquidTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AccountTid: [
			'$account',
			'tid',
		],
	},
})
