// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import A2aMessageSchema from '$/schema/A2aMessage.ts'
import A2aTaskSchema from '$/schema/A2aTask.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.messageId)))
		error(404, 'Route mapping not applicable')

	const a2aTaskTaskIdParentSelector = parseRouteEntitySelector(
		schema,
		A2aTaskSchema,
		parentData.selector,
		'TaskId'
	)
	if (a2aTaskTaskIdParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const a2aMessageTaskMessageIdSelector = parseRouteEntitySelector(
		schema,
		A2aMessageSchema,
		{
			$task: a2aTaskTaskIdParentSelector,
			messageId: params.messageId,
		},
		'TaskMessageId'
	)
	if (a2aMessageTaskMessageIdSelector instanceof arktype.errors)
		error(404, 'Invalid A2aMessage selector')

	return {
		selector: a2aMessageTaskMessageIdSelector,
	}
}
