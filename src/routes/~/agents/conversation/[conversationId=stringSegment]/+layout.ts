// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadAgentConversationSchema from '$/schema/BlockheadAgentConversation.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.conversationId)))
		error(404, 'Route mapping not applicable')

	const blockheadAgentConversationIdSelector = parseRouteEntitySelector(
		schema,
		BlockheadAgentConversationSchema,
		{
			id: params.conversationId,
		},
		'Id'
	)
	if (blockheadAgentConversationIdSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadAgentConversation selector')

	return {
		selector: blockheadAgentConversationIdSelector,
	}
}
