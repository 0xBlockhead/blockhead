// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadKaspaNodeStateSchema from '$/schema/BlockheadKaspaNodeState.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Kaspa']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Kaspa' && matchStringSegment(params.connectionId)))
		error(404, 'Route mapping not applicable')

	const blockheadKaspaNodeStateConnectionIdNetworkSelector = parseRouteEntitySelector(
		schema,
		BlockheadKaspaNodeStateSchema,
		{
			connectionId: params.connectionId,
			$network: parentData.selector,
		},
		'ConnectionIdNetwork'
	)
	if (blockheadKaspaNodeStateConnectionIdNetworkSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadKaspaNodeState selector')

	return {
		selector: blockheadKaspaNodeStateConnectionIdNetworkSelector,
	}
}
