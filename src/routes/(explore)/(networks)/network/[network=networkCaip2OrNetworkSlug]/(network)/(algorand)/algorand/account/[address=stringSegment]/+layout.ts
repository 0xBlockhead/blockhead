// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AlgorandAccountSchema from '$/schema/AlgorandAccount.ts'
import AlgorandNetworkSchema from '$/schema/AlgorandNetwork.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Algorand']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Algorand' && matchStringSegment(params.address)))
		error(404, 'Route mapping not applicable')

	const algorandNetworkNetworkParentSelector = parseRouteEntitySelector(
		schema,
		AlgorandNetworkSchema,
		parentData.selector,
		'Network'
	)
	if (algorandNetworkNetworkParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const algorandAccountNetworkAddressSelector = parseRouteEntitySelector(
		schema,
		AlgorandAccountSchema,
		{
			$network: algorandNetworkNetworkParentSelector,
			address: params.address,
		},
		'NetworkAddress'
	)
	if (algorandAccountNetworkAddressSelector instanceof arktype.errors)
		error(404, 'Invalid AlgorandAccount selector')

	return {
		selector: algorandAccountNetworkAddressSelector,
	}
}
