// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import LiquidityPoolSchema from '$/schema/LiquidityPool.ts'
import LiquidityPoolFeeScheduleSchema from '$/schema/LiquidityPoolFeeSchedule.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.feeType)))
		error(404, 'Route mapping not applicable')

	const liquidityPoolEvmNetworkIdParentSelector = parseRouteEntitySelector(
		schema,
		LiquidityPoolSchema,
		parentData.selector,
		'EvmNetworkId'
	)
	if (liquidityPoolEvmNetworkIdParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const liquidityPoolFeeSchedulePoolFeeTypeSelector = parseRouteEntitySelector(
		schema,
		LiquidityPoolFeeScheduleSchema,
		{
			$pool: liquidityPoolEvmNetworkIdParentSelector,
			feeType: params.feeType,
		},
		'PoolFeeType'
	)
	if (liquidityPoolFeeSchedulePoolFeeTypeSelector instanceof arktype.errors)
		error(404, 'Invalid LiquidityPoolFeeSchedule selector')

	return {
		selector: liquidityPoolFeeSchedulePoolFeeTypeSelector,
	}
}
