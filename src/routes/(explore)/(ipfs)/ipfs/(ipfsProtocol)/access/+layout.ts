// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { _GlobalIpfsAccess as _GlobalIpfsAccessSchema } from '$/schema/_GlobalIpfsAccess.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	const globalIpfsAccessScopeSelector = parseEntitySelector(
		schema,
		_GlobalIpfsAccessSchema,
		{
			scope: '_GlobalIpfsAccess',
		}
	)
	if (globalIpfsAccessScopeSelector instanceof arktype.errors) error(404, 'Invalid _GlobalIpfsAccess selector')

	return {
		selector: globalIpfsAccessScopeSelector,
	}
}
