// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EigenLayerStrategySchema from '$/schema/EigenLayerStrategy.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchEvmAddress(params.strategyAddress)))
		error(404, 'Route mapping not applicable')

	const eigenLayerStrategyNetworkStrategyAddressSelector = parseEntitySelector(
		schema,
		EigenLayerStrategySchema,
		{
			$network: parentData.selector.$network,
			strategyAddress: params.strategyAddress,
		},
		'NetworkStrategyAddress'
	)
	if (eigenLayerStrategyNetworkStrategyAddressSelector instanceof arktype.errors)
		error(404, 'Invalid EigenLayerStrategy selector')

	return {
		selector: eigenLayerStrategyNetworkStrategyAddressSelector,
	}
}
