// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import LiquidityPoolSchema from '$/schema/LiquidityPool.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const liquidityPoolSelector = parseEntitySelector(
		schema,
		LiquidityPoolSchema,
		{
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: params.chainId,
				},
			},
			id: decodeURIComponent(params.poolId),
		}
	)
	if (liquidityPoolSelector instanceof arktype.errors) error(404, 'Invalid LiquidityPool selector')

	return {
		selector: liquidityPoolSelector,
	}
}
