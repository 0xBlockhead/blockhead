// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LiquidityPoolFeeSchedule,
	labels: {
		singular: 'liquidity pool fee schedule',
		plural: 'liquidity pool fee schedules',
	},
	description: 'A fee schedule entry for one liquidity pool and one standardized Messari fee type.',
})({
	$pool: {
		entityType: EntityType.LiquidityPool,
		cardinality: EntityFieldCardinality.One,
	},
	feeType: {
		primitiveType: type.enumerated('FIXED_TRADING_FEE', 'TIERED_TRADING_FEE', 'DYNAMIC_TRADING_FEE', 'FIXED_LP_FEE', 'DYNAMIC_LP_FEE', 'FIXED_PROTOCOL_FEE', 'DYNAMIC_PROTOCOL_FEE', 'FIXED_STAKE_FEE', 'DYNAMIC_STAKE_FEE', 'DEPOSIT_FEE', 'WITHDRAWAL_FEE', 'DYNAMIC_TAKER_FEE', 'DYNAMIC_TAKER_DELAYED_FEE', 'DYNAMIC_TAKER_DELAYED_OFFCHAIN_FEE', 'DYNAMIC_MAKER_FEE', 'DYNAMIC_MAKER_DELAYED_FEE', 'DYNAMIC_MAKER_DELAYED_OFFCHAIN_FEE'),
		cardinality: EntityFieldCardinality.One,
	},
	feePercentage: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$observations: {
		entityType: EntityType.LiquidityPoolFeeSchedule_EvmBlock,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.TheGraph_Graphql,
		],
	},
})({
	selectors: {
		PoolFeeType: [
			'$pool',
			'feeType',
		],
	},
})
