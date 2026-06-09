/**
 * Coin-scoped bridge capability rows: Coingecko deployments × LI.FI `/v1/tools` catalog × local mechanics.
 */

import { coinBridgeCapabilityEntityRowsFromInstancesAndTools } from '$/sources/Lifi/Rest/coinBridgeCapabilityEntityRows.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import type { EntityId } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { fetchCoinInstanceStubsForCoin } from '$/sources/Coingecko/Rest/coinInstances.ts'
import type { LifiToolsResponse } from '$/sources/Lifi/Rest/types.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/Source.ts'
import { stringify } from 'devalue'



export const fetchCoinBridgeCapabilityRowsForCoin = async (
	coinId: EntityId<typeof schema, EntityType.Coin>['coinId'],
	coingeckoPublicEnv: SourcePublicEnvFor<Source.Coingecko_Rest>,
	lifiTools: LifiToolsResponse,
) => {
	const instanceRows = await fetchCoinInstanceStubsForCoin(coinId, coingeckoPublicEnv)

	const { bridges } = lifiTools
	return coinBridgeCapabilityEntityRowsFromInstancesAndTools(instanceRows, bridges)
}

export const filterCoinBridgeCapabilityRowsForInstance = (
	rows: ReturnType<typeof coinBridgeCapabilityEntityRowsFromInstancesAndTools>,
	instanceId: EntityId<typeof schema, EntityType.EvmCoinInstance>,
	direction: 'inbound' | 'outbound',
) => {
	const instanceKey = stringify(instanceId)
	const filtered = rows.filter((row) => (
		direction === 'outbound' ?
			stringify(row[EntityMetaKey.Id].$fromInstance) === instanceKey
		:
			stringify(row[EntityMetaKey.Id].$toInstance) === instanceKey
	))
	return filtered
}
