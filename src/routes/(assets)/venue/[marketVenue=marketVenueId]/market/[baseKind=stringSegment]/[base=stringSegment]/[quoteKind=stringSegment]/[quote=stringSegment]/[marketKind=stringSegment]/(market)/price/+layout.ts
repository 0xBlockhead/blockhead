// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import MarketPriceSchema from '$/schema/MarketPrice.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const marketPriceMarketSelector = parseRouteEntitySelector(
		schema,
		MarketPriceSchema,
		{
			$market: parentData.selector,
		},
		'Market'
	)
	if (marketPriceMarketSelector instanceof arktype.errors)
		error(404, 'Invalid MarketPrice selector')

	return {
		selector: marketPriceMarketSelector,
	}
}
