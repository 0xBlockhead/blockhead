// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AvalanchePChainBlockSchema from '$/schema/AvalanchePChainBlock.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Avalanche']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Avalanche' && matchStringSegment(params.blockId)))
		error(404, 'Route mapping not applicable')

	const avalanchePChainBlockNetworkBlockIdSelector = parseRouteEntitySelector(
		schema,
		AvalanchePChainBlockSchema,
		{
			$network: parentData.selector,
			blockId: params.blockId,
		},
		'NetworkBlockId'
	)
	if (avalanchePChainBlockNetworkBlockIdSelector instanceof arktype.errors)
		error(404, 'Invalid AvalanchePChainBlock selector')

	return {
		selector: avalanchePChainBlockNetworkBlockIdSelector,
	}
}
