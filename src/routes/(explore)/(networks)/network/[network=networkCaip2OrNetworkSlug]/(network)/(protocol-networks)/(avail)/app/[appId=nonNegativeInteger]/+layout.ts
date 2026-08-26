// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AvailAppIdSchema from '$/schema/AvailAppId.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Avail']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Avail' && matchNonNegativeInteger(params.appId)))
		error(404, 'Route mapping not applicable')

	const availAppIdNetworkAppIdSelector = parseRouteEntitySelector(
		schema,
		AvailAppIdSchema,
		{
			$network: parentData.selector,
			appId: Number(params.appId),
		},
		'NetworkAppId'
	)
	if (availAppIdNetworkAppIdSelector instanceof arktype.errors)
		error(404, 'Invalid AvailAppId selector')

	return {
		selector: availAppIdNetworkAppIdSelector,
	}
}
