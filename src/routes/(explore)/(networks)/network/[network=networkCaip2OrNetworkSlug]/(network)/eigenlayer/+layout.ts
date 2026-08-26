// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import EigenLayerProtocolSchema from '$/schema/EigenLayerProtocol.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const eigenLayerProtocolNetworkSelector = parseRouteEntitySelector(
		schema,
		EigenLayerProtocolSchema,
		{
			$network: parentData.selector,
		},
		'Network'
	)
	if (eigenLayerProtocolNetworkSelector instanceof arktype.errors)
		error(404, 'Invalid EigenLayerProtocol selector')

	return {
		selector: eigenLayerProtocolNetworkSelector,
	}
}
