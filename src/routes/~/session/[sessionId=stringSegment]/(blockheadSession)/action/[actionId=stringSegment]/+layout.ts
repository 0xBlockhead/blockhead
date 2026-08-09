// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadSessionActionSchema from '$/schema/BlockheadSessionAction.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.sessionId) && matchStringSegment(params.actionId)))
		error(404, 'Route mapping not applicable')

	const blockheadSessionActionSessionIdActionIdSelector = parseEntitySelector(
		schema,
		BlockheadSessionActionSchema,
		{
			sessionId: params.sessionId,
			actionId: params.actionId,
		},
		'SessionIdActionId'
	)
	if (blockheadSessionActionSessionIdActionIdSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadSessionAction selector')

	return {
		selector: blockheadSessionActionSessionIdActionIdSelector,
	}
}
