// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import TronContractSchema from '$/schema/TronContract.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Tron']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Tron' && matchStringSegment(params.address)))
		error(404, 'Route mapping not applicable')

	const tronContractNetworkAddressSelector = parseRouteEntitySelector(
		schema,
		TronContractSchema,
		{
			$network: parentData.selector,
			address: params.address,
		},
		'NetworkAddress'
	)
	if (tronContractNetworkAddressSelector instanceof arktype.errors)
		error(404, 'Invalid TronContract selector')

	return {
		selector: tronContractNetworkAddressSelector,
	}
}
