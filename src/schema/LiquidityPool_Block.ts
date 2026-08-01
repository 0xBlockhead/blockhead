// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.LiquidityPool,
		cardinality: EntityFieldCardinality.One,
	},
	blockNumber: {
		label: 'Block number',
		description: 'The block height or number in its network.',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	$parentLiquidityPool: {
		label: 'Parent liquidity pool',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.LiquidityPool,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	sqrtPriceX96: {
		label: 'Sqrt price X96',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	liquidity: {
		label: 'Liquidity',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tick: {
		label: 'Tick',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	observationIndex: {
		label: 'Observation index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	observationCardinality: {
		label: 'Observation cardinality',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	observationCardinalityNext: {
		label: 'Observation cardinality next',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeProtocol: {
		label: 'Fee protocol',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	unlocked: {
		label: 'Unlocked',
		type: EntityFieldType.Primitive,
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
