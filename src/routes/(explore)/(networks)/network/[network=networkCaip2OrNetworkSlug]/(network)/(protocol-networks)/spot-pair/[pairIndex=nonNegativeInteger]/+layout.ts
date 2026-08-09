// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import HyperliquidSpotPairSchema from '$/schema/HyperliquidSpotPair.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Hyperliquid']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Hyperliquid' && matchNonNegativeInteger(params.pairIndex)))
		error(404, 'Route mapping not applicable')

	const hyperliquidSpotPairNetworkPairIndexSelector = parseEntitySelector(
		schema,
		HyperliquidSpotPairSchema,
		{
			$network: parentData.selector,
			pairIndex: Number(params.pairIndex),
		},
		'NetworkPairIndex'
	)
	if (hyperliquidSpotPairNetworkPairIndexSelector instanceof arktype.errors)
		error(404, 'Invalid HyperliquidSpotPair selector')

	return {
		selector: hyperliquidSpotPairNetworkPairIndexSelector,
	}
}
