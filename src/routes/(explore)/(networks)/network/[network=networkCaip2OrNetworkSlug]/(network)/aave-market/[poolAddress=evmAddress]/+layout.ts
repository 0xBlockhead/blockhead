// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { match as matchNetworkCaip2 } from '$/params/networkCaip2.ts'
import { match as matchNetworkSlug } from '$/params/networkSlug.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import AaveMarketSchema from '$/schema/AaveMarket.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Evm']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			(
				parentData.projectionNetwork.executionModels !== undefined
				&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
			)
			&& parentData.projectionNetwork.namespace === 'Evm'
		)
		&& matchEvmAddress(params.poolAddress)
		&& (matchNetworkCaip2(params.network) || matchNetworkSlug(params.network))
	))
		error(404, 'Route mapping not applicable')

	const aaveMarketNetworkPoolAddressSelector = parseEntitySelector(
		schema,
		AaveMarketSchema,
		{
			$network: {
				caip2: parentData.projectionNetwork.caip2,
			},
			poolAddress: params.poolAddress,
		},
		'NetworkPoolAddress'
	)
	if (aaveMarketNetworkPoolAddressSelector instanceof arktype.errors)
		error(404, 'Invalid AaveMarket selector')

	return {
		selector: aaveMarketNetworkPoolAddressSelector,
	}
}
