// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import ZeroGDaNodeSchema from '$/schema/ZeroGDaNode.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['ZeroG']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'ZeroG' && matchStringSegment(params.nodeId)))
		error(404, 'Route mapping not applicable')

	const zeroGDaNodeNetworkNodeIdSelector = parseEntitySelector(
		schema,
		ZeroGDaNodeSchema,
		{
			$network: parentData.selector,
			nodeId: params.nodeId,
		},
		'NetworkNodeId'
	)
	if (zeroGDaNodeNetworkNodeIdSelector instanceof arktype.errors)
		error(404, 'Invalid ZeroGDaNode selector')

	return {
		selector: zeroGDaNodeNetworkNodeIdSelector,
	}
}
