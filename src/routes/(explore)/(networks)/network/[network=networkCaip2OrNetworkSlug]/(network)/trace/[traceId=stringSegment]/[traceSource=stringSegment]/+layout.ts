// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import TonTraceSchema from '$/schema/TonTrace.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.traceId) && matchStringSegment(params.traceSource)))
		error(404, 'Route mapping not applicable')

	const tonTraceNetworkTraceIdSourceSelector = parseRouteEntitySelector(
		schema,
		TonTraceSchema,
		{
			$network: parentData.selector,
			traceId: params.traceId,
			source: params.traceSource,
		},
		'NetworkTraceIdSource'
	)
	if (tonTraceNetworkTraceIdSourceSelector instanceof arktype.errors)
		error(404, 'Invalid TonTrace selector')

	return {
		selector: tonTraceNetworkTraceIdSourceSelector,
	}
}
