// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import ZeroGStorageNodeSchema from '$/schema/ZeroGStorageNode.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['ZeroG']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'ZeroG' && matchEvmAddress(params.nodeId)))
		error(404, 'Route mapping not applicable')

	const zeroGStorageNodeNetworkNodeIdSelector = parseRouteEntitySelector(
		schema,
		ZeroGStorageNodeSchema,
		{
			$network: parentData.selector.$network,
			nodeId: params.nodeId,
		},
		'NetworkNodeId'
	)
	if (zeroGStorageNodeNetworkNodeIdSelector instanceof arktype.errors)
		error(404, 'Invalid ZeroGStorageNode selector')

	return {
		selector: zeroGStorageNodeNetworkNodeIdSelector,
	}
}
