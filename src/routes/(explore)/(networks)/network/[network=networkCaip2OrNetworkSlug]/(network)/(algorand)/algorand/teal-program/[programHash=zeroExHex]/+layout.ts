// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchZeroExHex } from '$/params/zeroExHex.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AlgorandNetworkSchema from '$/schema/AlgorandNetwork.ts'
import AlgorandTealProgramSchema from '$/schema/AlgorandTealProgram.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Algorand']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Algorand' && matchZeroExHex(params.programHash)))
		error(404, 'Route mapping not applicable')

	const algorandNetworkNetworkParentSelector = parseRouteEntitySelector(
		schema,
		AlgorandNetworkSchema,
		parentData.selector,
		'Network'
	)
	if (algorandNetworkNetworkParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const algorandTealProgramNetworkProgramHashSelector = parseRouteEntitySelector(
		schema,
		AlgorandTealProgramSchema,
		{
			$network: algorandNetworkNetworkParentSelector,
			programHash: params.programHash,
		},
		'NetworkProgramHash'
	)
	if (algorandTealProgramNetworkProgramHashSelector instanceof arktype.errors)
		error(404, 'Invalid AlgorandTealProgram selector')

	return {
		selector: algorandTealProgramNetworkProgramHashSelector,
	}
}
