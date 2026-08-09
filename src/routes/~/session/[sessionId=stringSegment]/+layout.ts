// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadSessionSchema from '$/schema/BlockheadSession.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.sessionId)))
		error(404, 'Route mapping not applicable')

	const blockheadSessionIdSelector = parseEntitySelector(
		schema,
		BlockheadSessionSchema,
		{
			id: params.sessionId,
		},
		'Id'
	)
	if (blockheadSessionIdSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadSession selector')

	return {
		selector: blockheadSessionIdSelector,
	}
}
