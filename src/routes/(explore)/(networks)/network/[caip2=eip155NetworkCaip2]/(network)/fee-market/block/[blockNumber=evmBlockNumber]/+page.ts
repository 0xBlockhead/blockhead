// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmNetwork_GasFee_BlockSchema from '$/schema/EvmNetwork_GasFee_Block.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const evmNetworkGasFeeBlockSelector = parseEntitySelector(
		schema,
		EvmNetwork_GasFee_BlockSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			blockNumber: BigInt(params.blockNumber),
		}
	)
	if (evmNetworkGasFeeBlockSelector instanceof arktype.errors) error(404, 'Invalid EvmNetwork_GasFee_Block selector')

	return {
		selector: evmNetworkGasFeeBlockSelector,
	}
}
