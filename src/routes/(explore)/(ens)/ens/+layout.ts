// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { _GlobalEnsNetwork as _GlobalEnsNetworkSchema } from '$/schema/_GlobalEnsNetwork.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	const globalEnsNetworkScopeSelector = parseEntitySelector(
		schema,
		_GlobalEnsNetworkSchema,
		{
			scope: '_GlobalEnsNetwork',
		}
	)
	if (globalEnsNetworkScopeSelector instanceof arktype.errors) error(404, 'Invalid _GlobalEnsNetwork selector')

	return {
		selector: globalEnsNetworkScopeSelector,
	}
}
