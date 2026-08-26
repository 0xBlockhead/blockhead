// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BnbBeaconTokenSchema from '$/schema/BnbBeaconToken.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['BnbBeacon']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.slug === 'bnb-beacon' && matchStringSegment(params.symbol)))
		error(404, 'Route mapping not applicable')

	const bnbBeaconTokenNetworkSymbolSelector = parseRouteEntitySelector(
		schema,
		BnbBeaconTokenSchema,
		{
			$network: parentData.selector,
			symbol: params.symbol,
		},
		'NetworkSymbol'
	)
	if (bnbBeaconTokenNetworkSymbolSelector instanceof arktype.errors)
		error(404, 'Invalid BnbBeaconToken selector')

	return {
		selector: bnbBeaconTokenNetworkSymbolSelector,
	}
}
