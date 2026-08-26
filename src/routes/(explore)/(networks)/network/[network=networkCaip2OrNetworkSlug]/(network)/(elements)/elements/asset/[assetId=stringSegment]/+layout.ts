// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import ElementsAssetSchema from '$/schema/ElementsAsset.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Elements']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Elements' && matchStringSegment(params.assetId)))
		error(404, 'Route mapping not applicable')

	const elementsAssetElementsNetworkAssetIdSelector = parseRouteEntitySelector(
		schema,
		ElementsAssetSchema,
		{
			$network: parentData.selector,
			assetId: params.assetId,
		},
		'ElementsNetworkAssetId'
	)
	if (elementsAssetElementsNetworkAssetIdSelector instanceof arktype.errors)
		error(404, 'Invalid ElementsAsset selector')

	return {
		selector: elementsAssetElementsNetworkAssetIdSelector,
	}
}
