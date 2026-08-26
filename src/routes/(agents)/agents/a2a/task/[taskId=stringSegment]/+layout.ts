// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import A2aTaskSchema from '$/schema/A2aTask.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.taskId)))
		error(404, 'Route mapping not applicable')

	const a2aTaskTaskIdSelector = parseRouteEntitySelector(
		schema,
		A2aTaskSchema,
		{
			taskId: params.taskId,
		},
		'TaskId'
	)
	if (a2aTaskTaskIdSelector instanceof arktype.errors)
		error(404, 'Invalid A2aTask selector')

	return {
		selector: a2aTaskTaskIdSelector,
	}
}
