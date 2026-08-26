// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import _GlobalNostrNetworkSchema from '$/schema/_GlobalNostrNetwork.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	const globalNostrNetworkScopeSelector = parseRouteEntitySelector(
		schema,
		_GlobalNostrNetworkSchema,
		{
			scope: '_GlobalNostrNetwork',
		},
		'Scope'
	)
	if (globalNostrNetworkScopeSelector instanceof arktype.errors)
		error(404, 'Invalid _GlobalNostrNetwork selector')

	return {
		selector: globalNostrNetworkScopeSelector,
	}
}
