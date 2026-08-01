/**
 * LI.FI live quotes (`GET /v1/quote`) → {@link EntityType.BridgeRoute} + {@link EntityType.BridgeRouteStep}.
 * @see https://docs.li.fi/api-reference/get-a-quote-for-a-token-transfer
 */

import { BridgeRouteTag } from '$/schema/BridgeRouteTag.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { bridgeRouteStepSnapshotFromLifiQuoteStep } from '$/resolvers/Lifi/Rest/bridgeRouteSteps.ts'
import { fetchQuote } from '$/sources/Lifi/Rest/queries.ts'
import type {
	LifiQuoteRequest,
	LifiQuoteStep,
	LifiQuoteStepLike,
} from '$/sources/Lifi/Rest/types.ts'
type BridgeRouteQuoteId = EntitySelector<typeof schema, EntityType.BridgeRoute>

type BridgeRouteStepSnapshot = ReturnType<typeof bridgeRouteStepSnapshotFromLifiQuoteStep>

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
	steps: BridgeRouteStepSnapshot[]
}

const bridgeRouteResolverBundleByQuoteId = new Map<string, Promise<BridgeRouteResolverBundle>>()

const bridgeRouteQuoteIdKey = (quoteId: BridgeRouteQuoteId) => (
	[
		quoteId.fromChainId,
		quoteId.toChainId,
		quoteId.fromToken,
		quoteId.toToken,
		quoteId.fromAmount,
		quoteId.fromAddress,
		quoteId.slippage,
		quoteId.toAddress,
	].join('|')
)

const bridgeRouteQuoteIdToRequest = (
	quoteId: BridgeRouteQuoteId
): LifiQuoteRequest => ({
	fromChain: quoteId.fromChainId,
	toChain: quoteId.toChainId,
	fromToken: quoteId.fromToken,
	toToken: quoteId.toToken,
	fromAmount: String(quoteId.fromAmount),
	fromAddress: quoteId.fromAddress,
	slippage: quoteId.slippage,
	toAddress: quoteId.toAddress,
})

const parseLifiQuoteAmountBigInt = (
	value: string | undefined,
	label: string,
	fallback?: string
) => {
	const raw = (value ?? fallback ?? '').trim()
	if (!/^\d+$/.test(raw)) {
		throw new Error(`Lifi_Rest: invalid ${label} amount '${raw}'`)
	}
	return BigInt(raw)
}

const usdSumFromCostRows = (
	rows: readonly { amountUSD?: string }[] | undefined
) => (
	(rows ?? [])
		.reduce((sum, row) => {
			const parsed = Number.parseFloat(row.amountUSD ?? '0')
			return sum + (Number.isFinite(parsed) ? parsed : 0)
		}, 0)
)

const estimatedCostUsdFromQuoteStep = (step: LifiQuoteStep) => (
	usdSumFromCostRows(step.estimate.gasCosts)
	+ usdSumFromCostRows(step.estimate.feeCosts)
)

const lifiQuoteStepsForRoute = (
	step: LifiQuoteStep
): LifiQuoteStepLike[] => (
	step.includedSteps != null && step.includedSteps.length > 0 ?
		step.includedSteps
	:
		[step]
)

const bridgeRouteBundleFromQuoteStep = (
	quoteId: BridgeRouteQuoteId,
	step: LifiQuoteStep
): BridgeRouteResolverBundle => {
	const fromAmount = parseLifiQuoteAmountBigInt(
		step.action.fromAmount,
		'from',
		String(quoteId.fromAmount)
	)
	const toAmount = parseLifiQuoteAmountBigInt(
		step.estimate.toAmount,
		'to'
	)
	const toAmountMin = parseLifiQuoteAmountBigInt(
		step.estimate.toAmountMin,
		'toAmountMin'
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
			estimatedDurationSeconds: step.estimate.executionDuration,
			tags: [],
		},
		steps: lifiQuoteStepsForRoute(step).map((routeStep, index) => (
			bridgeRouteStepSnapshotFromLifiQuoteStep(quoteId, index, routeStep)
		)),
	}
}

export const fetchBridgeRouteBundleForQuoteId = async (
	quoteId: BridgeRouteQuoteId
) => {
	const quoteIdKey = bridgeRouteQuoteIdKey(quoteId)
	const existingBundle = bridgeRouteResolverBundleByQuoteId.get(quoteIdKey)
	if (existingBundle != null)
		return existingBundle

	const bundle = fetchQuote(bridgeRouteQuoteIdToRequest(quoteId))
		.then((step) => bridgeRouteBundleFromQuoteStep(quoteId, step))
		.catch((error) => {
			bridgeRouteResolverBundleByQuoteId.delete(quoteIdKey)
			throw error
		})
	bridgeRouteResolverBundleByQuoteId.set(quoteIdKey, bundle)
	return bundle
}
