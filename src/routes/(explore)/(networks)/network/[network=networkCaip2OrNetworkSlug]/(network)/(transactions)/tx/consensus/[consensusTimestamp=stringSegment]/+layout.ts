// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import HederaTransactionSchema from '$/schema/HederaTransaction.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Hedera']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Hedera' && matchStringSegment(params.consensusTimestamp)))
		error(404, 'Route mapping not applicable')

	const hederaTransactionNetworkConsensusTimestampSelector = parseRouteEntitySelector(
		schema,
		HederaTransactionSchema,
		{
			$network: parentData.selector,
			consensusTimestamp: params.consensusTimestamp,
		},
		'NetworkConsensusTimestamp'
	)
	if (hederaTransactionNetworkConsensusTimestampSelector instanceof arktype.errors)
		error(404, 'Invalid HederaTransaction selector')

	return {
		selector: hederaTransactionNetworkConsensusTimestampSelector,
	}
}
