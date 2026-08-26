// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import McpServerSchema from '$/schema/McpServer.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.serverKey)))
		error(404, 'Route mapping not applicable')

	const mcpServerServerKeySelector = parseRouteEntitySelector(
		schema,
		McpServerSchema,
		{
			serverKey: params.serverKey,
		},
		'ServerKey'
	)
	if (mcpServerServerKeySelector instanceof arktype.errors)
		error(404, 'Invalid McpServer selector')

	return {
		selector: mcpServerServerKeySelector,
	}
}
