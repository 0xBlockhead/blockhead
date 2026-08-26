// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BnbBeaconNetworkSchema from '$/schema/BnbBeaconNetwork.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['BnbBeacon']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.slug === 'bnb-beacon'))
		error(404, 'Route mapping not applicable')

	const bnbBeaconNetworkNetworkSelector = parseRouteEntitySelector(
		schema,
		BnbBeaconNetworkSchema,
		{
			$network: parentData.selector,
		},
		'Network'
	)
	if (bnbBeaconNetworkNetworkSelector instanceof arktype.errors)
		error(404, 'Invalid BnbBeaconNetwork selector')

	return {
		selector: bnbBeaconNetworkNetworkSelector,
	}
}
