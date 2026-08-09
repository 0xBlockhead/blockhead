// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadQuilibriumNodeStateSchema from '$/schema/BlockheadQuilibriumNodeState.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.connectionId)))
		error(404, 'Route mapping not applicable')

	const blockheadQuilibriumNodeStateConnectionIdNetworkSelector = parseEntitySelector(
		schema,
		BlockheadQuilibriumNodeStateSchema,
		{
			connectionId: params.connectionId,
			$network: parentData.selector,
		},
		'ConnectionIdNetwork'
	)
	if (blockheadQuilibriumNodeStateConnectionIdNetworkSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadQuilibriumNodeState selector')

	return {
		selector: blockheadQuilibriumNodeStateConnectionIdNetworkSelector,
	}
}
