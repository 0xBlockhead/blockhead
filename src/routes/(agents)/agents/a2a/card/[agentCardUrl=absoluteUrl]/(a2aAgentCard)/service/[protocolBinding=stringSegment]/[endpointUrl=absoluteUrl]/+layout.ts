// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchAbsoluteUrl } from '$/params/absoluteUrl.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import A2aAgentServiceSchema from '$/schema/A2aAgentService.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.protocolBinding) && matchAbsoluteUrl(params.endpointUrl)))
		error(404, 'Route mapping not applicable')

	const a2aAgentServiceCardProtocolBindingEndpointUrlSelector = parseEntitySelector(
		schema,
		A2aAgentServiceSchema,
		{
			$card: parentData.selector,
			protocolBinding: params.protocolBinding,
			endpointUrl: decodeURIComponent(params.endpointUrl),
		},
		'CardProtocolBindingEndpointUrl'
	)
	if (a2aAgentServiceCardProtocolBindingEndpointUrlSelector instanceof arktype.errors)
		error(404, 'Invalid A2aAgentService selector')

	return {
		selector: a2aAgentServiceCardProtocolBindingEndpointUrlSelector,
	}
}
