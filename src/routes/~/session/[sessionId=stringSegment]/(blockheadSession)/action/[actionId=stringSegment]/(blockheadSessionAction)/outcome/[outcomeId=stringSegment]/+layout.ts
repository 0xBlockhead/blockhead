// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadActionOutcomeSchema from '$/schema/BlockheadActionOutcome.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.sessionId) && matchStringSegment(params.actionId) && matchStringSegment(params.outcomeId)))
		error(404, 'Route mapping not applicable')

	const blockheadActionOutcomeSessionIdActionIdOutcomeIdSelector = parseRouteEntitySelector(
		schema,
		BlockheadActionOutcomeSchema,
		{
			sessionId: params.sessionId,
			actionId: params.actionId,
			outcomeId: params.outcomeId,
		},
		'SessionIdActionIdOutcomeId'
	)
	if (blockheadActionOutcomeSessionIdActionIdOutcomeIdSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadActionOutcome selector')

	return {
		selector: blockheadActionOutcomeSessionIdActionIdOutcomeIdSelector,
	}
}
