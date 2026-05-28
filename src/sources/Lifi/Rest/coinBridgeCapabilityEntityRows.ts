import { bridgeToolByKey, bridgeTools } from '$/constants/Bridge.ts'
import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { EntityId } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type { LifiBridgeTool } from '$/sources/Lifi/Rest/types.ts'
import { stringify } from 'devalue'


type CoinInstanceEntityId = EntityId<typeof schema, EntityType.EvmCoinInstance>

type CoinBridgeCapabilityEntityId = EntityId<typeof schema, EntityType.CoinBridgeCapability>

const bridgeToolsCatalogKeys = new Set<string>(
	Object.keys(bridgeToolByKey).map((key) => String(key)),
)

export const coinBridgeCapabilityEntityRowsFromInstancesAndTools = (
	instanceIds: readonly { [EntityMetaKey.Id]: CoinInstanceEntityId }[],
	tools: readonly LifiBridgeTool[],
) => {
	const instanceByChainId: Partial<Record<number, CoinInstanceEntityId>> = {}

	for (const row of instanceIds) {
		const instanceId = row[EntityMetaKey.Id]
		const chainId = Number(instanceId.$network.caip2.reference)
		const current = instanceByChainId[chainId]
		instanceByChainId[chainId] = (
			current == null
			|| (
				current.type === CoinInstanceType.NativeCurrency
				&& instanceId.type === CoinInstanceType.Erc20Token
			) ?
				instanceId
			:
				current
		)
	}

	const seenKeys = new Set<string>()
	const rows: {
		[EntityMetaKey.Id]: CoinBridgeCapabilityEntityId
		toolKey: string
		railId: (typeof bridgeTools)[number]['railId']
		settlementModel: (typeof bridgeTools)[number]['settlementModel']
		verificationModel: (typeof bridgeTools)[number]['verificationModel']
		assetOutcome: (typeof bridgeTools)[number]['assetOutcome']
	}[] = []

	for (const tool of tools) {
		if (!bridgeToolsCatalogKeys.has(tool.key)) continue

		const mechanics = bridgeToolByKey[tool.key]
		if (mechanics == null) continue

		for (const { fromChainId, toChainId } of tool.supportedChains) {
			const fromInstance = instanceByChainId[fromChainId]
			const toInstance = instanceByChainId[toChainId]
			if (fromInstance == null || toInstance == null) continue
			if (fromChainId === toChainId) continue

			const capabilityId = {
				$fromInstance: fromInstance,
				$toInstance: toInstance,
				toolKey: tool.key,
			} satisfies CoinBridgeCapabilityEntityId

			const dedupeKey = stringify(capabilityId)
			if (seenKeys.has(dedupeKey)) continue
			seenKeys.add(dedupeKey)

			rows.push({
				[EntityMetaKey.Id]: capabilityId,
				toolKey: tool.key,
				...mechanics,
			})
		}
	}

	return rows.toSorted((left, right) => (
		stringify(left[EntityMetaKey.Id]).localeCompare(stringify(right[EntityMetaKey.Id]))
	))
}
