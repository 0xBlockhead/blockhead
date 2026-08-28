// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import StarknetNetworkSchema from '$/schema/StarknetNetwork.ts'
import StarknetTransactionSchema from '$/schema/StarknetTransaction.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Starknet']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Starknet' && matchStringSegment(params.transactionHash)))
		error(404, 'Route mapping not applicable')

	const starknetNetworkNetworkParentSelector = parseRouteEntitySelector(
		schema,
		StarknetNetworkSchema,
		parentData.selector,
		'Network'
	)
	if (starknetNetworkNetworkParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const starknetTransactionNetworkTransactionHashSelector = parseRouteEntitySelector(
		schema,
		StarknetTransactionSchema,
		{
			$network: starknetNetworkNetworkParentSelector,
			transactionHash: params.transactionHash,
		},
		'NetworkTransactionHash'
	)
	if (starknetTransactionNetworkTransactionHashSelector instanceof arktype.errors)
		error(404, 'Invalid StarknetTransaction selector')

	return {
		selector: starknetTransactionNetworkTransactionHashSelector,
	}
}
