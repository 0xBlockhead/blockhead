// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadLightningNodeStateSchema from '$/schema/BlockheadLightningNodeState.ts'
import { schema } from '$/schema/index.ts'
import LightningNetworkSchema from '$/schema/LightningNetwork.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Lightning']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Lightning' && matchStringSegment(params.connectionId)))
		error(404, 'Route mapping not applicable')

	const lightningNetworkNetworkParentSelector = parseRouteEntitySelector(
		schema,
		LightningNetworkSchema,
		parentData.selector,
		'Network'
	)
	if (lightningNetworkNetworkParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const blockheadLightningNodeStateConnectionIdNetworkSelector = parseRouteEntitySelector(
		schema,
		BlockheadLightningNodeStateSchema,
		{
			connectionId: params.connectionId,
			$network: lightningNetworkNetworkParentSelector,
		},
		'ConnectionIdNetwork'
	)
	if (blockheadLightningNodeStateConnectionIdNetworkSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadLightningNodeState selector')

	return {
		selector: blockheadLightningNodeStateConnectionIdNetworkSelector,
	}
}
