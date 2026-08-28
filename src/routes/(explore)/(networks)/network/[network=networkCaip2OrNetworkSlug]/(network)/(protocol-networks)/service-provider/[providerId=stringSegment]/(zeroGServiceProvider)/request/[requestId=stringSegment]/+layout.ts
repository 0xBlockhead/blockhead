// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import ZeroGServiceProviderSchema from '$/schema/ZeroGServiceProvider.ts'
import ZeroGServiceRequestSchema from '$/schema/ZeroGServiceRequest.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['ZeroG']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'ZeroG' && matchStringSegment(params.requestId)))
		error(404, 'Route mapping not applicable')

	const zeroGServiceProviderNetworkProviderIdParentSelector = parseRouteEntitySelector(
		schema,
		ZeroGServiceProviderSchema,
		parentData.selector,
		'NetworkProviderId'
	)
	if (zeroGServiceProviderNetworkProviderIdParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const zeroGServiceRequestZeroGServiceProviderRequestIdSelector = parseRouteEntitySelector(
		schema,
		ZeroGServiceRequestSchema,
		{
			$serviceProvider: zeroGServiceProviderNetworkProviderIdParentSelector,
			requestId: params.requestId,
		},
		'ZeroGServiceProviderRequestId'
	)
	if (zeroGServiceRequestZeroGServiceProviderRequestIdSelector instanceof arktype.errors)
		error(404, 'Invalid ZeroGServiceRequest selector')

	return {
		selector: zeroGServiceRequestZeroGServiceProviderRequestIdSelector,
	}
}
