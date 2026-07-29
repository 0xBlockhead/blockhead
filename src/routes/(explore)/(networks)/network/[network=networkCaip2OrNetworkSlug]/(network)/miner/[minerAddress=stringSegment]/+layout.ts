// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import FilecoinMinerSchema from '$/schema/FilecoinMiner.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Filecoin']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Filecoin' && matchStringSegment(params.minerAddress)))
		error(404, 'Route mapping not applicable')

	const filecoinMinerNetworkMinerAddressSelector = parseEntitySelector(
		schema,
		FilecoinMinerSchema,
		{
			$network: parentData.selector,
			minerAddress: params.minerAddress,
		}
	)
	if (filecoinMinerNetworkMinerAddressSelector instanceof arktype.errors)
		error(404, 'Invalid FilecoinMiner selector')

	return {
		selector: filecoinMinerNetworkMinerAddressSelector,
	}
}
