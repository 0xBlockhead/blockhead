// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import IcpRequestStatusSchema from '$/schema/IcpRequestStatus.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['InternetComputer']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'InternetComputer' && matchStringSegment(params.requestId)))
		error(404, 'Route mapping not applicable')

	const icpRequestStatusNetworkRequestIdSelector = parseRouteEntitySelector(
		schema,
		IcpRequestStatusSchema,
		{
			$network: parentData.selector,
			requestId: params.requestId,
		},
		'NetworkRequestId'
	)
	if (icpRequestStatusNetworkRequestIdSelector instanceof arktype.errors)
		error(404, 'Invalid IcpRequestStatus selector')

	return {
		selector: icpRequestStatusNetworkRequestIdSelector,
	}
}
