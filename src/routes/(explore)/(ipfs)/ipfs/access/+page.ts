// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import _GlobalIpfsAccessSchema from '$/schema/_GlobalIpfsAccess.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const globalIpfsAccessSelector = parseEntitySelector(
		schema,
		_GlobalIpfsAccessSchema,
		{
			scope: '_GlobalIpfsAccess',
		}
	)
	if (globalIpfsAccessSelector instanceof arktype.errors) error(404, 'Invalid _GlobalIpfsAccess selector')

	return {
		selector: globalIpfsAccessSelector,
	}
}
