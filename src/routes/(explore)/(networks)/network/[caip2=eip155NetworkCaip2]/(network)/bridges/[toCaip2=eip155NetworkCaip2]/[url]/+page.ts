// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmNetworkBridgeSchema from '$/schema/EvmNetworkBridge.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const evmNetworkBridgeSelector = parseEntitySelector(
		schema,
		EvmNetworkBridgeSchema,
		{
			$fromNetwork: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			$toNetwork: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.toCaip2)),
			},
			url: decodeURIComponent(params.url),
		}
	)
	if (evmNetworkBridgeSelector instanceof arktype.errors) error(404, 'Invalid EvmNetworkBridge selector')

	return {
		selector: evmNetworkBridgeSelector,
	}
}
