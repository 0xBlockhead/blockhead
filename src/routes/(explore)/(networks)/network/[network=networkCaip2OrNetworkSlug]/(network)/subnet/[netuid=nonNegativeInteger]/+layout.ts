// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BittensorSubnetSchema from '$/schema/BittensorSubnet.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Bittensor']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Bittensor' && matchNonNegativeInteger(params.netuid)))
		error(404, 'Route mapping not applicable')

	const bittensorSubnetNetworkNetuidSelector = parseEntitySelector(
		schema,
		BittensorSubnetSchema,
		{
			$network: parentData.selector,
			netuid: Number(params.netuid),
		},
		'NetworkNetuid'
	)
	if (bittensorSubnetNetworkNetuidSelector instanceof arktype.errors)
		error(404, 'Invalid BittensorSubnet selector')

	return {
		selector: bittensorSubnetNetworkNetuidSelector,
	}
}
