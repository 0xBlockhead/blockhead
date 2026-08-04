// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import OsmosisPoolSchema from '$/schema/OsmosisPool.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Cosmos']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			(
				parentData.projectionNetwork.executionModels !== undefined
				&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'CosmosSdk')
			)
			&& parentData.projectionNetwork.namespace === 'Cosmos'
		)
		&& matchStringSegment(params.poolId)
	))
		error(404, 'Route mapping not applicable')

	const osmosisPoolNetworkPoolIdSelector = parseEntitySelector(
		schema,
		OsmosisPoolSchema,
		{
			$network: parentData.selector,
			poolId: params.poolId,
		},
		'NetworkPoolId'
	)
	if (osmosisPoolNetworkPoolIdSelector instanceof arktype.errors)
		error(404, 'Invalid OsmosisPool selector')

	return {
		selector: osmosisPoolNetworkPoolIdSelector,
	}
}
