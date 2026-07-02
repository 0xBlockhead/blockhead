// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import LiquidityPositionSchema from '$/schema/LiquidityPosition.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const liquidityPositionSelector = parseEntitySelector(
		schema,
		LiquidityPositionSchema,
		{
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: '1',
				},
			},
			id: decodeURIComponent(params.positionId),
		}
	)
	if (liquidityPositionSelector instanceof arktype.errors) error(404, 'Invalid LiquidityPosition selector')

	return {
		selector: liquidityPositionSelector,
	}
}
