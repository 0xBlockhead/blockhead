// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import FilecoinDealSchema from '$/schema/FilecoinDeal.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Filecoin']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Filecoin' && matchNonNegativeBigInt(params.dealId)))
		error(404, 'Route mapping not applicable')

	const filecoinDealNetworkDealIdSelector = parseRouteEntitySelector(
		schema,
		FilecoinDealSchema,
		{
			$network: parentData.selector,
			dealId: BigInt(params.dealId),
		},
		'NetworkDealId'
	)
	if (filecoinDealNetworkDealIdSelector instanceof arktype.errors)
		error(404, 'Invalid FilecoinDeal selector')

	return {
		selector: filecoinDealNetworkDealIdSelector,
	}
}
