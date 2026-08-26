// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchAbsoluteUrl } from '$/params/absoluteUrl.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import A2aAgentCardSchema from '$/schema/A2aAgentCard.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchAbsoluteUrl(params.agentCardUrl)))
		error(404, 'Route mapping not applicable')

	const a2aAgentCardAgentCardUrlSelector = parseRouteEntitySelector(
		schema,
		A2aAgentCardSchema,
		{
			agentCardUrl: decodeURIComponent(params.agentCardUrl),
		},
		'AgentCardUrl'
	)
	if (a2aAgentCardAgentCardUrlSelector instanceof arktype.errors)
		error(404, 'Invalid A2aAgentCard selector')

	return {
		selector: a2aAgentCardAgentCardUrlSelector,
	}
}
