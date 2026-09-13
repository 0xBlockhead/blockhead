// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LiquidityPool_Amm_EvmBlock,
	labels: {
		singular: 'AMM pool observation',
		plural: 'AMM pool observations',
	},
	description: 'Pool measurements at one verified EVM block and immutable source interpretation. Retrieval clocks do not define the observation.',
})({
	$pool: {
		entityType: EntityType.LiquidityPool,
		cardinality: EntityFieldCardinality.One,
	},
	$block: {
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.One,
	},
	sourceRevision: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	totalValueLockedUSD: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	cumulativeVolumeUSD: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	cumulativeSupplySideRevenueUSD: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	cumulativeProtocolSideRevenueUSD: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	cumulativeTotalRevenueUSD: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$inputAssets: {
		entityType: EntityType.LiquidityPool_Amm_EvmBlock_InputAsset,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		PoolBlockRevision: [
			'$pool',
			'$block',
			'sourceRevision',
		],
	},
})
