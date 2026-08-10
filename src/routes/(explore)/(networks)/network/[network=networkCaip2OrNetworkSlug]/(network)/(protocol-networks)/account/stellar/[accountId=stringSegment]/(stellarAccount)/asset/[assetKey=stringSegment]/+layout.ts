// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import StellarTrustlineSchema from '$/schema/StellarTrustline.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Stellar']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Stellar' && matchStringSegment(params.assetKey)))
		error(404, 'Route mapping not applicable')

	const stellarTrustlineAccountAssetSelector = parseEntitySelector(
		schema,
		StellarTrustlineSchema,
		{
			$account: parentData.selector,
			$asset: {
				$network: parentData.selector.$network,
				assetKey: params.assetKey,
			},
		},
		'AccountAsset'
	)
	if (stellarTrustlineAccountAssetSelector instanceof arktype.errors)
		error(404, 'Invalid StellarTrustline selector')

	return {
		selector: stellarTrustlineAccountAssetSelector,
	}
}
