// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AaveAccountMarketSchema from '$/schema/AaveAccountMarket.ts'
import EvmNetworkAccountSchema from '$/schema/EvmNetworkAccount.ts'
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
	))
		error(404, 'Route mapping not applicable')

	const evmNetworkAccountEvmNetworkEvmAccountParentSelector = parseRouteEntitySelector(
		schema,
		EvmNetworkAccountSchema,
		parentData.selector,
		'EvmNetworkEvmAccount'
	)
	if (evmNetworkAccountEvmNetworkEvmAccountParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const aaveAccountMarketAccountMarketSelector = parseRouteEntitySelector(
		schema,
		AaveAccountMarketSchema,
		{
			$account: evmNetworkAccountEvmNetworkEvmAccountParentSelector,
			$market: {
				$network: evmNetworkAccountEvmNetworkEvmAccountParentSelector.$network,
				poolAddress: params.poolAddress,
			},
		},
		'AccountMarket'
	)
	if (aaveAccountMarketAccountMarketSelector instanceof arktype.errors)
		error(404, 'Invalid AaveAccountMarket selector')

	return {
		selector: aaveAccountMarketAccountMarketSelector,
	}
}
