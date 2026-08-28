// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import StarknetContractSchema from '$/schema/StarknetContract.ts'
import StarknetTokenHoldingSchema from '$/schema/StarknetTokenHolding.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Starknet']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Starknet' && matchStringSegment(params.tokenAddress)))
		error(404, 'Route mapping not applicable')

	const starknetContractNetworkAddressParentSelector = parseRouteEntitySelector(
		schema,
		StarknetContractSchema,
		parentData.selector,
		'NetworkAddress'
	)
	if (starknetContractNetworkAddressParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const starknetTokenHoldingOwnerTokenContractSelector = parseRouteEntitySelector(
		schema,
		StarknetTokenHoldingSchema,
		{
			$owner: starknetContractNetworkAddressParentSelector,
			$tokenContract: {
				$network: starknetContractNetworkAddressParentSelector.$network,
				address: params.tokenAddress,
			},
		},
		'OwnerTokenContract'
	)
	if (starknetTokenHoldingOwnerTokenContractSelector instanceof arktype.errors)
		error(404, 'Invalid StarknetTokenHolding selector')

	return {
		selector: starknetTokenHoldingOwnerTokenContractSelector,
	}
}
