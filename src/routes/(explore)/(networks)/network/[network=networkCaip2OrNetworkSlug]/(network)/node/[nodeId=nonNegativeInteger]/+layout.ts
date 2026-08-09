// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import HederaNodeSchema from '$/schema/HederaNode.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Hedera']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Hedera' && matchNonNegativeInteger(params.nodeId)))
		error(404, 'Route mapping not applicable')

	const hederaNodeNetworkNodeIdSelector = parseEntitySelector(
		schema,
		HederaNodeSchema,
		{
			$network: parentData.selector,
			nodeId: Number(params.nodeId),
		},
		'NetworkNodeId'
	)
	if (hederaNodeNetworkNodeIdSelector instanceof arktype.errors)
		error(404, 'Invalid HederaNode selector')

	return {
		selector: hederaNodeNetworkNodeIdSelector,
	}
}
