// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.OsmosisPool,
	labels: {
		singular: 'Osmosis pool',
		plural: 'Osmosis pools',
	},
	description: 'An Osmosis poolmanager pool (balancer, stableswap, concentrated liquidity, or cosmwasm), identified by numeric pool id on cosmos:osmosis-1.',
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	poolId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	typeUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	liquidityKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Osmosis_LCD_Rest,
		],
	},
	address: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	swapFee: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	exitFee: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	totalWeight: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	totalSharesAmount: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	totalSharesDenom: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	token0Denom: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	token1Denom: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	currentSqrtPrice: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	currentTick: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	currentTickLiquidity: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tickSpacing: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	exponentAtPriceOne: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	spreadFactor: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastLiquidityUpdate: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Osmosis_LCD_Rest,
		],
	},
	positionCount: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Osmosis_LCD_Rest,
		],
	},
	$$assets: {
		entityType: EntityType.OsmosisPoolAsset,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Osmosis_LCD_Rest,
		],
	},
	$$timestamps: {
		entityType: EntityType.OsmosisPool_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Osmosis_LCD_Rest,
		],
	},
})({
	selectors: {
		NetworkPoolId: [
			'$network',
			'poolId',
		],
	},
})
