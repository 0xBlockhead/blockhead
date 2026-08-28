// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadLightningNodeStateSchema from '$/schema/BlockheadLightningNodeState.ts'
import BlockheadLightningPeerSchema from '$/schema/BlockheadLightningPeer.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Lightning']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Lightning' && matchStringSegment(params.publicKey)))
		error(404, 'Route mapping not applicable')

	const blockheadLightningNodeStateConnectionIdNetworkParentSelector = parseRouteEntitySelector(
		schema,
		BlockheadLightningNodeStateSchema,
		parentData.selector,
		'ConnectionIdNetwork'
	)
	if (blockheadLightningNodeStateConnectionIdNetworkParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const blockheadLightningPeerLocalNodeStatePublicKeySelector = parseRouteEntitySelector(
		schema,
		BlockheadLightningPeerSchema,
		{
			$localNodeState: blockheadLightningNodeStateConnectionIdNetworkParentSelector,
			publicKey: params.publicKey,
		},
		'LocalNodeStatePublicKey'
	)
	if (blockheadLightningPeerLocalNodeStatePublicKeySelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadLightningPeer selector')

	return {
		selector: blockheadLightningPeerLocalNodeStatePublicKeySelector,
	}
}
