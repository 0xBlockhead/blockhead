// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BridgeRouteStepSchema from '$/schema/BridgeRouteStep.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const bridgeRouteStepSelector = parseEntitySelector(
		schema,
		BridgeRouteStepSchema,
		{
			$route: {
				fromChainId: Number(params.fromChainId),
				toChainId: Number(params.toChainId),
				fromToken: decodeURIComponent(params.fromToken),
				toToken: decodeURIComponent(params.toToken),
				fromAmount: BigInt(params.fromAmount),
				fromAddress: decodeURIComponent(params.fromAddress),
				slippage: Number(params.slippage),
				toAddress: decodeURIComponent(params.toAddress),
			},
			indexInRoute: Number(params.stepIndex),
		}
	)
	if (bridgeRouteStepSelector instanceof arktype.errors) error(404, 'Invalid BridgeRouteStep selector')

	return {
		selector: bridgeRouteStepSelector,
	}
}
