// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import QuilibriumShardSchema from '$/schema/QuilibriumShard.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Quilibrium']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Quilibrium' && matchStringSegment(params.shardKey)))
		error(404, 'Route mapping not applicable')

	const quilibriumShardNetworkShardKeySelector = parseRouteEntitySelector(
		schema,
		QuilibriumShardSchema,
		{
			$network: parentData.selector.$network,
			shardKey: params.shardKey,
		},
		'NetworkShardKey'
	)
	if (quilibriumShardNetworkShardKeySelector instanceof arktype.errors)
		error(404, 'Invalid QuilibriumShard selector')

	return {
		selector: quilibriumShardNetworkShardKeySelector,
	}
}
