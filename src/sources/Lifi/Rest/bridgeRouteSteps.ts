import { bridgeToolByKey } from '$/constants/Bridge.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
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
						$network: { chainId: token.chainId },
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
								$network: { chainId: token.chainId },
								type: CoinInstanceType.Erc20Token,
								$contract: {
									$network: { chainId: token.chainId },
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
	if (toolKey == null || toolKey.trim() === '') {
		return {}
	}
	return bridgeToolByKey[toolKey] ?? {}
}

export const lifiToolKeyFromQuoteStep = (
	step: LifiQuoteStepLike
) => (
	step.tool.trim()
	|| step.toolDetails?.key?.trim()
	|| ''
)

export const bridgeRouteStepEntityFieldsFromLifiQuoteStep = (
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
			[EntityMetaKey.Selector]: { chainId: step.action.fromChainId },
		},
		$toNetwork: {
			[EntityMetaKey.Selector]: { chainId: step.action.toChainId },
		},
		...(fromTokenRef != null && { $fromToken: fromTokenRef }),
		...(toTokenRef != null && { $toToken: toTokenRef }),
		...bridgeRouteStepMechanicsFromToolKey(toolKey || undefined),
	}
}
