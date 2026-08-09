// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEip155ChainId } from '$/params/eip155ChainId.ts'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmNetworkActorCoinBalanceSchema from '$/schema/EvmNetworkActorCoinBalance.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchEvmAddress(params.owner) && matchEip155ChainId(params.chainId)))
		error(404, 'Route mapping not applicable')

	const evmNetworkActorCoinBalanceEvmAccountNativeCoinInstanceSelector = parseEntitySelector(
		schema,
		EvmNetworkActorCoinBalanceSchema,
		{
			$actor: {
				address: params.owner,
			},
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: params.chainId,
				},
			},
		},
		'EvmAccountNativeCoinInstance'
	)
	if (evmNetworkActorCoinBalanceEvmAccountNativeCoinInstanceSelector instanceof arktype.errors)
		error(404, 'Invalid EvmNetworkActorCoinBalance selector')

	return {
		selector: evmNetworkActorCoinBalanceEvmAccountNativeCoinInstanceSelector,
	}
}
