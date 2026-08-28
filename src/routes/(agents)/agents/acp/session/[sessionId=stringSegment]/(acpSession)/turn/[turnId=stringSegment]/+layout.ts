// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AcpPromptTurnSchema from '$/schema/AcpPromptTurn.ts'
import AcpSessionSchema from '$/schema/AcpSession.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.turnId)))
		error(404, 'Route mapping not applicable')

	const acpSessionSessionIdParentSelector = parseRouteEntitySelector(
		schema,
		AcpSessionSchema,
		parentData.selector,
		'SessionId'
	)
	if (acpSessionSessionIdParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const acpPromptTurnSessionTurnIdSelector = parseRouteEntitySelector(
		schema,
		AcpPromptTurnSchema,
		{
			$session: acpSessionSessionIdParentSelector,
			turnId: params.turnId,
		},
		'SessionTurnId'
	)
	if (acpPromptTurnSessionTurnIdSelector instanceof arktype.errors)
		error(404, 'Invalid AcpPromptTurn selector')

	return {
		selector: acpPromptTurnSessionTurnIdSelector,
	}
}
