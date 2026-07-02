// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import LiquidityPosition_BlockSchema from '$/schema/LiquidityPosition_Block.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const liquidityPositionBlockSelector = parseEntitySelector(
		schema,
		LiquidityPosition_BlockSchema,
		{
			$position: {
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				id: decodeURIComponent(params.positionId),
			},
			blockNumber: BigInt(params.blockNumber),
			source: decodeURIComponent(params.source),
		}
	)
	if (liquidityPositionBlockSelector instanceof arktype.errors) error(404, 'Invalid LiquidityPosition_Block selector')

	return {
		selector: liquidityPositionBlockSelector,
	}
}
