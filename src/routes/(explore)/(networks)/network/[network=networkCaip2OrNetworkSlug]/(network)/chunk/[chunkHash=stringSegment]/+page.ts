// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import NearChunkSchema from '$/schema/NearChunk.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Near']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Near' && matchStringSegment(params.chunkHash)))
		error(404, 'Route mapping not applicable')

	const nearChunkNetworkChunkHashSelector = parseRouteEntitySelector(
		schema,
		NearChunkSchema,
		{
			$network: parentData.selector,
			chunkHash: params.chunkHash,
		},
		'NetworkChunkHash'
	)
	if (nearChunkNetworkChunkHashSelector instanceof arktype.errors)
		error(404, 'Invalid NearChunk selector')

	return {
		selector: nearChunkNetworkChunkHashSelector,
	}
}
