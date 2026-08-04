// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import AaveMarketSchema from '$/schema/AaveMarket.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Evm']
export const load: PageLoad = async ({ params, parent }) => {
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
	))
		error(404, 'Route mapping not applicable')

	const aaveMarketNetworkPoolAddressSelector = parseEntitySelector(
		schema,
		AaveMarketSchema,
		{
			$network: parentData.selector,
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
