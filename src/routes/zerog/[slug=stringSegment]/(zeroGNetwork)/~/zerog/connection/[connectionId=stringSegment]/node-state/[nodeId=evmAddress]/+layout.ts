// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadZeroGStorageNodeStateSchema from '$/schema/BlockheadZeroGStorageNodeState.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.connectionId) && matchEvmAddress(params.nodeId)))
		error(404, 'Route mapping not applicable')

	const blockheadZeroGStorageNodeStateConnectionIdNetworkNodeIdSelector = parseRouteEntitySelector(
		schema,
		BlockheadZeroGStorageNodeStateSchema,
		{
			connectionId: params.connectionId,
			$network: parentData.selector,
			nodeId: params.nodeId,
		},
		'ConnectionIdNetworkNodeId'
	)
	if (blockheadZeroGStorageNodeStateConnectionIdNetworkNodeIdSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadZeroGStorageNodeState selector')

	return {
		selector: blockheadZeroGStorageNodeStateConnectionIdNetworkNodeIdSelector,
	}
}
