// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import XUserSchema from '$/schema/XUser.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.userId)))
		error(404, 'Route mapping not applicable')

	const xUserIdSelector = parseRouteEntitySelector(
		schema,
		XUserSchema,
		{
			id: params.userId,
		},
		'Id'
	)
	if (xUserIdSelector instanceof arktype.errors)
		error(404, 'Invalid XUser selector')

	return {
		selector: xUserIdSelector,
	}
}
