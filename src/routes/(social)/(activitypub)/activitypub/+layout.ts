// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import _GlobalActivityPubNetworkSchema from '$/schema/_GlobalActivityPubNetwork.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	const globalActivityPubNetworkScopeSelector = parseRouteEntitySelector(
		schema,
		_GlobalActivityPubNetworkSchema,
		{
			scope: '_GlobalActivityPubNetwork',
		},
		'Scope'
	)
	if (globalActivityPubNetworkScopeSelector instanceof arktype.errors)
		error(404, 'Invalid _GlobalActivityPubNetwork selector')

	return {
		selector: globalActivityPubNetworkScopeSelector,
	}
}
