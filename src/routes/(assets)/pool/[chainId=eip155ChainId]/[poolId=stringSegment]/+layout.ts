// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEip155ChainId } from '$/params/eip155ChainId.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import LiquidityPoolSchema from '$/schema/LiquidityPool.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.poolId) && matchEip155ChainId(params.chainId)))
		error(404, 'Route mapping not applicable')

	const liquidityPoolEvmNetworkIdSelector = parseRouteEntitySelector(
		schema,
		LiquidityPoolSchema,
		{
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: params.chainId,
				},
			},
			id: params.poolId,
		},
		'EvmNetworkId'
	)
	if (liquidityPoolEvmNetworkIdSelector instanceof arktype.errors)
		error(404, 'Invalid LiquidityPool selector')

	return {
		selector: liquidityPoolEvmNetworkIdSelector,
	}
}
