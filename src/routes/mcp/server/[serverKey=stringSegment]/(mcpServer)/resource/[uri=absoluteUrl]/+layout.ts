// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchAbsoluteUrl } from '$/params/absoluteUrl.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import McpResourceSchema from '$/schema/McpResource.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchAbsoluteUrl(params.uri)))
		error(404, 'Route mapping not applicable')

	const mcpResourceServerUriSelector = parseEntitySelector(
		schema,
		McpResourceSchema,
		{
			$server: parentData.selector,
			uri: decodeURIComponent(params.uri),
		},
		'ServerUri'
	)
	if (mcpResourceServerUriSelector instanceof arktype.errors)
		error(404, 'Invalid McpResource selector')

	return {
		selector: mcpResourceServerUriSelector,
	}
}
