/**
 * Coin-scoped bridge capability rows: Coingecko deployments × LI.FI `/v1/tools` catalog × local mechanics.
 */

import { coinBridgeCapabilityEntityRowsFromInstancesAndTools } from '$/sources/Lifi/Rest/coinBridgeCapabilityEntityRows.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { LifiToolsResponse } from '$/sources/Lifi/Rest/types.ts'


export const coinBridgeCapabilityRowsFromInstancesAndTools = (
	instanceRows: Parameters<typeof coinBridgeCapabilityEntityRowsFromInstancesAndTools>[0],
	lifiTools: LifiToolsResponse
) => {
	const { bridges } = lifiTools
	return coinBridgeCapabilityEntityRowsFromInstancesAndTools(instanceRows, bridges)
}

const coinInstanceEntitySelectorKey = (
	instanceId: EntitySelector<typeof schema, EntityType.EvmCoinInstance>
) => (
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

export const filterCoinBridgeCapabilityRowsForInstance = (
	rows: ReturnType<typeof coinBridgeCapabilityEntityRowsFromInstancesAndTools>,
	instanceId: EntitySelector<typeof schema, EntityType.EvmCoinInstance>,
	direction: 'inbound' | 'outbound'
) => {
	const instanceKey = coinInstanceEntitySelectorKey(instanceId)
	const filtered = rows.filter((row) => (
		direction === 'outbound' ?
			coinInstanceEntitySelectorKey(row[EntityMetaKey.Selector].$fromInstance) === instanceKey
		:
			coinInstanceEntitySelectorKey(row[EntityMetaKey.Selector].$toInstance) === instanceKey
	))
	return filtered
}
