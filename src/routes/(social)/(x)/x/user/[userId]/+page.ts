// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { xUserSelectorFromRouteParam } from '$/lib/x.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import XUserSchema from '$/schema/XUser.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const xUserSelector = parseEntitySelector(
		schema,
		XUserSchema,
		xUserSelectorFromRouteParam(decodeURIComponent(params.userId))
	)
	if (xUserSelector instanceof arktype.errors) error(404, 'Invalid XUser selector')

	return {
		selector: xUserSelector,
	}
}
