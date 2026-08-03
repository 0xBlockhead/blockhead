// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const dexscreenerRestSources = [
	Source.Dexscreener_Rest,
] as const

export default entity({
	entityType: EntityType.LiquidityPool,
	labels: {
		singular: 'liquidity pool',
		plural: 'liquidity pools',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	id: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$baseToken: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: dexscreenerRestSources,
	},
	$quoteToken: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: dexscreenerRestSources,
	},
	fee: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tickSpacing: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$hooks: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	v4PoolId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.LiquidityPool_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: dexscreenerRestSources,
	},
	$$blocks: {
		entityType: EntityType.LiquidityPool_Block,
		cardinality: EntityFieldCardinality.Many,
	},
	$$leverages: {
		entityType: EntityType.Leverage,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		EvmNetworkId: [
			'$network',
			'id',
		],
	},
})
