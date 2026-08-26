// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SuiObjectSchema from '$/schema/SuiObject.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Sui']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Sui' && matchStringSegment(params.objectId)))
		error(404, 'Route mapping not applicable')

	const suiObjectNetworkObjectIdSelector = parseRouteEntitySelector(
		schema,
		SuiObjectSchema,
		{
			$network: parentData.selector,
			objectId: params.objectId,
		},
		'NetworkObjectId'
	)
	if (suiObjectNetworkObjectIdSelector instanceof arktype.errors)
		error(404, 'Invalid SuiObject selector')

	return {
		selector: suiObjectNetworkObjectIdSelector,
	}
}
