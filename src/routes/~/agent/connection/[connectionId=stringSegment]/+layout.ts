// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadAgentConnectionSchema from '$/schema/BlockheadAgentConnection.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.connectionId)))
		error(404, 'Route mapping not applicable')

	const blockheadAgentConnectionConnectionIdSelector = parseEntitySelector(
		schema,
		BlockheadAgentConnectionSchema,
		{
			connectionId: params.connectionId,
		},
		'ConnectionId'
	)
	if (blockheadAgentConnectionConnectionIdSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadAgentConnection selector')

	return {
		selector: blockheadAgentConnectionConnectionIdSelector,
	}
}
