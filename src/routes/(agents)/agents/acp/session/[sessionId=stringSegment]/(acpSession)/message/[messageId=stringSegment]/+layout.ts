// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AcpMessageSchema from '$/schema/AcpMessage.ts'
import AcpSessionSchema from '$/schema/AcpSession.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.messageId)))
		error(404, 'Route mapping not applicable')

	const acpSessionSessionIdParentSelector = parseRouteEntitySelector(
		schema,
		AcpSessionSchema,
		parentData.selector,
		'SessionId'
	)
	if (acpSessionSessionIdParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const acpMessageSessionMessageIdSelector = parseRouteEntitySelector(
		schema,
		AcpMessageSchema,
		{
			$session: acpSessionSessionIdParentSelector,
			messageId: params.messageId,
		},
		'SessionMessageId'
	)
	if (acpMessageSessionMessageIdSelector instanceof arktype.errors)
		error(404, 'Invalid AcpMessage selector')

	return {
		selector: acpMessageSessionMessageIdSelector,
	}
}
