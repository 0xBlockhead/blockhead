// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BnbBeaconTransactionSchema from '$/schema/BnbBeaconTransaction.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['BnbBeacon']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.slug === 'bnb-beacon' && matchStringSegment(params.txHash)))
		error(404, 'Route mapping not applicable')

	const bnbBeaconTransactionNetworkTxHashSelector = parseRouteEntitySelector(
		schema,
		BnbBeaconTransactionSchema,
		{
			$network: parentData.selector,
			txHash: params.txHash,
		},
		'NetworkTxHash'
	)
	if (bnbBeaconTransactionNetworkTxHashSelector instanceof arktype.errors)
		error(404, 'Invalid BnbBeaconTransaction selector')

	return {
		selector: bnbBeaconTransactionNetworkTxHashSelector,
	}
}
