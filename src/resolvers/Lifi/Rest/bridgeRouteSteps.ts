import { bridgeToolByKey } from '$/constants/Bridge.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { LifiQuoteStepLike, LifiQuoteStep, LifiToken } from '$/sources/Lifi/Rest/types.ts'

const NATIVE_LIFI_TOKEN_ADDRESSES = new Set([
	'0x0000000000000000000000000000000000000000',
	'0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
])

export const coinInstanceRefFromLifiToken = (
	token: LifiToken | undefined
) => (
	token == null ?
		undefined
	:
		((address) => (
			NATIVE_LIFI_TOKEN_ADDRESSES.has(address) ?
				{
					[EntityMetaKey.Selector]: {
						$network: {
							caip2: {
								namespace: 'eip155' as const,
								reference: String(token.chainId),
							},
						},
						type: CoinInstanceType.NativeCurrency,
					},
				}
			:
				((contractAddress) => (
					contractAddress == null ?
						undefined
					:
						{
							[EntityMetaKey.Selector]: {
								$network: {
									caip2: {
										namespace: 'eip155' as const,
										reference: String(token.chainId),
									},
								},
								type: CoinInstanceType.Erc20Token,
								$contract: {
									$network: {
										caip2: {
											namespace: 'eip155' as const,
											reference: String(token.chainId),
										},
									},
									address: contractAddress,
								},
							},
						}
				))(hexLowerOfByteSize(address, 20))
		))(token.address.trim().toLowerCase())
)


export const bridgeRouteStepMechanicsFromToolKey = (
	toolKey: string | undefined
) => {
	if (toolKey == null || toolKey.trim() === '') return {}
	const bridgeTool = bridgeToolByKey[toolKey]
	if (bridgeTool == null) return {}
	return {
		railId: bridgeTool.railId,
		settlementModel: bridgeTool.settlementModel,
		verificationModel: bridgeTool.verificationModel,
		assetOutcome: bridgeTool.assetOutcome,
	}
}

export const lifiToolKeyFromQuoteStep = (
	step: LifiQuoteStepLike
) => (
	step.tool.trim()
	|| step.toolDetails?.key?.trim()
	|| ''
)

export const bridgeRouteStepSnapshotFromLifiQuoteStep = (
	routeId: EntitySelector<typeof schema, EntityType.BridgeRoute>,
	indexInRoute: number,
	step: LifiQuoteStepLike
) => {
	const toolKey = lifiToolKeyFromQuoteStep(step)
	const fromTokenRef = coinInstanceRefFromLifiToken(step.action.fromToken)
	const toTokenRef = coinInstanceRefFromLifiToken(step.action.toToken)
	return {
		[EntityMetaKey.Selector]: {
			$route: routeId,
			indexInRoute,
		},
		stepType: step.type,
		tool: toolKey === '' ? step.tool : toolKey,
		$fromNetwork: {
			[EntityMetaKey.Selector]: {
				caip2: {
					namespace: 'eip155' as const,
					reference: String(step.action.fromChainId),
				},
			},
		},
		$toNetwork: {
			[EntityMetaKey.Selector]: {
				caip2: {
					namespace: 'eip155' as const,
					reference: String(step.action.toChainId),
				},
			},
		},
		...(fromTokenRef != null && { $fromToken: fromTokenRef }),
		...(toTokenRef != null && { $toToken: toTokenRef }),
		...bridgeRouteStepMechanicsFromToolKey(toolKey || undefined),
	}
}
