// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import TonMessageSchema from '$/schema/TonMessage.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Ton']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Ton' && matchStringSegment(params.messageHash)))
		error(404, 'Route mapping not applicable')

	const tonMessageNetworkMessageHashSelector = parseRouteEntitySelector(
		schema,
		TonMessageSchema,
		{
			$network: parentData.selector,
			messageHash: params.messageHash,
		},
		'NetworkMessageHash'
	)
	if (tonMessageNetworkMessageHashSelector instanceof arktype.errors)
		error(404, 'Invalid TonMessage selector')

	return {
		selector: tonMessageNetworkMessageHashSelector,
	}
}
