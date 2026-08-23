// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import ZeroGServiceProviderSchema from '$/schema/ZeroGServiceProvider.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['ZeroG']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'ZeroG' && matchStringSegment(params.providerId)))
		error(404, 'Route mapping not applicable')

	const zeroGServiceProviderNetworkProviderIdSelector = parseEntitySelector(
		schema,
		ZeroGServiceProviderSchema,
		{
			$network: parentData.selector.$network,
			providerId: params.providerId,
		},
		'NetworkProviderId'
	)
	if (zeroGServiceProviderNetworkProviderIdSelector instanceof arktype.errors)
		error(404, 'Invalid ZeroGServiceProvider selector')

	return {
		selector: zeroGServiceProviderNetworkProviderIdSelector,
	}
}
