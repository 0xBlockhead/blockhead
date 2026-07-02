// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import _GlobalEnsNetworkSchema from '$/schema/_GlobalEnsNetwork.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const globalEnsNetworkSelector = parseEntitySelector(
		schema,
		_GlobalEnsNetworkSchema,
		{
			scope: '_GlobalEnsNetwork',
		}
	)
	if (globalEnsNetworkSelector instanceof arktype.errors) error(404, 'Invalid _GlobalEnsNetwork selector')

	return {
		selector: globalEnsNetworkSelector,
	}
}
