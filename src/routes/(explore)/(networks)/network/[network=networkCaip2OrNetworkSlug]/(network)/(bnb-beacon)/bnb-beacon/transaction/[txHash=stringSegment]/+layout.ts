// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BnbBeaconNetworkSchema from '$/schema/BnbBeaconNetwork.ts'
import BnbBeaconTransactionSchema from '$/schema/BnbBeaconTransaction.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['BnbBeacon']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.slug === 'bnb-beacon' && matchStringSegment(params.txHash)))
		error(404, 'Route mapping not applicable')

	const bnbBeaconNetworkNetworkParentSelector = parseRouteEntitySelector(
		schema,
		BnbBeaconNetworkSchema,
		parentData.selector,
		'Network'
	)
	if (bnbBeaconNetworkNetworkParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const bnbBeaconTransactionNetworkTxHashSelector = parseRouteEntitySelector(
		schema,
		BnbBeaconTransactionSchema,
		{
			$network: bnbBeaconNetworkNetworkParentSelector,
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
