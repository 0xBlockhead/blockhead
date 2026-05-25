/**
 * Coin-scoped bridge capability rows: Coingecko deployments × LI.FI `/v1/tools` catalog × local mechanics.
 */

import { coinBridgeCapabilityEntityRowsFromInstancesAndTools } from '$/sources/Lifi/Rest/coinBridgeCapabilityEntityRows.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { EntityId } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { fetchCoinInstanceStubsForCoin } from '$/sources/Coingecko/Rest/coinInstances.ts'
import type { LifiToolsResponse } from '$/sources/Lifi/Rest/types.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/$Source.ts'
import { stringify } from 'devalue'



export const fetchCoinBridgeCapabilityRowsForCoin = async (
	coinId: EntityId<typeof schema, EntityType.Coin>['coinId'],
	coingeckoPublicEnv: SourcePublicEnvFor<Source.Coingecko_Rest>,
	lifiTools: LifiToolsResponse,
) => {
	const instanceRows = await fetchCoinInstanceStubsForCoin(coinId, coingeckoPublicEnv)
	if (instanceRows.length === 0) {
		throw new Error(`Lifi_Rest: no Coingecko coin instances for ${coinId}`)
	}

	const { bridges } = lifiTools
	const rows = coinBridgeCapabilityEntityRowsFromInstancesAndTools(instanceRows, bridges)
	if (rows.length === 0) {
		throw new Error(`Lifi_Rest: LiFi tools catalog produced no bridge capabilities for ${coinId}`)
	}
	return rows
}

export const filterCoinBridgeCapabilityRowsForInstance = (
	rows: ReturnType<typeof coinBridgeCapabilityEntityRowsFromInstancesAndTools>,
	instanceId: EntityId<typeof schema, EntityType.CoinInstance>,
	direction: 'inbound' | 'outbound',
) => {
	const instanceKey = stringify(instanceId)
	const filtered = rows.filter((row) => (
		direction === 'outbound' ?
			stringify(row[EntityMetaKey.Id].$fromInstance) === instanceKey
		:
			stringify(row[EntityMetaKey.Id].$toInstance) === instanceKey
	))
	if (filtered.length === 0) {
		throw new Error(`Lifi_Rest: no ${direction} bridge capabilities for coin instance ${instanceKey}`)
	}
	return filtered
}
