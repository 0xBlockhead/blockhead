// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import XmtpConversationSchema from '$/schema/XmtpConversation.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const xmtpConversationSelector = parseEntitySelector(
		schema,
		XmtpConversationSchema,
		{
			id: decodeURIComponent(params.conversationId),
		}
	)
	if (xmtpConversationSelector instanceof arktype.errors) error(404, 'Invalid XmtpConversation selector')

	return {
		selector: xmtpConversationSelector,
	}
}
