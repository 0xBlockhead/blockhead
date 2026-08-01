/**
 * Directional filtering for coin-scoped LI.FI bridge capability rows.
 */

import {
	coinBridgeCapabilityEntityRowsFromInstancesAndTools,
	coinInstanceEntitySelectorKey,
} from '$/resolvers/Lifi/Rest/coinBridgeCapabilityEntityRows.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import type { CoinInstanceEntitySelector } from '$/resolvers/Coingecko/Rest/coinInstances.ts'

export const filterCoinBridgeCapabilityRowsForInstance = (
	rows: ReturnType<typeof coinBridgeCapabilityEntityRowsFromInstancesAndTools>,
	instanceId: CoinInstanceEntitySelector,
	direction: 'inbound' | 'outbound'
) => {
	const instanceKey = coinInstanceEntitySelectorKey(instanceId)
	return rows.filter((row) => (
		direction === 'outbound' ?
			coinInstanceEntitySelectorKey(row[EntityMetaKey.Selector].$fromInstance) === instanceKey
		:
			coinInstanceEntitySelectorKey(row[EntityMetaKey.Selector].$toInstance) === instanceKey
	))
}
