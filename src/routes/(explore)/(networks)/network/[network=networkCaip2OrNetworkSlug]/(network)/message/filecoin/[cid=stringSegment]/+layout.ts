// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import FilecoinMessageSchema from '$/schema/FilecoinMessage.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Filecoin']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Filecoin' && matchStringSegment(params.cid)))
		error(404, 'Route mapping not applicable')

	const filecoinMessageNetworkCidSelector = parseRouteEntitySelector(
		schema,
		FilecoinMessageSchema,
		{
			$network: parentData.selector,
			cid: params.cid,
		},
		'NetworkCid'
	)
	if (filecoinMessageNetworkCidSelector instanceof arktype.errors)
		error(404, 'Invalid FilecoinMessage selector')

	return {
		selector: filecoinMessageNetworkCidSelector,
	}
}
