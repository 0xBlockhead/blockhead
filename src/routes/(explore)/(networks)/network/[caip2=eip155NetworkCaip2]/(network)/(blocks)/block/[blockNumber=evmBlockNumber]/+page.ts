// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmBlockSchema from '$/schema/EvmBlock.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const evmBlockSelector = parseEntitySelector(
		schema,
		EvmBlockSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			blockNumber: BigInt(params.blockNumber),
		}
	)
	if (evmBlockSelector instanceof arktype.errors) error(404, 'Invalid EvmBlock selector')

	return {
		selector: evmBlockSelector,
	}
}
