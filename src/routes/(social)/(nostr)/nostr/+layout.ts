// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { _GlobalNostrNetwork as _GlobalNostrNetworkSchema } from '$/schema/_GlobalNostrNetwork.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	const globalNostrNetworkScopeSelector = parseEntitySelector(
		schema,
		_GlobalNostrNetworkSchema,
		{
			scope: '_GlobalNostrNetwork',
		}
	)
	if (globalNostrNetworkScopeSelector instanceof arktype.errors) error(404, 'Invalid _GlobalNostrNetwork selector')

	return {
		selector: globalNostrNetworkScopeSelector,
	}
}
