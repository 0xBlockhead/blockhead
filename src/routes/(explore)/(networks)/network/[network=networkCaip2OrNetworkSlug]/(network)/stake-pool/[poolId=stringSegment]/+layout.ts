// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import CardanoStakePoolSchema from '$/schema/CardanoStakePool.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Cardano']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Cardano' && matchStringSegment(params.poolId)))
		error(404, 'Route mapping not applicable')

	const cardanoStakePoolNetworkPoolIdSelector = parseRouteEntitySelector(
		schema,
		CardanoStakePoolSchema,
		{
			$network: parentData.selector,
			poolId: params.poolId,
		},
		'NetworkPoolId'
	)
	if (cardanoStakePoolNetworkPoolIdSelector instanceof arktype.errors)
		error(404, 'Invalid CardanoStakePool selector')

	return {
		selector: cardanoStakePoolNetworkPoolIdSelector,
	}
}
