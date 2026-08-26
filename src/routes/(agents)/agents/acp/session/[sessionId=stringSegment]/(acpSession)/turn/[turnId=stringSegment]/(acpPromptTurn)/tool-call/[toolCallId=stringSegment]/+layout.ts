// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AcpToolCallSchema from '$/schema/AcpToolCall.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.toolCallId)))
		error(404, 'Route mapping not applicable')

	const acpToolCallPromptTurnToolCallIdSelector = parseRouteEntitySelector(
		schema,
		AcpToolCallSchema,
		{
			$promptTurn: parentData.selector,
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
