// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadActionReadinessCheckSchema from '$/schema/BlockheadActionReadinessCheck.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.sessionId) && matchStringSegment(params.actionId) && matchStringSegment(params.checkId)))
		error(404, 'Route mapping not applicable')

	const blockheadActionReadinessCheckSessionIdActionIdCheckIdSelector = parseEntitySelector(
		schema,
		BlockheadActionReadinessCheckSchema,
		{
			sessionId: params.sessionId,
			actionId: params.actionId,
			checkId: params.checkId,
		},
		'SessionIdActionIdCheckId'
	)
	if (blockheadActionReadinessCheckSessionIdActionIdCheckIdSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadActionReadinessCheck selector')

	return {
		selector: blockheadActionReadinessCheckSessionIdActionIdCheckIdSelector,
	}
}
