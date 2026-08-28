// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadLightningChannelStateSchema from '$/schema/BlockheadLightningChannelState.ts'
import BlockheadLightningNodeStateSchema from '$/schema/BlockheadLightningNodeState.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Lightning']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Lightning' && matchStringSegment(params.channelId)))
		error(404, 'Route mapping not applicable')

	const blockheadLightningNodeStateConnectionIdNetworkParentSelector = parseRouteEntitySelector(
		schema,
		BlockheadLightningNodeStateSchema,
		parentData.selector,
		'ConnectionIdNetwork'
	)
	if (blockheadLightningNodeStateConnectionIdNetworkParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const blockheadLightningChannelStateLocalNodeStateChannelSelector = parseRouteEntitySelector(
		schema,
		BlockheadLightningChannelStateSchema,
		{
			$localNodeState: blockheadLightningNodeStateConnectionIdNetworkParentSelector,
			$channel: {
				$network: blockheadLightningNodeStateConnectionIdNetworkParentSelector.$network.$network,
				channelId: params.channelId,
			},
		},
		'LocalNodeStateChannel'
	)
	if (blockheadLightningChannelStateLocalNodeStateChannelSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadLightningChannelState selector')

	return {
		selector: blockheadLightningChannelStateLocalNodeStateChannelSelector,
	}
}
