// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadLightningNodeStateSchema from '$/schema/BlockheadLightningNodeState.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Lightning']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Lightning' && matchStringSegment(params.connectionId)))
		error(404, 'Route mapping not applicable')

	const blockheadLightningNodeStateConnectionIdNetworkSelector = parseEntitySelector(
		schema,
		BlockheadLightningNodeStateSchema,
		{
			connectionId: params.connectionId,
			$network: parentData.selector,
		},
		'ConnectionIdNetwork'
	)
	if (blockheadLightningNodeStateConnectionIdNetworkSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadLightningNodeState selector')

	return {
		selector: blockheadLightningNodeStateConnectionIdNetworkSelector,
	}
}
