// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import LiquidityPool_TimestampSchema from '$/schema/LiquidityPool_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const liquidityPoolTimestampSelector = parseEntitySelector(
		schema,
		LiquidityPool_TimestampSchema,
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
			timestampMs: Number(params.timestampMs),
			feedKey: decodeURIComponent(params.feedKey),
		}
	)
	if (liquidityPoolTimestampSelector instanceof arktype.errors) error(404, 'Invalid LiquidityPool_Timestamp selector')

	return {
		selector: liquidityPoolTimestampSelector,
	}
}
