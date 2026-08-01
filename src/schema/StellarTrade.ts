// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.StellarTrade,
	labels: {
		singular: 'stellar trade',
		plural: 'stellar trades',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.StellarNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	tradeId: {
		label: 'trade ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	ledgerCloseTimeMs: {
		label: 'ledger close time ms',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$baseAccount: {
		label: 'base account',
		entityType: EntityType.StellarAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$counterAccount: {
		label: 'counter account',
		entityType: EntityType.StellarAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$baseOffer: {
		label: 'base offer',
		entityType: EntityType.StellarOffer,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$counterOffer: {
		label: 'counter offer',
		entityType: EntityType.StellarOffer,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$baseLiquidityPool: {
		label: 'base liquidity pool',
		entityType: EntityType.StellarLiquidityPool,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$counterLiquidityPool: {
		label: 'counter liquidity pool',
		entityType: EntityType.StellarLiquidityPool,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$baseAsset: {
		label: 'base asset',
		entityType: EntityType.StellarAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$counterAsset: {
		label: 'counter asset',
		entityType: EntityType.StellarAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	baseAmount: {
		label: 'base amount',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	counterAmount: {
		label: 'counter amount',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	priceNumerator: {
		label: 'price numerator',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	priceDenominator: {
		label: 'price denominator',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$transaction: {
		label: 'transaction',
		entityType: EntityType.StellarTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$operation: {
		label: 'operation',
		entityType: EntityType.StellarOperation,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkTradeIdSource: [
			'$network',
			'tradeId',
			'source',
		],
	},
})
