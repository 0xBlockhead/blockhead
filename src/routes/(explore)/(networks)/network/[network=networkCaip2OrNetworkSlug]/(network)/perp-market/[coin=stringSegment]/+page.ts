// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import HyperliquidPerpMarketSchema from '$/schema/HyperliquidPerpMarket.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Hyperliquid']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Hyperliquid' && matchStringSegment(params.coin)))
		error(404, 'Route mapping not applicable')

	const hyperliquidPerpMarketNetworkCoinSelector = parseEntitySelector(
		schema,
		HyperliquidPerpMarketSchema,
		{
			$network: parentData.selector,
			coin: params.coin,
		},
		'NetworkCoin'
	)
	if (hyperliquidPerpMarketNetworkCoinSelector instanceof arktype.errors)
		error(404, 'Invalid HyperliquidPerpMarket selector')

	return {
		selector: hyperliquidPerpMarketNetworkCoinSelector,
	}
}
