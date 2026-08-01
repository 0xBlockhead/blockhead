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
		label: 'account',
		entityType: EntityType.HyperliquidAccount,
		cardinality: EntityFieldCardinality.One,
	},
	tid: {
		label: 'tid',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	oid: {
		label: 'oid',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
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
	direction: {
		label: 'direction',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	price: {
		label: 'price',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	size: {
		label: 'size',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	startPosition: {
		label: 'start position',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	closedPnl: {
		label: 'closed pnl',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fee: {
		label: 'fee',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeToken: {
		label: 'fee token',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timeMs: {
		label: 'time ms',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	hash: {
		label: 'Hash',
		description: 'The hash that identifies this object in its protocol.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	crossed: {
		label: 'crossed',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$order: {
		label: 'order',
		entityType: EntityType.HyperliquidOrder,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$transaction: {
		label: 'transaction',
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
