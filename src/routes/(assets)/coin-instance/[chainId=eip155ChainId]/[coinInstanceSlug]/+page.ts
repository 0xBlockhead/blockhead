// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmCoinInstanceSchema from '$/schema/EvmCoinInstance.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const evmCoinInstanceSelector = parseEntitySelector(
		schema,
		EvmCoinInstanceSchema,
		(
		decodeURIComponent(params.coinInstanceSlug) === 'native' ?
			{
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: params.chainId,
					},
				},
				type: 'NativeCurrency',
			}
		:
			{
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: params.chainId,
					},
				},
				type: 'Erc20Token',
				$contract: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: params.chainId,
						},
					},
					address: decodeURIComponent(params.coinInstanceSlug),
				},
			}
		)
	)
	if (evmCoinInstanceSelector instanceof arktype.errors) error(404, 'Invalid EvmCoinInstance selector')

	return {
		selector: evmCoinInstanceSelector,
	}
}
