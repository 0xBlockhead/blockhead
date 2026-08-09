// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import ZeroGConsensusNetworkSchema from '$/schema/ZeroGConsensusNetwork.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['ZeroG']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'ZeroG' && matchStringSegment(params.consensusNetworkId)))
		error(404, 'Route mapping not applicable')

	const zeroGConsensusNetworkNetworkConsensusNetworkIdSelector = parseEntitySelector(
		schema,
		ZeroGConsensusNetworkSchema,
		{
			$network: parentData.selector,
			consensusNetworkId: params.consensusNetworkId,
		},
		'NetworkConsensusNetworkId'
	)
	if (zeroGConsensusNetworkNetworkConsensusNetworkIdSelector instanceof arktype.errors)
		error(404, 'Invalid ZeroGConsensusNetwork selector')

	return {
		selector: zeroGConsensusNetworkNetworkConsensusNetworkIdSelector,
	}
}
