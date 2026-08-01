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
		entityType: EntityType.StellarNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	tradeId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	ledgerCloseTimeMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$baseAccount: {
		entityType: EntityType.StellarAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$counterAccount: {
		entityType: EntityType.StellarAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$baseOffer: {
		entityType: EntityType.StellarOffer,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$counterOffer: {
		entityType: EntityType.StellarOffer,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$baseLiquidityPool: {
		entityType: EntityType.StellarLiquidityPool,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$counterLiquidityPool: {
		entityType: EntityType.StellarLiquidityPool,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$baseAsset: {
		entityType: EntityType.StellarAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$counterAsset: {
		entityType: EntityType.StellarAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	baseAmount: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	counterAmount: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	priceNumerator: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	priceDenominator: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$transaction: {
		entityType: EntityType.StellarTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$operation: {
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
