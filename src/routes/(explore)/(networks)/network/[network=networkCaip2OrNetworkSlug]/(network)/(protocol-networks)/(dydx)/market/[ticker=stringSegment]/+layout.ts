// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import DydxChainMarketSchema from '$/schema/DydxChainMarket.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Dydx']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Dydx' && matchStringSegment(params.ticker)))
		error(404, 'Route mapping not applicable')

	const dydxChainMarketNetworkTickerSelector = parseEntitySelector(
		schema,
		DydxChainMarketSchema,
		{
			$network: parentData.selector,
			ticker: params.ticker,
		},
		'NetworkTicker'
	)
	if (dydxChainMarketNetworkTickerSelector instanceof arktype.errors)
		error(404, 'Invalid DydxChainMarket selector')

	return {
		selector: dydxChainMarketNetworkTickerSelector,
	}
}
