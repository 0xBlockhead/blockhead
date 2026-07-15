// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchMarketVenueId } from '$/params/marketVenueId.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { Market as MarketSchema } from '$/schema/Market.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.marketKind) && matchMarketVenueId(params.marketVenue) && matchStringSegment(params.baseKind) && matchStringSegment(params.base) && matchStringSegment(params.quoteKind) && matchStringSegment(params.quote))) error(404, 'Route mapping not applicable')

	const marketBaseQuoteMarketVenueKindSelector = parseEntitySelector(
		schema,
		MarketSchema,
		{
			$base: {
				kind: (
				params.baseKind === 'coin' ?
					'Coin'
				:
				params.baseKind === 'coin-instance' ?
					'CoinInstance'
				:
					'Currency'
				),
				assetKey: decodeURIComponent(params.base),
			},
			$quote: {
				kind: (
				params.quoteKind === 'coin' ?
					'Coin'
				:
				params.quoteKind === 'coin-instance' ?
					'CoinInstance'
				:
					'Currency'
				),
				assetKey: decodeURIComponent(params.quote),
			},
			$marketVenue: {
				marketVenueId: decodeURIComponent(params.marketVenue),
			},
			marketKind: params.marketKind,
		}
	)
	if (marketBaseQuoteMarketVenueKindSelector instanceof arktype.errors) error(404, 'Invalid Market selector')

	return {
		selector: marketBaseQuoteMarketVenueKindSelector,
	}
}
