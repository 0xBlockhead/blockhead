// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import _GlobalAtprotoNetworkSchema from '$/schema/_GlobalAtprotoNetwork.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	const globalAtprotoNetworkScopeSelector = parseEntitySelector(
		schema,
		_GlobalAtprotoNetworkSchema,
		{
			scope: '_GlobalAtprotoNetwork',
		}
	)
	if (globalAtprotoNetworkScopeSelector instanceof arktype.errors) error(404, 'Invalid _GlobalAtprotoNetwork selector')

	return {
		selector: globalAtprotoNetworkScopeSelector,
	}
}
