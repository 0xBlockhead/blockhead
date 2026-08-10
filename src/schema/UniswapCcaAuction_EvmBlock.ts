// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.UniswapCcaAuction_EvmBlock,
	labels: {
		singular: 'Uniswap CCA auction block',
		plural: 'Uniswap CCA auction blocks',
	},
	description: 'A checkpointed Uniswap CCA state observation at an exact EVM block.',
})({
	$auction: {
		entityType: EntityType.UniswapCcaAuction,
		cardinality: EntityFieldCardinality.One,
	},
	blockNumber: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	$block: {
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.One,
	},
	clearingPriceQ96: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	currencyRaisedAtClearingPriceQ96X7: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	cumulativeMpsPerPrice: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	cumulativeMps: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$previousCheckpoint: {
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$nextCheckpoint: {
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	currencyRaised: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	totalCleared: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	isGraduated: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	schedulePhase: {
		primitiveType: type.enumerated('BeforeStart', 'BiddingWindow', 'AfterBiddingBeforeClaim', 'ClaimWindow'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		AuctionBlockNumber: [
			'$auction',
			'blockNumber',
		],
	},
})
