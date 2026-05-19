import { coinBridgeCapabilityFieldsForToolKey } from '$/constants/Bridge.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { EntityId } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type { LifiQuoteStepWire } from '$/sources/Lifi/Rest/types.ts'


export const bridgeRouteStepMechanicsFromToolKey = (
	toolKey: string | undefined,
) => (
	toolKey == null || toolKey.trim() === '' ?
		{}
	:
		coinBridgeCapabilityFieldsForToolKey(toolKey)
)

export const bridgeRouteStepEntityFieldsFromLifiQuoteStep = (
	routeId: EntityId<typeof schema, EntityType.BridgeRoute>,
	index: number,
	step: LifiQuoteStepWire,
) => {
	const toolKey = step.tool
	return {
		[EntityMetaKey.Id]: {
			$route: routeId,
			index,
		},
		stepType: step.type,
		tool: toolKey,
		$fromNetwork: { chainId: step.action.fromChainId },
		$toNetwork: { chainId: step.action.toChainId },
		...bridgeRouteStepMechanicsFromToolKey(toolKey),
	}
}
