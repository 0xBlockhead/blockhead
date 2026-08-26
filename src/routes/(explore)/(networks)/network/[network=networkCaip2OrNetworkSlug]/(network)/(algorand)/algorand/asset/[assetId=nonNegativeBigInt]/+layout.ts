// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AlgorandAssetSchema from '$/schema/AlgorandAsset.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Algorand']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Algorand' && matchNonNegativeBigInt(params.assetId)))
		error(404, 'Route mapping not applicable')

	const algorandAssetNetworkAssetIdSelector = parseRouteEntitySelector(
		schema,
		AlgorandAssetSchema,
		{
			$network: parentData.selector,
			assetId: BigInt(params.assetId),
		},
		'NetworkAssetId'
	)
	if (algorandAssetNetworkAssetIdSelector instanceof arktype.errors)
		error(404, 'Invalid AlgorandAsset selector')

	return {
		selector: algorandAssetNetworkAssetIdSelector,
	}
}
