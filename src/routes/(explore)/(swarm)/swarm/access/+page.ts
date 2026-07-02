// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import _GlobalSwarmAccessSchema from '$/schema/_GlobalSwarmAccess.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const globalSwarmAccessSelector = parseEntitySelector(
		schema,
		_GlobalSwarmAccessSchema,
		{
			scope: '_GlobalSwarmAccess',
		}
	)
	if (globalSwarmAccessSelector instanceof arktype.errors) error(404, 'Invalid _GlobalSwarmAccess selector')

	return {
		selector: globalSwarmAccessSelector,
	}
}
