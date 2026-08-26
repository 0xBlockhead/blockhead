// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import RssNetworkSchema from '$/schema/RssNetwork.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	const rssNetworkScopeSelector = parseRouteEntitySelector(
		schema,
		RssNetworkSchema,
		{
			scope: 'RssNetwork',
		},
		'Scope'
	)
	if (rssNetworkScopeSelector instanceof arktype.errors)
		error(404, 'Invalid RssNetwork selector')

	return {
		selector: rssNetworkScopeSelector,
	}
}
