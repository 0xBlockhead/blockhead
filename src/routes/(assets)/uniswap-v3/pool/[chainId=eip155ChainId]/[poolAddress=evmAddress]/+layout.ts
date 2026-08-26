// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEip155ChainId } from '$/params/eip155ChainId.ts'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import UniswapV3PoolSchema from '$/schema/UniswapV3Pool.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchEvmAddress(params.poolAddress) && matchEip155ChainId(params.chainId)))
		error(404, 'Route mapping not applicable')

	const uniswapV3PoolNetworkPoolAddressSelector = parseRouteEntitySelector(
		schema,
		UniswapV3PoolSchema,
		{
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: params.chainId,
				},
			},
			poolAddress: params.poolAddress,
		},
		'NetworkPoolAddress'
	)
	if (uniswapV3PoolNetworkPoolAddressSelector instanceof arktype.errors)
		error(404, 'Invalid UniswapV3Pool selector')

	return {
		selector: uniswapV3PoolNetworkPoolAddressSelector,
	}
}
