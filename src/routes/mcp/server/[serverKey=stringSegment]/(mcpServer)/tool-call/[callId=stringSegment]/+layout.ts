// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import McpToolCallSchema from '$/schema/McpToolCall.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.callId)))
		error(404, 'Route mapping not applicable')

	const mcpToolCallServerCallIdSelector = parseEntitySelector(
		schema,
		McpToolCallSchema,
		{
			$server: parentData.selector,
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
