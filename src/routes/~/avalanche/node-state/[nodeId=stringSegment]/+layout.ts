// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadAvalancheNodeStateSchema from '$/schema/BlockheadAvalancheNodeState.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.nodeId)))
		error(404, 'Route mapping not applicable')

	const blockheadAvalancheNodeStateNodeIdSelector = parseRouteEntitySelector(
		schema,
		BlockheadAvalancheNodeStateSchema,
		{
			nodeId: params.nodeId,
		},
		'NodeId'
	)
	if (blockheadAvalancheNodeStateNodeIdSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadAvalancheNodeState selector')

	return {
		selector: blockheadAvalancheNodeStateNodeIdSelector,
	}
}
