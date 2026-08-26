// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import McpPromptSchema from '$/schema/McpPrompt.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.name)))
		error(404, 'Route mapping not applicable')

	const mcpPromptServerNameSelector = parseRouteEntitySelector(
		schema,
		McpPromptSchema,
		{
			$server: parentData.selector,
			name: params.name,
		},
		'ServerName'
	)
	if (mcpPromptServerNameSelector instanceof arktype.errors)
		error(404, 'Invalid McpPrompt selector')

	return {
		selector: mcpPromptServerNameSelector,
	}
}
