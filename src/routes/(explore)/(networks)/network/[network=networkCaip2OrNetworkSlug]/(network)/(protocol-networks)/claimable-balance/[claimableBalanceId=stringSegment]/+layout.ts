// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import StellarClaimableBalanceSchema from '$/schema/StellarClaimableBalance.ts'
import StellarNetworkSchema from '$/schema/StellarNetwork.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Stellar']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Stellar' && matchStringSegment(params.claimableBalanceId)))
		error(404, 'Route mapping not applicable')

	const stellarNetworkNetworkParentSelector = parseRouteEntitySelector(
		schema,
		StellarNetworkSchema,
		parentData.selector,
		'Network'
	)
	if (stellarNetworkNetworkParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const stellarClaimableBalanceNetworkClaimableBalanceIdSelector = parseRouteEntitySelector(
		schema,
		StellarClaimableBalanceSchema,
		{
			$network: stellarNetworkNetworkParentSelector,
			claimableBalanceId: params.claimableBalanceId,
		},
		'NetworkClaimableBalanceId'
	)
	if (stellarClaimableBalanceNetworkClaimableBalanceIdSelector instanceof arktype.errors)
		error(404, 'Invalid StellarClaimableBalance selector')

	return {
		selector: stellarClaimableBalanceNetworkClaimableBalanceIdSelector,
	}
}
