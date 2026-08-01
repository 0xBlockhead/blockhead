// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LiquidityPool,
	labels: {
		singular: 'liquidity pool',
		plural: 'liquidity pools',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	id: {
		label: 'ID',
		description: 'The identifier assigned by the source domain.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$baseToken: {
		label: 'Base token',
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	$quoteToken: {
		label: 'Quote token',
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	fee: {
		label: 'Fee',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tickSpacing: {
		label: 'Tick spacing',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$hooks: {
		label: 'Hooks',
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	v4PoolId: {
		label: 'v4 pool ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		entityType: EntityType.LiquidityPool_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	$$blocks: {
		label: 'Blocks',
		entityType: EntityType.LiquidityPool_Block,
		cardinality: EntityFieldCardinality.Many,
	},
	$$leverages: {
		label: 'Leverage positions',
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
