// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AcpPromptTurnSchema from '$/schema/AcpPromptTurn.ts'
import AcpToolCallSchema from '$/schema/AcpToolCall.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.toolCallId)))
		error(404, 'Route mapping not applicable')

	const acpPromptTurnSessionTurnIdParentSelector = parseRouteEntitySelector(
		schema,
		AcpPromptTurnSchema,
		parentData.selector,
		'SessionTurnId'
	)
	if (acpPromptTurnSessionTurnIdParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const acpToolCallPromptTurnToolCallIdSelector = parseRouteEntitySelector(
		schema,
		AcpToolCallSchema,
		{
			$promptTurn: acpPromptTurnSessionTurnIdParentSelector,
			toolCallId: params.toolCallId,
		},
		'PromptTurnToolCallId'
	)
	if (acpToolCallPromptTurnToolCallIdSelector instanceof arktype.errors)
		error(404, 'Invalid AcpToolCall selector')

	return {
		selector: acpToolCallPromptTurnToolCallIdSelector,
	}
}
