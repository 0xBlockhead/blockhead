// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmActorCoinAllowanceSchema from '$/schema/EvmActorCoinAllowance.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const evmActorCoinAllowanceSelector = parseEntitySelector(
		schema,
		EvmActorCoinAllowanceSchema,
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
			$spender: {
				interopAddress: 'eip155:' + String(params.chainId) + ':' + String(params.spender),
			},
			interopAddress: 'eip155:' + String(params.chainId) + ':' + String(params.owner),
		}
	)
	if (evmActorCoinAllowanceSelector instanceof arktype.errors) error(404, 'Invalid EvmActorCoinAllowance selector')

	return {
		selector: evmActorCoinAllowanceSelector,
	}
}
