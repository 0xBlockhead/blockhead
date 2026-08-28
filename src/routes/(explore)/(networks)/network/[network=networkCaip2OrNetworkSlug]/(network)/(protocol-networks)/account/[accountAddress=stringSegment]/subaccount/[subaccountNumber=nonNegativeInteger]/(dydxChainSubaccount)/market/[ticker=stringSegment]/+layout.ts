// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import DydxChainPerpetualPositionSchema from '$/schema/DydxChainPerpetualPosition.ts'
import DydxChainSubaccountSchema from '$/schema/DydxChainSubaccount.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Dydx']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Dydx' && matchStringSegment(params.ticker)))
		error(404, 'Route mapping not applicable')

	const dydxChainSubaccountNetworkAccountSubaccountNumberParentSelector = parseRouteEntitySelector(
		schema,
		DydxChainSubaccountSchema,
		parentData.selector,
		'NetworkAccountSubaccountNumber'
	)
	if (dydxChainSubaccountNetworkAccountSubaccountNumberParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const dydxChainPerpetualPositionSubaccountMarketSelector = parseRouteEntitySelector(
		schema,
		DydxChainPerpetualPositionSchema,
		{
			$subaccount: dydxChainSubaccountNetworkAccountSubaccountNumberParentSelector,
			$market: {
				$network: dydxChainSubaccountNetworkAccountSubaccountNumberParentSelector.$network,
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
