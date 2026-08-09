// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import AcpSessionSchema from '$/schema/AcpSession.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.sessionId)))
		error(404, 'Route mapping not applicable')

	const acpSessionSessionIdSelector = parseEntitySelector(
		schema,
		AcpSessionSchema,
		{
			sessionId: params.sessionId,
		},
		'SessionId'
	)
	if (acpSessionSessionIdSelector instanceof arktype.errors)
		error(404, 'Invalid AcpSession selector')

	return {
		selector: acpSessionSessionIdSelector,
	}
}
