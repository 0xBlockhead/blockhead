// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import _GlobalRedditNetworkSchema from '$/schema/_GlobalRedditNetwork.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	const globalRedditNetworkScopeSelector = parseEntitySelector(
		schema,
		_GlobalRedditNetworkSchema,
		{
			scope: '_GlobalRedditNetwork',
		},
		'Scope'
	)
	if (globalRedditNetworkScopeSelector instanceof arktype.errors)
		error(404, 'Invalid _GlobalRedditNetwork selector')

	return {
		selector: globalRedditNetworkScopeSelector,
	}
}
