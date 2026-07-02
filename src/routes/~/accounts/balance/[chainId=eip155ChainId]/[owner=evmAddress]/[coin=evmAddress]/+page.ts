// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmNetworkActorCoinBalanceSchema from '$/schema/EvmNetworkActorCoinBalance.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const evmNetworkActorCoinBalanceSelector = parseEntitySelector(
		schema,
		EvmNetworkActorCoinBalanceSchema,
		{
			$actor: {
				interopAddress: 'eip155:' + String(params.chainId) + ':' + String(params.owner),
			},
			$contract: {
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: params.chainId,
					},
				},
				address: params.coin,
			},
		}
	)
	if (evmNetworkActorCoinBalanceSelector instanceof arktype.errors) error(404, 'Invalid EvmNetworkActorCoinBalance selector')

	return {
		selector: evmNetworkActorCoinBalanceSelector,
	}
}
