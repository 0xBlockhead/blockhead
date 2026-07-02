// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BridgeRouteSchema from '$/schema/BridgeRoute.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const bridgeRouteSelector = parseEntitySelector(
		schema,
		BridgeRouteSchema,
		{
			fromChainId: Number(params.fromChainId),
			toChainId: Number(params.toChainId),
			fromToken: decodeURIComponent(params.fromToken),
			toToken: decodeURIComponent(params.toToken),
			fromAmount: BigInt(params.fromAmount),
			fromAddress: decodeURIComponent(params.fromAddress),
			slippage: Number(params.slippage),
			toAddress: decodeURIComponent(params.toAddress),
		}
	)
	if (bridgeRouteSelector instanceof arktype.errors) error(404, 'Invalid BridgeRoute selector')

	return {
		selector: bridgeRouteSelector,
	}
}
