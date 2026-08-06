// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import _GlobalIpfsAccessSchema from '$/schema/_GlobalIpfsAccess.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	const globalIpfsAccessScopeSelector = parseEntitySelector(
		schema,
		_GlobalIpfsAccessSchema,
		{
			scope: '_GlobalIpfsAccess',
		},
		'Scope'
	)
	if (globalIpfsAccessScopeSelector instanceof arktype.errors)
		error(404, 'Invalid _GlobalIpfsAccess selector')

	return {
		selector: globalIpfsAccessScopeSelector,
	}
}
