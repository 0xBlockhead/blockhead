// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CardanoStakePoolSchema from '$/schema/CardanoStakePool.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Cardano']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Cardano' && matchStringSegment(params.poolId)))
		error(404, 'Route mapping not applicable')

	const cardanoStakePoolNetworkPoolIdSelector = parseEntitySelector(
		schema,
		CardanoStakePoolSchema,
		{
			$network: parentData.selector,
			poolId: params.poolId,
		}
	)
	if (cardanoStakePoolNetworkPoolIdSelector instanceof arktype.errors)
		error(404, 'Invalid CardanoStakePool selector')

	return {
		selector: cardanoStakePoolNetworkPoolIdSelector,
	}
}
