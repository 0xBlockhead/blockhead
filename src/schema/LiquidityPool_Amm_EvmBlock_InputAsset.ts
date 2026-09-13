// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LiquidityPool_Amm_EvmBlock_InputAsset,
	labels: {
		singular: 'observed pool input asset',
		plural: 'observed pool input assets',
	},
	description: 'An ordinal input-asset slot in one pool observation. Source order is not Uniswap token0/token1 or proof of ERC20 implementation.',
})({
	$observation: {
		entityType: EntityType.LiquidityPool_Amm_EvmBlock,
		cardinality: EntityFieldCardinality.One,
	},
	ordinal: {
		primitiveType: type("number.integer >= 0"),
		cardinality: EntityFieldCardinality.One,
	},
	$tokenContract: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.One,
	},
	rawBalance: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	balanceUSD: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	weightPercent: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		ObservationOrdinal: [
			'$observation',
			'ordinal',
		],
	},
})
