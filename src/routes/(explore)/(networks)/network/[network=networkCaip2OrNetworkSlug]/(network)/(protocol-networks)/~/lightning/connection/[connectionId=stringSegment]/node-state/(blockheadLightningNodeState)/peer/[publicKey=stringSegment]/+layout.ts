// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadLightningPeerSchema from '$/schema/BlockheadLightningPeer.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Lightning']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Lightning' && matchStringSegment(params.publicKey)))
		error(404, 'Route mapping not applicable')

	const blockheadLightningPeerLocalNodeStatePublicKeySelector = parseEntitySelector(
		schema,
		BlockheadLightningPeerSchema,
		{
			$localNodeState: parentData.selector,
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
