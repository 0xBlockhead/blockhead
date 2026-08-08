// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import XmtpConversationSchema from '$/schema/XmtpConversation.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.conversationId)))
		error(404, 'Route mapping not applicable')

	const xmtpConversationIdSelector = parseEntitySelector(
		schema,
		XmtpConversationSchema,
		{
			id: params.conversationId,
		},
		'Id'
	)
	if (xmtpConversationIdSelector instanceof arktype.errors)
		error(404, 'Invalid XmtpConversation selector')

	return {
		selector: xmtpConversationIdSelector,
	}
}
