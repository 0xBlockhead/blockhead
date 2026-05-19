/**
 * Coin-scoped bridge capability rows: Coingecko deployments × LI.FI `/v1/tools` catalog × local mechanics.
 */

import { coinBridgeCapabilityEntityRowsFromInstancesAndTools } from '$/lib/bridge/coinBridgeCapabilitiesFromInstances.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { EntityId } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { fetchCoinInstanceStubRowsForCoin } from '$/sources/Coingecko/Rest/coinInstances.ts'
import { fetchLifiToolsCatalog } from '$/sources/Lifi/Rest/queries.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/$Source.ts'
import { stringify } from 'devalue'



export const fetchCoinBridgeCapabilityRowsForCoin = async (
	coinId: EntityId<typeof schema, EntityType.Coin>['coinId'],
	coingeckoPublicEnv: SourcePublicEnvFor<Source.Coingecko_Rest>,
) => {
	const instanceRows = await fetchCoinInstanceStubRowsForCoin(coinId, coingeckoPublicEnv)
	if (instanceRows.length === 0) return []

	const { bridges } = await fetchLifiToolsCatalog()
	return coinBridgeCapabilityEntityRowsFromInstancesAndTools(instanceRows, bridges)
}

export const filterCoinBridgeCapabilityRowsForInstance = (
	rows: ReturnType<typeof coinBridgeCapabilityEntityRowsFromInstancesAndTools>,
	instanceId: EntityId<typeof schema, EntityType.CoinInstance>,
	direction: 'inbound' | 'outbound',
) => {
	const instanceKey = stringify(instanceId)
	return rows.filter((row) => (
		direction === 'outbound' ?
			stringify(row[EntityMetaKey.Id].$fromInstance) === instanceKey
		:
			stringify(row[EntityMetaKey.Id].$toInstance) === instanceKey
	))
}
