// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import DydxChainPerpetualPositionSchema from '$/schema/DydxChainPerpetualPosition.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Dydx']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Dydx' && matchStringSegment(params.ticker)))
		error(404, 'Route mapping not applicable')

	const dydxChainPerpetualPositionSubaccountMarketSelector = parseRouteEntitySelector(
		schema,
		DydxChainPerpetualPositionSchema,
		{
			$subaccount: parentData.selector,
			$market: {
				$network: parentData.selector.$network,
				ticker: params.ticker,
			},
		},
		'SubaccountMarket'
	)
	if (dydxChainPerpetualPositionSubaccountMarketSelector instanceof arktype.errors)
		error(404, 'Invalid DydxChainPerpetualPosition selector')

	return {
		selector: dydxChainPerpetualPositionSubaccountMarketSelector,
	}
}
