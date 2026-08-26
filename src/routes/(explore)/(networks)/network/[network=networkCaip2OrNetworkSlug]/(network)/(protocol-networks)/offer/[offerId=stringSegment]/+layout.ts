// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import StellarOfferSchema from '$/schema/StellarOffer.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Stellar']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Stellar' && matchStringSegment(params.offerId)))
		error(404, 'Route mapping not applicable')

	const stellarOfferNetworkOfferIdSelector = parseRouteEntitySelector(
		schema,
		StellarOfferSchema,
		{
			$network: parentData.selector,
			offerId: params.offerId,
		},
		'NetworkOfferId'
	)
	if (stellarOfferNetworkOfferIdSelector instanceof arktype.errors)
		error(404, 'Invalid StellarOffer selector')

	return {
		selector: stellarOfferNetworkOfferIdSelector,
	}
}
