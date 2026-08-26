// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SorobanContractSchema from '$/schema/SorobanContract.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Stellar']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Stellar' && matchStringSegment(params.contractId)))
		error(404, 'Route mapping not applicable')

	const sorobanContractNetworkContractIdSelector = parseRouteEntitySelector(
		schema,
		SorobanContractSchema,
		{
			$network: parentData.selector,
			contractId: params.contractId,
		},
		'NetworkContractId'
	)
	if (sorobanContractNetworkContractIdSelector instanceof arktype.errors)
		error(404, 'Invalid SorobanContract selector')

	return {
		selector: sorobanContractNetworkContractIdSelector,
	}
}
