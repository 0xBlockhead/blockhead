// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchAbsoluteUrl } from '$/params/absoluteUrl.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import A2aAgentCardSchema from '$/schema/A2aAgentCard.ts'
import A2aAgentServiceSchema from '$/schema/A2aAgentService.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.protocolBinding) && matchAbsoluteUrl(params.endpointUrl)))
		error(404, 'Route mapping not applicable')

	const a2aAgentCardAgentCardUrlParentSelector = parseRouteEntitySelector(
		schema,
		A2aAgentCardSchema,
		parentData.selector,
		'AgentCardUrl'
	)
	if (a2aAgentCardAgentCardUrlParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const a2aAgentServiceCardProtocolBindingEndpointUrlSelector = parseRouteEntitySelector(
		schema,
		A2aAgentServiceSchema,
		{
			$card: a2aAgentCardAgentCardUrlParentSelector,
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
