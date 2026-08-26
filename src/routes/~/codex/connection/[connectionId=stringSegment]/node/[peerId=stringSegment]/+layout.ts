// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadCodexStorageNodeStateSchema from '$/schema/BlockheadCodexStorageNodeState.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.connectionId) && matchStringSegment(params.peerId)))
		error(404, 'Route mapping not applicable')

	const blockheadCodexStorageNodeStateConnectionIdPeerIdSelector = parseRouteEntitySelector(
		schema,
		BlockheadCodexStorageNodeStateSchema,
		{
			connectionId: params.connectionId,
			peerId: params.peerId,
		},
		'ConnectionIdPeerId'
	)
	if (blockheadCodexStorageNodeStateConnectionIdPeerIdSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadCodexStorageNodeState selector')

	return {
		selector: blockheadCodexStorageNodeStateConnectionIdPeerIdSelector,
	}
}
