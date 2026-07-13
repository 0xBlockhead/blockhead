// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum StellarTradeSelector {
	NetworkTradeIdSource = 'NetworkTradeIdSource',
}
export const StellarTrade = entity({
	entityType: EntityType.StellarTrade,
	labels: {
		singular: 'stellar trade',
		plural: 'stellar trades',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	tradeId: {
		label: 'trade ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	ledgerCloseTimeMs: {
		label: 'ledger close time ms',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$baseAccount: {
		label: 'base account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$counterAccount: {
		label: 'counter account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$baseOffer: {
		label: 'base offer',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarOffer,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$counterOffer: {
		label: 'counter offer',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarOffer,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$baseLiquidityPool: {
		label: 'base liquidity pool',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarLiquidityPool,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$counterLiquidityPool: {
		label: 'counter liquidity pool',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarLiquidityPool,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$baseAsset: {
		label: 'base asset',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$counterAsset: {
		label: 'counter asset',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	baseAmount: {
		label: 'base amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	counterAmount: {
		label: 'counter amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	priceNumerator: {
		label: 'price numerator',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	priceDenominator: {
		label: 'price denominator',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$transaction: {
		label: 'transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$operation: {
		label: 'operation',
		type: EntityFieldType.EntityReference,
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
