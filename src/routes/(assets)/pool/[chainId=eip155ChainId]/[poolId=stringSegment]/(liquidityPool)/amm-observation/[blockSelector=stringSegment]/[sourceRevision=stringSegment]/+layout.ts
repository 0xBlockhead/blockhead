// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import LiquidityPool_Amm_EvmBlockSchema from '$/schema/LiquidityPool_Amm_EvmBlock.ts'
import LiquidityPoolSchema from '$/schema/LiquidityPool.ts'
import { type as arktype } from 'arktype'
import { parse } from 'devalue'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.blockSelector) && matchStringSegment(params.sourceRevision)))
		error(404, 'Route mapping not applicable')

	const liquidityPoolEvmNetworkIdParentSelector = parseRouteEntitySelector(
		schema,
		LiquidityPoolSchema,
		parentData.selector,
		'EvmNetworkId'
	)
	if (liquidityPoolEvmNetworkIdParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const liquidityPoolAmmEvmBlockPoolBlockRevisionSelector = parseRouteEntitySelector(
		schema,
		LiquidityPool_Amm_EvmBlockSchema,
		{
			$pool: liquidityPoolEvmNetworkIdParentSelector,
			$block: parse(params.blockSelector),
			sourceRevision: params.sourceRevision,
		},
		'PoolBlockRevision'
	)
	if (liquidityPoolAmmEvmBlockPoolBlockRevisionSelector instanceof arktype.errors)
		error(404, 'Invalid LiquidityPool_Amm_EvmBlock selector')

	return {
		selector: liquidityPoolAmmEvmBlockPoolBlockRevisionSelector,
	}
}
