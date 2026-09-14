// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LiquidityPoolFeeSchedule_EvmBlock,
	labels: {
		singular: 'liquidity pool fee schedule block observation',
		plural: 'liquidity pool fee schedule block observations',
	},
	description: 'A fee schedule observation at an immutable EVM block and source interpretation revision.',
})({
	$feeSchedule: {
		entityType: EntityType.LiquidityPoolFeeSchedule,
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
	feePercentage: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ScheduleBlockRevision: [
			'$feeSchedule',
			'$block',
			'sourceRevision',
		],
	},
})
