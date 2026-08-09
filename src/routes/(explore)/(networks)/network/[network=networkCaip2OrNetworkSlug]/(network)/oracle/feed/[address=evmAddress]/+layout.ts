// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import OracleFeedSchema from '$/schema/OracleFeed.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchEvmAddress(params.address)))
		error(404, 'Route mapping not applicable')

	const oracleFeedEvmNetworkAddressSelector = parseEntitySelector(
		schema,
		OracleFeedSchema,
		{
			$network: parentData.selector,
			address: params.address,
		},
		'EvmNetworkAddress'
	)
	if (oracleFeedEvmNetworkAddressSelector instanceof arktype.errors)
		error(404, 'Invalid OracleFeed selector')

	return {
		selector: oracleFeedEvmNetworkAddressSelector,
	}
}
