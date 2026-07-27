import { bridgeToolByKey } from '$/constants/Bridge.ts'
import type { CoinInstanceEntitySelector } from '$/sources/Coingecko/Rest/coinInstances.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { LifiBridgeTool } from '$/sources/Lifi/Rest/types.ts'


type CoinBridgeCapabilityEntitySelector = (
	Omit<
		EntitySelector<typeof schema, EntityType.CoinBridgeCapability>,
		'$fromInstance' | '$toInstance'
	>
	& {
		readonly $fromInstance: CoinInstanceEntitySelector
		readonly $toInstance: CoinInstanceEntitySelector
	}
)

const bridgeToolsCatalogKeys = new Set<string>(
	Object.keys(bridgeToolByKey).map((key) => String(key))
)

const coinInstanceEntitySelectorKey = (instanceId: CoinInstanceEntitySelector) => (
	[
		instanceId.$network.caip2.namespace,
		instanceId.$network.caip2.reference,
		instanceId.type,
		instanceId.type === 'Erc20Token' ?
			instanceId.$contract.address
		:
			'',
	].join(':')
)

const coinBridgeCapabilityEntitySelectorKey = (
	capabilityId: CoinBridgeCapabilityEntitySelector
) => (
	[
		coinInstanceEntitySelectorKey(capabilityId.$fromInstance),
		coinInstanceEntitySelectorKey(capabilityId.$toInstance),
		capabilityId.toolKey,
	].join('|')
)

export const coinBridgeCapabilityEntityRowsFromInstancesAndTools = (
	instanceIds: readonly { [EntityMetaKey.Selector]: CoinInstanceEntitySelector }[],
	tools: readonly LifiBridgeTool[]
) => {
	const instanceByChainId: Partial<Record<string, CoinInstanceEntitySelector>> = {}

	for (const row of instanceIds) {
			const instanceId = row[EntityMetaKey.Selector]
		instanceByChainId[instanceId.$network.caip2.reference] = instanceId
	}

	const seenKeys = new Set<string>()
	const rows: {
		[EntityMetaKey.Selector]: CoinBridgeCapabilityEntitySelector
		[EntityMetaKey.Fields]: Record<string, string>
	}[] = []

	for (const tool of tools) {
		if (!bridgeToolsCatalogKeys.has(tool.key)) continue

		const mechanics = bridgeToolByKey[tool.key]
		if (mechanics == null) continue

		for (const { fromChainId, toChainId } of tool.supportedChains) {
			const fromInstance = instanceByChainId[fromChainId]
			const toInstance = instanceByChainId[toChainId]
			if (
				fromChainId === toChainId
				|| fromInstance == null
				|| toInstance == null
			) continue

			const capabilityId = {
				$fromInstance: fromInstance,
				$toInstance: toInstance,
				toolKey: tool.key,
			} satisfies CoinBridgeCapabilityEntitySelector

			const dedupeKey = coinBridgeCapabilityEntitySelectorKey(capabilityId)
			if (seenKeys.has(dedupeKey)) continue
			seenKeys.add(dedupeKey)

			rows.push({
				[EntityMetaKey.Selector]: capabilityId,
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CoinBridgeCapability, [], 'toolKey')]: tool.key,
					[entityFieldAddressKey(EntityType.CoinBridgeCapability, [], 'railId')]: mechanics.railId,
					[entityFieldAddressKey(EntityType.CoinBridgeCapability, [], 'settlementModel')]: mechanics.settlementModel,
					[entityFieldAddressKey(EntityType.CoinBridgeCapability, [], 'verificationModel')]: mechanics.verificationModel,
					[entityFieldAddressKey(EntityType.CoinBridgeCapability, [], 'assetOutcome')]: mechanics.assetOutcome,
				},
			})
		}
	}

	return rows.toSorted((left, right) => (
		coinBridgeCapabilityEntitySelectorKey(left[EntityMetaKey.Selector]).localeCompare(
			coinBridgeCapabilityEntitySelectorKey(right[EntityMetaKey.Selector])
		)
	))
}
