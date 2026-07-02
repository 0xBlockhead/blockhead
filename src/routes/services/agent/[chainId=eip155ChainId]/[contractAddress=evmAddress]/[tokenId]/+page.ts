// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmNftSchema from '$/schema/EvmNft.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const evmNftSelector = parseEntitySelector(
		schema,
		EvmNftSchema,
		{
			$contract: {
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: params.chainId,
					},
				},
				address: params.contractAddress,
			},
			tokenId: decodeURIComponent(params.tokenId),
		}
	)
	if (evmNftSelector instanceof arktype.errors) error(404, 'Invalid EvmNft selector')

	return {
		selector: evmNftSelector,
	}
}
