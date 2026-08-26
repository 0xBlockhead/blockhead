// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadLogosBlockchainNodeStateSchema from '$/schema/BlockheadLogosBlockchainNodeState.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.connectionId) && matchStringSegment(params.peerId)))
		error(404, 'Route mapping not applicable')

	const blockheadLogosBlockchainNodeStateConnectionIdPeerIdSelector = parseRouteEntitySelector(
		schema,
		BlockheadLogosBlockchainNodeStateSchema,
		{
			connectionId: params.connectionId,
			peerId: params.peerId,
		},
		'ConnectionIdPeerId'
	)
	if (blockheadLogosBlockchainNodeStateConnectionIdPeerIdSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadLogosBlockchainNodeState selector')

	return {
		selector: blockheadLogosBlockchainNodeStateConnectionIdPeerIdSelector,
	}
}
