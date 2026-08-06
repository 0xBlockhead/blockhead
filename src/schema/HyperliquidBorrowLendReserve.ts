// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HyperliquidBorrowLendReserve,
	labels: {
		singular: 'hyperliquid borrow lend reserve',
		plural: 'hyperliquid borrow lend reserves',
	},
	description: 'A Hyperliquid borrow/lend reserve keyed by spot token index — rates, balances, and utilization from allBorrowLendReserveStates.',
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	tokenIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$asset: {
		entityType: EntityType.HyperliquidSpotAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	borrowYearlyRate: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	supplyYearlyRate: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	balance: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	utilization: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	oraclePx: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	ltv: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	totalSupplied: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	totalBorrowed: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
})({
	selectors: {
		NetworkTokenIndex: [
			'$network',
			'tokenIndex',
		],
	},
})
