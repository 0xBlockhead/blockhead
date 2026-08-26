// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AvalanchePChainBlockSchema from '$/schema/AvalanchePChainBlock.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Avalanche']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Avalanche' && matchNonNegativeBigInt(params.height)))
		error(404, 'Route mapping not applicable')

	const avalanchePChainBlockNetworkHeightSelector = parseRouteEntitySelector(
		schema,
		AvalanchePChainBlockSchema,
		{
			$network: parentData.selector,
			height: BigInt(params.height),
		},
		'NetworkHeight'
	)
	if (avalanchePChainBlockNetworkHeightSelector instanceof arktype.errors)
		error(404, 'Invalid AvalanchePChainBlock selector')

	return {
		selector: avalanchePChainBlockNetworkHeightSelector,
	}
}
