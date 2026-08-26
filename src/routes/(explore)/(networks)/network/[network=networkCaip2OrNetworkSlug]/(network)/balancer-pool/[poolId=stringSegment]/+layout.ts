// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BalancerPoolSchema from '$/schema/BalancerPool.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Evm']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			(
				parentData.projectionNetwork.executionModels !== undefined
				&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
			)
			&& parentData.projectionNetwork.namespace === 'Evm'
		)
		&& matchStringSegment(params.poolId)
	))
		error(404, 'Route mapping not applicable')

	const balancerPoolNetworkPoolIdSelector = parseRouteEntitySelector(
		schema,
		BalancerPoolSchema,
		{
			$network: parentData.selector,
			poolId: params.poolId,
		},
		'NetworkPoolId'
	)
	if (balancerPoolNetworkPoolIdSelector instanceof arktype.errors)
		error(404, 'Invalid BalancerPool selector')

	return {
		selector: balancerPoolNetworkPoolIdSelector,
	}
}
