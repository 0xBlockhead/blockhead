// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import LiquidityPool_BlockSchema from '$/schema/LiquidityPool_Block.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const liquidityPoolBlockSelector = parseEntitySelector(
		schema,
		LiquidityPool_BlockSchema,
		{
			$liquidityPool: {
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: params.chainId,
					},
				},
				id: decodeURIComponent(params.poolId),
			},
			blockNumber: BigInt(params.blockNumber),
		}
	)
	if (liquidityPoolBlockSelector instanceof arktype.errors) error(404, 'Invalid LiquidityPool_Block selector')

	return {
		selector: liquidityPoolBlockSelector,
	}
}
