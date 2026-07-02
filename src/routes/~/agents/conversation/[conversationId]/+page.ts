// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadAgentConversationSchema from '$/schema/BlockheadAgentConversation.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const blockheadAgentConversationSelector = parseEntitySelector(
		schema,
		BlockheadAgentConversationSchema,
		{
			id: params.conversationId,
		}
	)
	if (blockheadAgentConversationSelector instanceof arktype.errors) error(404, 'Invalid BlockheadAgentConversation selector')

	return {
		selector: blockheadAgentConversationSelector,
	}
}
