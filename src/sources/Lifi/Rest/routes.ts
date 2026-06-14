/**
 * LI.FI live quotes (`GET /v1/quote`) → {@link EntityType.BridgeRoute} + {@link EntityType.BridgeRouteStep}.
 * @see https://docs.li.fi/api-reference/get-a-quote-for-a-token-transfer
 */

import { BridgeRouteTag } from '$/schema/BridgeRoute.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { throwIfHttpNotOk } from '$/lib/http.ts'
import { bridgeRouteStepEntityFieldsFromLifiQuoteStep } from '$/sources/Lifi/Rest/bridgeRouteSteps.ts'
import { lifiRestFetch } from '$/sources/Lifi/Rest/client.ts'
import type {
	LifiQuoteRequest,
	LifiQuoteStep,
	LifiQuoteStepLike,
} from '$/sources/Lifi/Rest/types.ts'
type BridgeRouteQuoteId = EntitySelector<typeof schema, EntityType.BridgeRoute>

type BridgeRouteStepFields = ReturnType<typeof bridgeRouteStepEntityFieldsFromLifiQuoteStep>

export type BridgeRouteResolverBundle = {
	routeFields: {
		$fromNetwork: { [EntityMetaKey.Selector]: { caip2: { namespace: 'eip155', reference: string } } }
		$toNetwork: { [EntityMetaKey.Selector]: { caip2: { namespace: 'eip155', reference: string } } }
		fromAmount: bigint
		toAmount: bigint
		toAmountMin: bigint
		estimatedCostUsd: number
		estimatedDurationSeconds: number
		tags: BridgeRouteTag[]
	}
	steps: BridgeRouteStepFields[]
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
	toAddress: quoteId.toAddress,
})

export const fetchLifiQuoteStep = async (
	params: LifiQuoteRequest,
	options?: { baseUrl?: string },
): Promise<LifiQuoteStep> => {
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
	return res.json<LifiQuoteStep>()
}

const parseLifiQuoteAmountBigInt = (
	value: string | undefined,
	label: string,
	fallback?: string,
) => {
	const raw = (value ?? fallback ?? '').trim()
	if (!/^\d+$/.test(raw)) {
		throw new Error(`Lifi_Rest: invalid ${label} amount ${JSON.stringify(raw)}`)
	}
	return BigInt(raw)
}

const usdSumFromCostRows = (
	rows: readonly { amountUSD?: string }[] | undefined,
) => (
	(rows ?? [])
		.reduce((sum, row) => {
			const parsed = Number.parseFloat(row.amountUSD ?? '0')
			return sum + (Number.isFinite(parsed) ? parsed : 0)
		}, 0)
)

const estimatedCostUsdFromQuoteStep = (step: LifiQuoteStep) => (
	usdSumFromCostRows(step.estimate?.gasCosts)
	+ usdSumFromCostRows(step.estimate?.feeCosts)
)

const lifiQuoteStepsForRoute = (
	step: LifiQuoteStep,
): LifiQuoteStepLike[] => (
	step.includedSteps != null && step.includedSteps.length > 0 ?
		step.includedSteps
	:
		[step]
)

const bridgeRouteBundleFromQuoteStep = (
	quoteId: BridgeRouteQuoteId,
	step: LifiQuoteStep,
): BridgeRouteResolverBundle => {
	const fromAmount = parseLifiQuoteAmountBigInt(
		step.action.fromAmount,
		'from',
		quoteId.fromAmount,
	)
	const toAmount = parseLifiQuoteAmountBigInt(
		step.estimate?.toAmount
		?? step.action.toAmount,
		'to',
	)
	const toAmountMin = parseLifiQuoteAmountBigInt(
		step.estimate?.toAmountMin
		?? step.estimate?.toAmount
		?? step.action.toAmount,
		'toAmountMin',
	)

	return {
		routeFields: {
				$fromNetwork: {
					[EntityMetaKey.Selector]: { caip2: { namespace: 'eip155' as const, reference: String(step.action.fromChainId) } },
				},
				$toNetwork: {
					[EntityMetaKey.Selector]: { caip2: { namespace: 'eip155' as const, reference: String(step.action.toChainId) } },
				},
			fromAmount,
			toAmount,
			toAmountMin,
			estimatedCostUsd: estimatedCostUsdFromQuoteStep(step),
			estimatedDurationSeconds: step.estimate?.executionDuration ?? 0,
			tags: [],
		},
		steps: lifiQuoteStepsForRoute(step).map((routeStep, index) => (
			bridgeRouteStepEntityFieldsFromLifiQuoteStep(quoteId, index, routeStep)
		)),
	}
}

export const fetchBridgeRouteBundleForQuoteId = async (
	quoteId: BridgeRouteQuoteId,
): Promise<BridgeRouteResolverBundle> => {
	const step = await fetchLifiQuoteStep(bridgeRouteQuoteIdToRequest(quoteId))
	return bridgeRouteBundleFromQuoteStep(quoteId, step)
}

export const resolveBridgeRouteBundleForQuoteId = (
	quoteId: BridgeRouteQuoteId,
) => (
	fetchBridgeRouteBundleForQuoteId(quoteId)
)

export const resolveBridgeRouteStepFieldsForEntitySelector = async (
	entitySelector: EntitySelector<typeof schema, EntityType.BridgeRouteStep>,
) => {
	const bundle = await resolveBridgeRouteBundleForQuoteId(entitySelector.$route)
	const step = bundle.steps[entitySelector.index]
	if (step == null) {
		throw new Error(
			`Lifi_Rest: BridgeRouteStep index ${entitySelector.index} missing on quote route`,
		)
	}
	return step
}
