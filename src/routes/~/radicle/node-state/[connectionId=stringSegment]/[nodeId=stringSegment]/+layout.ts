// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadRadicleNodeStateSchema from '$/schema/BlockheadRadicleNodeState.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.connectionId) && matchStringSegment(params.nodeId)))
		error(404, 'Route mapping not applicable')

	const blockheadRadicleNodeStateConnectionIdNodeIdSelector = parseEntitySelector(
		schema,
		BlockheadRadicleNodeStateSchema,
		{
			connectionId: params.connectionId,
			nodeId: params.nodeId,
		},
		'ConnectionIdNodeId'
	)
	if (blockheadRadicleNodeStateConnectionIdNodeIdSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadRadicleNodeState selector')

	return {
		selector: blockheadRadicleNodeStateConnectionIdNodeIdSelector,
	}
}
