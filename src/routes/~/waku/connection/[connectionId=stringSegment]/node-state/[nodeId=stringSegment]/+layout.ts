// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadWakuNodeStateSchema from '$/schema/BlockheadWakuNodeState.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.connectionId) && matchStringSegment(params.nodeId)))
		error(404, 'Route mapping not applicable')

	const blockheadWakuNodeStateConnectionIdNodeIdSelector = parseRouteEntitySelector(
		schema,
		BlockheadWakuNodeStateSchema,
		{
			connectionId: params.connectionId,
			nodeId: params.nodeId,
		},
		'ConnectionIdNodeId'
	)
	if (blockheadWakuNodeStateConnectionIdNodeIdSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadWakuNodeState selector')

	return {
		selector: blockheadWakuNodeStateConnectionIdNodeIdSelector,
	}
}
