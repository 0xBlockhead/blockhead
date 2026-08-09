// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import PendleMarketSchema from '$/schema/PendleMarket.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchEvmAddress(params.marketAddress)))
		error(404, 'Route mapping not applicable')

	const pendleMarketNetworkMarketAddressSelector = parseEntitySelector(
		schema,
		PendleMarketSchema,
		{
			$network: parentData.selector,
			marketAddress: params.marketAddress,
		},
		'NetworkMarketAddress'
	)
	if (pendleMarketNetworkMarketAddressSelector instanceof arktype.errors)
		error(404, 'Invalid PendleMarket selector')

	return {
		selector: pendleMarketNetworkMarketAddressSelector,
	}
}
