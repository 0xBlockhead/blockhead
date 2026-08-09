// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import _GlobalAgentNetworkSchema from '$/schema/_GlobalAgentNetwork.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.networkId)))
		error(404, 'Route mapping not applicable')

	const globalAgentNetworkNetworkIdSelector = parseEntitySelector(
		schema,
		_GlobalAgentNetworkSchema,
		{
			networkId: params.networkId,
		},
		'NetworkId'
	)
	if (globalAgentNetworkNetworkIdSelector instanceof arktype.errors)
		error(404, 'Invalid _GlobalAgentNetwork selector')

	return {
		selector: globalAgentNetworkNetworkIdSelector,
	}
}
