// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import IcpNetworkSchema from '$/schema/IcpNetwork.ts'
import IcpSubnetSchema from '$/schema/IcpSubnet.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['InternetComputer']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'InternetComputer' && matchStringSegment(params.subnetId)))
		error(404, 'Route mapping not applicable')

	const icpNetworkNetworkParentSelector = parseRouteEntitySelector(
		schema,
		IcpNetworkSchema,
		parentData.selector,
		'Network'
	)
	if (icpNetworkNetworkParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const icpSubnetNetworkSubnetIdSelector = parseRouteEntitySelector(
		schema,
		IcpSubnetSchema,
		{
			$network: icpNetworkNetworkParentSelector,
			subnetId: params.subnetId,
		},
		'NetworkSubnetId'
	)
	if (icpSubnetNetworkSubnetIdSelector instanceof arktype.errors)
		error(404, 'Invalid IcpSubnet selector')

	return {
		selector: icpSubnetNetworkSubnetIdSelector,
	}
}
