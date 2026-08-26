// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import DydxChainOrderSchema from '$/schema/DydxChainOrder.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Dydx']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Dydx' && matchStringSegment(params.orderId)))
		error(404, 'Route mapping not applicable')

	const dydxChainOrderSubaccountOrderIdSelector = parseRouteEntitySelector(
		schema,
		DydxChainOrderSchema,
		{
			$subaccount: parentData.selector,
			orderId: params.orderId,
		},
		'SubaccountOrderId'
	)
	if (dydxChainOrderSubaccountOrderIdSelector instanceof arktype.errors)
		error(404, 'Invalid DydxChainOrder selector')

	return {
		selector: dydxChainOrderSubaccountOrderIdSelector,
	}
}
