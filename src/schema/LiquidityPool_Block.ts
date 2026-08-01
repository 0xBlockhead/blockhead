// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LiquidityPool_Block,
	labels: {
		singular: 'liquidity pool block',
		plural: 'liquidity pool blocks',
	},
})({
	$liquidityPool: {
		label: 'Liquidity pool',
		entityType: EntityType.LiquidityPool,
		cardinality: EntityFieldCardinality.One,
	},
	blockNumber: {
		label: 'Block number',
		description: 'The block height or number in its network.',
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	$parentLiquidityPool: {
		label: 'Parent liquidity pool',
		entityType: EntityType.LiquidityPool,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	sqrtPriceX96: {
		label: 'Sqrt price X96',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	liquidity: {
		label: 'Liquidity',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tick: {
		label: 'Tick',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	observationIndex: {
		label: 'Observation index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	observationCardinality: {
		label: 'Observation cardinality',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	observationCardinalityNext: {
		label: 'Observation cardinality next',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeProtocol: {
		label: 'Fee protocol',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	unlocked: {
		label: 'Unlocked',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		LiquidityPoolBlockNumber: [
			'$liquidityPool',
			'blockNumber',
		],
	},
})
