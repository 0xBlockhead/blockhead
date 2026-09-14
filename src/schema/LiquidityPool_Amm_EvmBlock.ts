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
	totalLiquidityUSD: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	activeLiquidityUSD: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	uncollectedProtocolSideValuesUSD: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	uncollectedSupplySideValuesUSD: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
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
	stakedOutputTokenAmount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rewardTokenEmissionsAmount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.Many,
	},
	rewardTokenEmissionsUSD: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	cumulativeDepositCount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	cumulativeWithdrawCount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	cumulativeSwapCount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	positionCount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	openPositionCount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	closedPositionCount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	lastSnapshotDayID: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	lastSnapshotHourID: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	lastUpdateTimestamp: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	lastUpdateBlockNumber: {
		primitiveType: type('bigint'),
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
