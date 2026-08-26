// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import KaspaBlockSchema from '$/schema/KaspaBlock.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Kaspa']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Kaspa' && matchStringSegment(params.blockHash)))
		error(404, 'Route mapping not applicable')

	const kaspaBlockNetworkBlockHashSelector = parseRouteEntitySelector(
		schema,
		KaspaBlockSchema,
		{
			$network: parentData.selector,
			blockHash: params.blockHash,
		},
		'NetworkBlockHash'
	)
	if (kaspaBlockNetworkBlockHashSelector instanceof arktype.errors)
		error(404, 'Invalid KaspaBlock selector')

	return {
		selector: kaspaBlockNetworkBlockHashSelector,
	}
}
