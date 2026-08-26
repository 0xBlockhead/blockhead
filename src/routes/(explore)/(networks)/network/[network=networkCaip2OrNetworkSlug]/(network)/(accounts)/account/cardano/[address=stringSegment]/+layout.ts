// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import CardanoAddressSchema from '$/schema/CardanoAddress.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Cardano']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Cardano' && matchStringSegment(params.address)))
		error(404, 'Route mapping not applicable')

	const cardanoAddressNetworkAddressSelector = parseRouteEntitySelector(
		schema,
		CardanoAddressSchema,
		{
			$network: parentData.selector,
			address: params.address,
		},
		'NetworkAddress'
	)
	if (cardanoAddressNetworkAddressSelector instanceof arktype.errors)
		error(404, 'Invalid CardanoAddress selector')

	return {
		selector: cardanoAddressNetworkAddressSelector,
	}
}
