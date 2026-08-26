// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNetworkCaip2 } from '$/params/networkCaip2.ts'
import { match as matchNetworkSlug } from '$/params/networkSlug.ts'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import DydxChainSubaccountSchema from '$/schema/DydxChainSubaccount.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Dydx']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		parentData.projectionNetwork.namespace === 'Dydx'
		&& matchNonNegativeInteger(params.subaccountNumber)
		&& matchStringSegment(params.accountAddress)
		&& (matchNetworkCaip2(params.network) || matchNetworkSlug(params.network))
	))
		error(404, 'Route mapping not applicable')

	const dydxChainSubaccountNetworkAccountSubaccountNumberSelector = parseRouteEntitySelector(
		schema,
		DydxChainSubaccountSchema,
		{
			$network: {
				$network: {
					caip2: params.network,
				},
			},
			$account: {
				$network: {
					caip2: params.network,
				},
				address: params.accountAddress,
			},
			subaccountNumber: Number(params.subaccountNumber),
		},
		'NetworkAccountSubaccountNumber'
	)
	if (dydxChainSubaccountNetworkAccountSubaccountNumberSelector instanceof arktype.errors)
		error(404, 'Invalid DydxChainSubaccount selector')

	return {
		selector: dydxChainSubaccountNetworkAccountSubaccountNumberSelector,
	}
}
