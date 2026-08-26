// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEip155ChainId } from '$/params/eip155ChainId.ts'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import EvmActorCoinAllowanceSchema from '$/schema/EvmActorCoinAllowance.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(
		matchEip155ChainId(params.chainId)
		&& matchEvmAddress(params.owner)
		&& matchEvmAddress(params.coin)
		&& matchEvmAddress(params.spender)
	))
		error(404, 'Route mapping not applicable')

	const evmActorCoinAllowanceEvmAccountEvmContractSpenderInteropAddressSelector = parseRouteEntitySelector(
		schema,
		EvmActorCoinAllowanceSchema,
		{
			$actor: {
				interopAddress: 'eip155:' + String(Number(params.chainId)) + ':' + String(params.owner),
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
				interopAddress: 'eip155:' + String(Number(params.chainId)) + ':' + String(params.spender),
			},
			interopAddress: 'eip155:' + String(Number(params.chainId)) + ':' + String(params.owner),
		},
		'EvmAccountEvmContractSpenderInteropAddress'
	)
	if (evmActorCoinAllowanceEvmAccountEvmContractSpenderInteropAddressSelector instanceof arktype.errors)
		error(404, 'Invalid EvmActorCoinAllowance selector')

	return {
		selector: evmActorCoinAllowanceEvmAccountEvmContractSpenderInteropAddressSelector,
	}
}
