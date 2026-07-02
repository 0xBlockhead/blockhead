// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import MarketPriceSchema from '$/schema/MarketPrice.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const marketPriceSelector = parseEntitySelector(
		schema,
		MarketPriceSchema,
		{
			$market: {
				$base: (
				params.baseKind === 'coin' ?
					{
						kind: 'Coin',
						$coin: {
							coinId: decodeURIComponent(params.base),
						},
					}
				:
					{
						kind: 'Currency',
						$currency: {
							iso4217: decodeURIComponent(params.base),
						},
					}
				),
				$quote: (
				params.quoteKind === 'coin' ?
					{
						kind: 'Coin',
						$coin: {
							coinId: decodeURIComponent(params.quote),
						},
					}
				:
					{
						kind: 'Currency',
						$currency: {
							iso4217: decodeURIComponent(params.quote),
						},
					}
				),
				$marketVenue: {
					marketVenueId: decodeURIComponent(params.marketVenue),
				},
				marketKind: decodeURIComponent(params.marketKind),
			},
		}
	)
	if (marketPriceSelector instanceof arktype.errors) error(404, 'Invalid MarketPrice selector')

	return {
		selector: marketPriceSelector,
	}
}
