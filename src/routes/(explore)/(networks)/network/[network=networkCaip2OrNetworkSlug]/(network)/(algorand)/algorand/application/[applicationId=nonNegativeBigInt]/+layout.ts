// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AlgorandApplicationSchema from '$/schema/AlgorandApplication.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Algorand']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Algorand' && matchNonNegativeBigInt(params.applicationId)))
		error(404, 'Route mapping not applicable')

	const algorandApplicationNetworkApplicationIdSelector = parseRouteEntitySelector(
		schema,
		AlgorandApplicationSchema,
		{
			$network: parentData.selector,
			applicationId: BigInt(params.applicationId),
		},
		'NetworkApplicationId'
	)
	if (algorandApplicationNetworkApplicationIdSelector instanceof arktype.errors)
		error(404, 'Invalid AlgorandApplication selector')

	return {
		selector: algorandApplicationNetworkApplicationIdSelector,
	}
}
