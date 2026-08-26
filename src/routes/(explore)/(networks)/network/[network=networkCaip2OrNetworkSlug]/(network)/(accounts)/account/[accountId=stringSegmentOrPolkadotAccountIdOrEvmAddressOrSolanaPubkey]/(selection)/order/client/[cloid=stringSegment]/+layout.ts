// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import HyperliquidOrderSchema from '$/schema/HyperliquidOrder.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.cloid)))
		error(404, 'Route mapping not applicable')

	const hyperliquidOrderAccountCloidSelector = parseRouteEntitySelector(
		schema,
		HyperliquidOrderSchema,
		{
			$account: parentData.selector,
			cloid: params.cloid,
		},
		'AccountCloid'
	)
	if (hyperliquidOrderAccountCloidSelector instanceof arktype.errors)
		error(404, 'Invalid HyperliquidOrder selector')

	return {
		selector: hyperliquidOrderAccountCloidSelector,
	}
}
