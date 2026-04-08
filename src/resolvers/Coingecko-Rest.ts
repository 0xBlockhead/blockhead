import { stringify } from 'devalue'

import { CoinId, coinById } from '$/constants/Coin.ts'
import {
	caip19Erc20,
	caip19Slip44,
} from '$/lib/caip19.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$defineEntityResolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { EntityId, schema } from '$/schema/$schema.ts'
import { CoinInstanceType } from '$/schema/CoinInstance.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { MediaType } from '$/schema/Media.ts'
import { findChainByChainId } from '$/sources/Chainlist/Rest/rpcsJsonWire.ts'
import { fetchRpcsJson } from '$/sources/Chainlist/Rest/queries.ts'
import {
	coinDecimalsByCoinId,
	coinIdByCoingeckoId,
	coingeckoIdByCoinId,
} from '$/sources/Coingecko/Rest/constants.ts'
import {
	fetchCoingeckoAssetPlatforms,
	findCoingeckoAssetPlatformByChainId,
	getCoingeckoCoin,
	getCoingeckoCoinByAssetPlatformContract,
	getCoingeckoSimplePriceUsd,
} from '$/sources/Coingecko/Rest/queries.ts'
import type { CoingeckoCoin } from '$/sources/Coingecko/Rest/types.ts'
import { Source } from '$/sources/$Sources.ts'

const knownCoinIds = Object.values(CoinId)

const isEvmContractAddress = (value: string) => (
	/^0x[a-fA-F0-9]{40}$/.test(value.trim())
)

const coinInstanceIdsForCoingeckoCoin = async (
	coinId: EntityId<typeof schema, EntityType.Coin>['coinId'],
) => {
	const coingeckoId = coingeckoIdByCoinId[coinId]
	if (coingeckoId == null) return []

	const [coin, assetPlatforms] = await Promise.all([
		getCoingeckoCoin(coingeckoId),
		fetchCoingeckoAssetPlatforms(),
	])

	if (coin == null) return []

	const chainIdByPlatformId = new Map(
		assetPlatforms
			.filter((platform) => typeof platform.chain_identifier === 'number')
			.map((platform) => [
				platform.id,
				platform.chain_identifier as number,
			]),
	)

	const seenKeys = new Set<string>()
	const rows: { [EntityMetaKey.Id]: EntityId<typeof schema, EntityType.CoinInstance> }[] = []

	const pushId = (id: EntityId<typeof schema, EntityType.CoinInstance>) => {
		const key = stringify(id)
		if (seenKeys.has(key)) return
		seenKeys.add(key)
		rows.push({ [EntityMetaKey.Id]: id })
	}

	const nativePlatformId = coin.asset_platform_id ?? undefined
	if (nativePlatformId != null && nativePlatformId !== '') {
		const chainId = chainIdByPlatformId.get(nativePlatformId)
		if (chainId != null) {
			pushId({
				$network: { chainId },
				type: CoinInstanceType.NativeCurrency,
			})
		}
	}

	for (const [platformId, rawAddress] of Object.entries(coin.platforms ?? {})) {
		if (typeof rawAddress !== 'string') continue
		const address = rawAddress.trim()
		if (!isEvmContractAddress(address)) continue
		const chainId = chainIdByPlatformId.get(platformId)
		if (chainId == null) continue

		pushId({
			$network: { chainId },
			type: CoinInstanceType.Erc20Token,
			$contract: {
				$network: { chainId },
				address: (
					address.toLowerCase() as `0x${string}`
				),
			},
		})
	}

	return rows
}

const coingeckoImageUrl = (coin: CoingeckoCoin | undefined) => (
	coin?.image?.large
		?? coin?.image?.small
		?? coin?.image?.thumb
)

const mediaEntityFromUrl = (url: string | undefined) => (
	url == null || url.trim() === '' ?
		undefined
	:	{
			[EntityMetaKey.Id]: { url },
			type: MediaType.Image,
		}
)

const firstDefinedDecimal = (coin: CoingeckoCoin | undefined) => (
	Object.values(coin?.detail_platforms ?? {})
		.find((platform) => typeof platform.decimal_place === 'number')
		?.decimal_place
)

const nativeCurrencyMetadataForChainId = async (chainId: number) => {
	const chain = findChainByChainId(
		await fetchRpcsJson(),
		chainId,
	)

	if (chain == null) return undefined

	const symbol = chain.nativeCurrency.symbol.trim()

	return {
		coinId: knownCoinIds.find((value) => value === symbol) ?? CoinId.Unknown,
		name: chain.nativeCurrency.name,
		symbol,
		decimals: chain.nativeCurrency.decimals,
		slip44: chain.slip44,
	}
}

export default {
	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Coin,
			source: Source.Coingecko,
			resolve: async (entityId) => {
				const coingeckoId = coingeckoIdByCoinId[entityId.coinId]
				if (coingeckoId == null) return {}

				const coin = await getCoingeckoCoin(coingeckoId)
				if (coin == null) return {}

				const decimals = (
					firstDefinedDecimal(coin)
					?? coinDecimalsByCoinId[entityId.coinId]
				)

				return {
					symbol: coinById[entityId.coinId]?.symbol ?? coin.symbol.toUpperCase(),
					name: coin.name,
					...(decimals != null ? { decimals } : {}),
					...(mediaEntityFromUrl(coingeckoImageUrl(coin)) != null ?
						{ $logo: mediaEntityFromUrl(coingeckoImageUrl(coin)) }
					:	{}),
				}
			},
		}),
		defineEntityResolver({
			entityType: EntityType.CoinInstance,
			source: Source.Coingecko,
			resolve: async (entityId) => {
				if (entityId.type === 'NativeCurrency') {
					const nativeCurrency = await nativeCurrencyMetadataForChainId(entityId.$network.chainId)
					if (nativeCurrency == null) return {}

					const coin = (
						nativeCurrency.coinId !== CoinId.Unknown ?
							await getCoingeckoCoin(
								coingeckoIdByCoinId[nativeCurrency.coinId] ?? '',
							)
						:	undefined
					)

					return {
						coinId: nativeCurrency.coinId,
						name: nativeCurrency.name,
						symbol: nativeCurrency.symbol,
						decimals: nativeCurrency.decimals,
						...(nativeCurrency.slip44 != null ?
							{ caip19: caip19Slip44(entityId.$network.chainId, nativeCurrency.slip44) }
						:	{}),
						...(mediaEntityFromUrl(coingeckoImageUrl(coin)) != null ?
							{ $icon: mediaEntityFromUrl(coingeckoImageUrl(coin)) }
						:	{}),
					}
				}

				const caip19 = caip19Erc20(
					entityId.$network.chainId,
					entityId.$contract.address,
				)
				const assetPlatform = await findCoingeckoAssetPlatformByChainId(entityId.$network.chainId)
				if (assetPlatform == null) return { caip19 }

				const coin = await getCoingeckoCoinByAssetPlatformContract({
					assetPlatformId: assetPlatform.id,
					contractAddress: entityId.$contract.address,
				})

				if (coin == null) return { caip19 }

				const coinId = coinIdByCoingeckoId[coin.id] ?? CoinId.Unknown
				const decimals = (
					coin.detail_platforms?.[assetPlatform.id]?.decimal_place
					?? firstDefinedDecimal(coin)
					?? coinDecimalsByCoinId[coinId]
				)

				return {
					coinId,
					symbol: coin.symbol.toUpperCase(),
					...(coin.name.trim() !== '' ? { name: coin.name } : {}),
					...(decimals != null ? { decimals } : {}),
					caip19,
					...(mediaEntityFromUrl(coingeckoImageUrl(coin)) != null ?
						{ $icon: mediaEntityFromUrl(coingeckoImageUrl(coin)) }
					:	{}),
				}
			},
		}),
		defineEntityResolver({
			entityType: EntityType.CoinPrice,
			source: Source.Coingecko,
			resolve: async (entityId) => {
				const coingeckoId = coingeckoIdByCoinId[entityId.$coin.coinId]
				if (coingeckoId == null) return {}

				const price = await getCoingeckoSimplePriceUsd({
					coingeckoId,
				})
				if (price == null) return {}

				const usd = price.usd
				const lastUpdatedAtSec = price.last_updated_at
				if (typeof usd !== 'number' || !Number.isFinite(usd)) return {}
				if (typeof lastUpdatedAtSec !== 'number' || !Number.isFinite(lastUpdatedAtSec)) return {}

				return {
					[EntityMetaKey.Id]: entityId,
					price: BigInt(Math.round(usd * 1e8)),
					timestampNs: BigInt(lastUpdatedAtSec) * 1_000_000_000n,
					updatedAt: lastUpdatedAtSec * 1000,
					transport: 'coingecko-usd-1e8',
					encodedAssetId: coingeckoId,
				}
			},
		}),
	],
	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$coins',
			source: Source.Coingecko,
			resolve: async (_entityId) => (
				Object.entries(coingeckoIdByCoinId)
					.filter(([coinId]) => coinById[coinId as keyof typeof coinById] != null)
					.map(([coinId]) => ({
						[EntityMetaKey.Id]: {
							coinId,
						},
					}))
			),
		}),
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$coinPrices',
			source: Source.Coingecko,
			resolve: async (_entityId) => (
				Object.entries(coingeckoIdByCoinId)
					.filter(([coinId]) => coinById[coinId as keyof typeof coinById] != null)
					.map(([coinId]) => ({
						[EntityMetaKey.Id]: {
							$coin: {
								coinId,
							},
						},
					}))
			),
		}),
		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$coinInstances',
			source: Source.Coingecko,
			resolve: async (entityId) => (
				coinInstanceIdsForCoingeckoCoin(entityId.coinId)
			),
		}),
	],
}
