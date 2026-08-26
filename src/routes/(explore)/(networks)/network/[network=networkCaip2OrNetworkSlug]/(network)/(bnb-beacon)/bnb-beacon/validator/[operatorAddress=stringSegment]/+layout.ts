// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BnbValidatorSchema from '$/schema/BnbValidator.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['BnbBeacon']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.slug === 'bnb-beacon' && matchStringSegment(params.operatorAddress)))
		error(404, 'Route mapping not applicable')

	const bnbValidatorNetworkOperatorAddressSelector = parseRouteEntitySelector(
		schema,
		BnbValidatorSchema,
		{
			$network: parentData.selector,
			operatorAddress: params.operatorAddress,
		},
		'NetworkOperatorAddress'
	)
	if (bnbValidatorNetworkOperatorAddressSelector instanceof arktype.errors)
		error(404, 'Invalid BnbValidator selector')

	return {
		selector: bnbValidatorNetworkOperatorAddressSelector,
	}
}
