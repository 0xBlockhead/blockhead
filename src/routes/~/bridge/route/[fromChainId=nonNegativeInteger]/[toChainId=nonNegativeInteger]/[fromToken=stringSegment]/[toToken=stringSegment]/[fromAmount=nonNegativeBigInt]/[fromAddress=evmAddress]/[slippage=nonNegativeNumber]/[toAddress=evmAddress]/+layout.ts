// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchNonNegativeNumber } from '$/params/nonNegativeNumber.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BridgeRouteSchema from '$/schema/BridgeRoute.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(
		matchNonNegativeInteger(params.fromChainId)
		&& matchNonNegativeInteger(params.toChainId)
		&& matchStringSegment(params.fromToken)
		&& matchStringSegment(params.toToken)
		&& matchNonNegativeBigInt(params.fromAmount)
		&& matchEvmAddress(params.fromAddress)
		&& matchNonNegativeNumber(params.slippage)
		&& matchEvmAddress(params.toAddress)
	))
		error(404, 'Route mapping not applicable')

	const bridgeRouteQuoteSelector = parseEntitySelector(
		schema,
		BridgeRouteSchema,
		{
			fromChainId: Number(params.fromChainId),
			toChainId: Number(params.toChainId),
			fromToken: params.fromToken,
			toToken: params.toToken,
			fromAmount: BigInt(params.fromAmount),
			fromAddress: params.fromAddress,
			slippage: Number(params.slippage),
			toAddress: params.toAddress,
		},
		'Quote'
	)
	if (bridgeRouteQuoteSelector instanceof arktype.errors)
		error(404, 'Invalid BridgeRoute selector')

	return {
		selector: bridgeRouteQuoteSelector,
	}
}
