// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { MarketPrice as MarketPriceSchema } from '$/schema/MarketPrice.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const marketPriceMarketSelector = parseEntitySelector(
		schema,
		MarketPriceSchema,
		{
			$market: parentData.selector,
		}
	)
	if (marketPriceMarketSelector instanceof arktype.errors) error(404, 'Invalid MarketPrice selector')

	return {
		selector: marketPriceMarketSelector,
	}
}
