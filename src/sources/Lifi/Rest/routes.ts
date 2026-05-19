/**
 * LI.FI live quotes (`GET /v1/quote`) → {@link EntityType.BridgeRoute} + {@link EntityType.BridgeRouteStep}.
 * @see https://docs.li.fi/api-reference/get-a-quote-for-a-token-transfer
 */

import { BridgeRouteTag } from '$/schema/BridgeRoute.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { EntityId } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { throwIfHttpNotOk } from '$/lib/http.ts'
import { bridgeRouteStepEntityFieldsFromLifiQuoteStep } from '$/sources/Lifi/Rest/bridgeRouteSteps.ts'
import { lifiRestFetch } from '$/sources/Lifi/Rest/client.ts'
import type { LifiQuoteRequest, LifiQuoteStepWire } from '$/sources/Lifi/Rest/types.ts'
type BridgeRouteQuoteId = EntityId<typeof schema, EntityType.BridgeRoute>

type BridgeRouteStepRow = ReturnType<typeof bridgeRouteStepEntityFieldsFromLifiQuoteStep>

export type BridgeRouteResolverBundle = {
	routeFields: {
		$fromNetwork: { chainId: number }
		$toNetwork: { chainId: number }
		fromAmount: bigint
		toAmount: bigint
		toAmountMin: bigint
		gasCostUsd: number
		estimatedDurationSeconds: number
		tags: BridgeRouteTag[]
	}
	steps: BridgeRouteStepRow[]
}

const bridgeRouteQuoteIdToRequest = (
	quoteId: BridgeRouteQuoteId,
): LifiQuoteRequest => ({
	fromChain: quoteId.fromChainId,
	toChain: quoteId.toChainId,
	fromToken: quoteId.fromToken,
	toToken: quoteId.toToken,
	fromAmount: quoteId.fromAmount,
	fromAddress: quoteId.fromAddress,
	slippage: quoteId.slippage,
})

export const fetchLifiQuoteStep = async (
	params: LifiQuoteRequest,
	options?: { baseUrl?: string },
): Promise<LifiQuoteStepWire> => {
	const search = new URLSearchParams({
		fromChain: String(params.fromChain),
		toChain: String(params.toChain),
		fromToken: params.fromToken,
		toToken: params.toToken,
		fromAmount: params.fromAmount,
		fromAddress: params.fromAddress,
		...(params.toAddress != null && { toAddress: params.toAddress }),
		...(params.slippage != null && { slippage: String(params.slippage) }),
	})
	const path = `/v1/quote?${search}`
	const res = await lifiRestFetch(path, undefined, options)
	await throwIfHttpNotOk(res, path)
	return res.json<LifiQuoteStepWire>()
}

const gasCostUsdFromQuoteStep = (step: LifiQuoteStepWire) => (
	(step.estimate?.gasCosts ?? [])
		.reduce((sum, gas) => (
			sum + Number.parseFloat(gas.amountUSD ?? '0')
		), 0)
)

const bridgeRouteBundleFromQuoteStep = (
	quoteId: BridgeRouteQuoteId,
	step: LifiQuoteStepWire,
): BridgeRouteResolverBundle => {
	const fromAmount = BigInt(step.action.fromAmount ?? quoteId.fromAmount)
	const toAmount = BigInt(
		step.estimate?.toAmount
		?? step.action.toAmount
		?? quoteId.fromAmount,
	)
	const toAmountMin = BigInt(
		step.estimate?.toAmountMin
		?? step.estimate?.toAmount
		?? step.action.toAmount
		?? quoteId.fromAmount,
	)

	return {
		routeFields: {
			$fromNetwork: { chainId: step.action.fromChainId },
			$toNetwork: { chainId: step.action.toChainId },
			fromAmount,
			toAmount,
			toAmountMin,
			gasCostUsd: gasCostUsdFromQuoteStep(step),
			estimatedDurationSeconds: step.estimate?.executionDuration ?? 0,
			tags: [BridgeRouteTag.Recommended],
		},
		steps: [
			bridgeRouteStepEntityFieldsFromLifiQuoteStep(quoteId, 0, step),
		],
	}
}

const fetchBridgeRouteBundleOnce = async (
	quoteId: BridgeRouteQuoteId,
): Promise<BridgeRouteResolverBundle> => {
	const step = await fetchLifiQuoteStep(bridgeRouteQuoteIdToRequest(quoteId))
	return bridgeRouteBundleFromQuoteStep(quoteId, step)
}

export const fetchBridgeRouteBundleForQuoteId = singleFlight(
	fetchBridgeRouteBundleOnce,
)

export const resolveBridgeRouteBundleForQuoteId = (
	quoteId: BridgeRouteQuoteId,
) => (
	fetchBridgeRouteBundleForQuoteId(quoteId)
)

export const resolveBridgeRouteStepRowForEntityId = async (
	entityId: EntityId<typeof schema, EntityType.BridgeRouteStep>,
) => {
	const bundle = await resolveBridgeRouteBundleForQuoteId(entityId.$route)
	const step = bundle.steps[entityId.index]
	if (step == null) {
		throw new Error(
			`Lifi_Rest: BridgeRouteStep index ${entityId.index} missing on quote route`,
		)
	}
	return step
}
