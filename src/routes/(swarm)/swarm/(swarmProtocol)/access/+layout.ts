// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import _GlobalSwarmAccessSchema from '$/schema/_GlobalSwarmAccess.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	const globalSwarmAccessScopeSelector = parseRouteEntitySelector(
		schema,
		_GlobalSwarmAccessSchema,
		{
			scope: '_GlobalSwarmAccess',
		},
		'Scope'
	)
	if (globalSwarmAccessScopeSelector instanceof arktype.errors)
		error(404, 'Invalid _GlobalSwarmAccess selector')

	return {
		selector: globalSwarmAccessScopeSelector,
	}
}
