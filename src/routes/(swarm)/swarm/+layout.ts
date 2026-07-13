// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { SwarmProtocol as SwarmProtocolSchema } from '$/schema/SwarmProtocol.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	const swarmProtocolScopeSelector = parseEntitySelector(
		schema,
		SwarmProtocolSchema,
		{
			scope: 'SwarmProtocol',
		}
	)
	if (swarmProtocolScopeSelector instanceof arktype.errors) error(404, 'Invalid SwarmProtocol selector')

	return {
		selector: swarmProtocolScopeSelector,
	}
}
