// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SwarmProtocolSchema from '$/schema/SwarmProtocol.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	const swarmProtocolScopeSelector = parseRouteEntitySelector(
		schema,
		SwarmProtocolSchema,
		{
			scope: 'SwarmProtocol',
		},
		'Scope'
	)
	if (swarmProtocolScopeSelector instanceof arktype.errors)
		error(404, 'Invalid SwarmProtocol selector')

	return {
		selector: swarmProtocolScopeSelector,
	}
}
