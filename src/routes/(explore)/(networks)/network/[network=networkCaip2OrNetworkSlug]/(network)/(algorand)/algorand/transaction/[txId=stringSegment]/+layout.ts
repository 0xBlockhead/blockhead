// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import AlgorandTransactionSchema from '$/schema/AlgorandTransaction.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Algorand']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Algorand' && matchStringSegment(params.txId)))
		error(404, 'Route mapping not applicable')

	const algorandTransactionNetworkTxIdSelector = parseEntitySelector(
		schema,
		AlgorandTransactionSchema,
		{
			$network: parentData.selector,
			txId: params.txId,
		},
		'NetworkTxId'
	)
	if (algorandTransactionNetworkTxIdSelector instanceof arktype.errors)
		error(404, 'Invalid AlgorandTransaction selector')

	return {
		selector: algorandTransactionNetworkTxIdSelector,
	}
}
