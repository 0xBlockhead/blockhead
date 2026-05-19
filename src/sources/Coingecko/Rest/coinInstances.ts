/**
 * Coin deployment rows for a logical {@link CoinId}, derived from CoinGecko coin + asset platforms.
 */

import {
	CoinInstanceRepresentation,
	coinInstanceRepresentationFor,
} from '$/constants/Bridge.ts'
import type { CoinId } from '$/constants/Coin.ts'
import { CoinInstanceType } from '$/schema/CoinInstance.ts'
import { EvmAddress } from '$/schema/$ZeroExHex.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { EntityId } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { getCoingeckoCoinWithAssetPlatforms } from '$/sources/Coingecko/Rest/queries.ts'
import type { CoingeckoCoin } from '$/sources/Coingecko/Rest/types.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/$Source.ts'
import { stringify } from 'devalue'


type CoinInstanceEntityId = EntityId<typeof schema, EntityType.CoinInstance>

export type CoinInstanceStubRow = {
	[EntityMetaKey.Id]: CoinInstanceEntityId
	representation: CoinInstanceRepresentation
}

const isEvmContractAddress = (value: string) => (
	/^0x[a-fA-F0-9]{40}$/.test(value.trim())
)

const coinInstanceStubRowsFromCoingeckoCoin = (
	coinId: CoinId,
	coin: CoingeckoCoin,
	chainIdByPlatformId: ReadonlyMap<string, number>,
) => {
	const seenKeys = new Set<string>()
	const rows: CoinInstanceStubRow[] = []

	const nativePlatformId = coin.asset_platform_id ?? undefined
	const nativeChainId = (
		nativePlatformId != null
		&& nativePlatformId !== '' ?
			chainIdByPlatformId.get(nativePlatformId)
		:
			undefined
	)

	const pushRow = (instanceId: CoinInstanceEntityId) => {
		const key = stringify(instanceId)
		if (seenKeys.has(key)) return
		seenKeys.add(key)
		rows.push({
			[EntityMetaKey.Id]: instanceId,
			representation: coinInstanceRepresentationFor(
				coinId,
				coin.symbol ?? '',
				{
					chainId: instanceId.$network.chainId,
					type: instanceId.type,
					isNativeChain: (
						nativeChainId != null
						&& instanceId.$network.chainId === nativeChainId
					),
				},
			),
		})
	}

	if (nativeChainId != null) {
		pushRow({
			$network: { chainId: nativeChainId },
			type: CoinInstanceType.NativeCurrency,
		})
	}

	for (const [platformId, rawAddress] of Object.entries(coin.platforms ?? {})) {
		if (typeof rawAddress !== 'string') continue
		const address = rawAddress.trim()
		if (!isEvmContractAddress(address)) continue
		const chainId = chainIdByPlatformId.get(platformId)
		if (chainId == null) continue

		pushRow({
			$network: { chainId },
			type: CoinInstanceType.Erc20Token,
			$contract: {
				$network: { chainId },
				address: EvmAddress.assert(address.toLowerCase()),
			},
		})
	}

	return rows
}

export const fetchCoinInstanceStubRowsForCoin = async (
	coinId: EntityId<typeof schema, EntityType.Coin>['coinId'],
	publicEnv: SourcePublicEnvFor<Source.Coingecko_Rest>,
) => {
	const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
	const coingeckoId = idByCoinId[coinId]
	if (coingeckoId == null) return []

	const { coin, assetPlatforms } = await getCoingeckoCoinWithAssetPlatforms(publicEnv, coingeckoId)
	if (coin == null) return []

	const chainIdByPlatformId = new Map(
		assetPlatforms
			.filter((platform): platform is typeof platform & { chain_identifier: number } => (
				typeof platform.chain_identifier === 'number'
			))
			.map((platform) => [
				platform.id,
				platform.chain_identifier,
			]),
	)

	return coinInstanceStubRowsFromCoingeckoCoin(
		coinId,
		coin,
		chainIdByPlatformId,
	)
}

const coinIdByInstanceKeyCaches = new Map<string, Map<string, CoinId>>()

const coinIdByInstanceKeyForEnv = async (
	publicEnv: SourcePublicEnvFor<Source.Coingecko_Rest>,
) => {
	const cacheKey = stringify(publicEnv)
	const cached = coinIdByInstanceKeyCaches.get(cacheKey)
	if (cached != null) {
		return cached
	}

	const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
	const map = new Map<string, CoinId>()

	for (const coinId of Object.keys(idByCoinId)) {
		const rows = await fetchCoinInstanceStubRowsForCoin(
			coinId,
			publicEnv,
		)
		for (const row of rows) {
			map.set(stringify(row[EntityMetaKey.Id]), coinId)
		}
	}

	coinIdByInstanceKeyCaches.set(cacheKey, map)
	return map
}

export const resolveCoinIdForCoinInstanceEntityId = async (
	instanceId: CoinInstanceEntityId,
	publicEnv: SourcePublicEnvFor<Source.Coingecko_Rest>,
) => {
	const map = await coinIdByInstanceKeyForEnv(publicEnv)
	return map.get(stringify(instanceId)) ?? null
}

export const resolveCoinInstanceRepresentation = async (
	instanceId: CoinInstanceEntityId,
	publicEnv: SourcePublicEnvFor<Source.Coingecko_Rest>,
) => {
	const coinId = await resolveCoinIdForCoinInstanceEntityId(instanceId, publicEnv)
	if (coinId == null) return undefined

	const rows = await fetchCoinInstanceStubRowsForCoin(coinId, publicEnv)
	const instanceKey = stringify(instanceId)
	return rows.find((row) => (
		stringify(row[EntityMetaKey.Id]) === instanceKey
	))?.representation
}

export const resolveCanonicalCoinInstanceEntityId = async (
	instanceId: CoinInstanceEntityId,
	publicEnv: SourcePublicEnvFor<Source.Coingecko_Rest>,
) => {
	const coinId = await resolveCoinIdForCoinInstanceEntityId(instanceId, publicEnv)
	if (coinId == null) return undefined

	const rows = await fetchCoinInstanceStubRowsForCoin(coinId, publicEnv)
	const instanceKey = stringify(instanceId)
	const self = rows.find((row) => (
		stringify(row[EntityMetaKey.Id]) === instanceKey
	))
	if (self == null) return undefined

	if (self.representation === CoinInstanceRepresentation.BridgeWrapped) {
		const issuerNative = rows.find((row) => (
			row.representation === CoinInstanceRepresentation.IssuerNative
			&& row[EntityMetaKey.Id].$network.chainId === 1
		))
		return issuerNative?.[EntityMetaKey.Id]
	}

	if (self.representation === CoinInstanceRepresentation.CanonicalL2Native) {
		return rows.find((row) => (
			row.representation === CoinInstanceRepresentation.IssuerNative
			&& row[EntityMetaKey.Id].type === CoinInstanceType.NativeCurrency
		))?.[EntityMetaKey.Id]
	}

	return undefined
}
