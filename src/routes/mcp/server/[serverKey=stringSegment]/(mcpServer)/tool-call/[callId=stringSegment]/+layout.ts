// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import McpServerSchema from '$/schema/McpServer.ts'
import McpToolCallSchema from '$/schema/McpToolCall.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.callId)))
		error(404, 'Route mapping not applicable')

	const mcpServerServerKeyParentSelector = parseRouteEntitySelector(
		schema,
		McpServerSchema,
		parentData.selector,
		'ServerKey'
	)
	if (mcpServerServerKeyParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const mcpToolCallServerCallIdSelector = parseRouteEntitySelector(
		schema,
		McpToolCallSchema,
		{
			$server: mcpServerServerKeyParentSelector,
			callId: params.callId,
		},
		'ServerCallId'
	)
	if (mcpToolCallServerCallIdSelector instanceof arktype.errors)
		error(404, 'Invalid McpToolCall selector')

	return {
		selector: mcpToolCallServerCallIdSelector,
	}
}
