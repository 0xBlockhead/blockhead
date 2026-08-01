// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import XNetworkSchema from '$/schema/XNetwork.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	const xNetworkScopeSelector = parseEntitySelector(
		schema,
		XNetworkSchema,
		{
			scope: 'XNetwork',
		},
		'Scope'
	)
	if (xNetworkScopeSelector instanceof arktype.errors)
		error(404, 'Invalid XNetwork selector')

	return {
		selector: xNetworkScopeSelector,
	}
}
