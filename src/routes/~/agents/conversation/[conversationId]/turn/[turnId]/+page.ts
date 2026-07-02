// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadAgentConversationTurnSchema from '$/schema/BlockheadAgentConversationTurn.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const blockheadAgentConversationTurnSelector = parseEntitySelector(
		schema,
		BlockheadAgentConversationTurnSchema,
		{
			id: params.turnId,
		}
	)
	if (blockheadAgentConversationTurnSelector instanceof arktype.errors) error(404, 'Invalid BlockheadAgentConversationTurn selector')

	return {
		selector: blockheadAgentConversationTurnSelector,
	}
}
