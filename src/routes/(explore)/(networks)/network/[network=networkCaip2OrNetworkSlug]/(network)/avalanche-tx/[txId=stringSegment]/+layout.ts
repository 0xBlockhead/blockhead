// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AvalanchePChainTransactionSchema from '$/schema/AvalanchePChainTransaction.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Avalanche']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Avalanche' && matchStringSegment(params.txId)))
		error(404, 'Route mapping not applicable')

	const avalanchePChainTransactionNetworkTxIdSelector = parseRouteEntitySelector(
		schema,
		AvalanchePChainTransactionSchema,
		{
			$network: parentData.selector,
			txId: params.txId,
		},
		'NetworkTxId'
	)
	if (avalanchePChainTransactionNetworkTxIdSelector instanceof arktype.errors)
		error(404, 'Invalid AvalanchePChainTransaction selector')

	return {
		selector: avalanchePChainTransactionNetworkTxIdSelector,
	}
}
