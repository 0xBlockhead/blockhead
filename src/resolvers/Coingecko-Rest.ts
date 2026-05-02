import type { CoinId } from '$/constants/Coin.ts'
import {
	MarketAssetKind,
	MarketPriceRangeType,
	MarketTimeIntervalUnit,
	MarketVenue,
	coingeckoOhlcDayWindowLengths,
} from '$/constants/Market.ts'
import { caip19Erc20, caip19Slip44, Slip44 } from '$/lib/caip19.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { CoinInstanceType } from '$/schema/CoinInstance.ts'
import { MediaType } from '$/schema/Media.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.Coingecko_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Coin,
			resolve: async (entityId, context) => {
				const { sourcePublicEnv } = await import('$/resolvers/$resolvers.ts')
				const { CoinId, coinById } = await import('$/constants/Coin.ts')
				const { decimalsByCoinId, idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoingeckoCoin } = await import('$/sources/Coingecko/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coingecko_Rest)
				const coingeckoId = idByCoinId[entityId.coinId]
				if (coingeckoId == null) throw new Error('Coingecko_Rest: coin not mapped')
				const coin = await getCoingeckoCoin(publicEnv, coingeckoId)
				if (coin == null) throw new Error('Coingecko_Rest: coin not returned by API')

				const decimals = (
					Object.values(coin.detail_platforms ?? {})
						.find((platform) => typeof platform.decimal_place === 'number')
						?.decimal_place
					?? decimalsByCoinId[entityId.coinId]
				)
				const logoUrl = coin.image?.large ?? coin.image?.small ?? coin.image?.thumb
				const logoMedia = (
					logoUrl == null || logoUrl.trim() === '' ?
						undefined
					:	{
							[EntityMetaKey.Id]: { url: logoUrl },
							type: MediaType.Image,
						}
				)

				return {
					symbol: coinById[entityId.coinId]?.symbol ?? coin.symbol.trim().toUpperCase(),
					...(coin.name.trim() !== '' ? { name: coin.name.trim() } : {}),
					...(decimals != null ? { decimals } : {}),
					...(logoMedia != null ?
						{ $logo: logoMedia }
					:	{}),
				}
			},
		}),
		defineEntityResolver({
			entityType: EntityType.CoinInstance,
			resolve: async (entityId, context) => {
				const { sourcePublicEnv } = await import('$/resolvers/$resolvers.ts')
				const { CoinId } = await import('$/constants/Coin.ts')
				const {
					decimalsByCoinId,
					coinIdByWireId,
					idByCoinId,
				} = await import('$/sources/Coingecko/Rest/constants.ts')
				const {
					findCoingeckoAssetPlatformByChainId,
					getCoingeckoCoin,
					getCoingeckoCoinByAssetPlatformContract,
				} = await import('$/sources/Coingecko/Rest/queries.ts')
				const { findChainByChainId } = await import('$/sources/Chainlist/Rest/rpcsJsonWire.ts')
				const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coingecko_Rest)
				const knownCoinIds = Object.values(CoinId)
				const pickCoingeckoCoinImageUrl = (coingeckoCoin: { image?: { large?: string; small?: string; thumb?: string } } | undefined) => (
					coingeckoCoin?.image?.large
						?? coingeckoCoin?.image?.small
						?? coingeckoCoin?.image?.thumb
				)
				if (entityId.type === CoinInstanceType.NativeCurrency) {
					const chain = findChainByChainId(
						await fetchRpcsJson(),
						entityId.$network.chainId,
					)
					if (chain == null) throw new Error('Coingecko_Rest: native coin chain not in chainlist')

					const symbol = chain.nativeCurrency.symbol.trim().toUpperCase()
					const nativeCurrency = {
						coinId: knownCoinIds.find((candidateCoinId) => candidateCoinId === symbol) ?? CoinId.Unknown,
						name: chain.nativeCurrency.name,
						symbol,
						decimals: chain.nativeCurrency.decimals,
						slip44: chain.slip44,
					}
					const coin = (
						nativeCurrency.coinId !== CoinId.Unknown && idByCoinId[nativeCurrency.coinId] != null ?
							await getCoingeckoCoin(
								publicEnv,
								idByCoinId[nativeCurrency.coinId]!,
							)
						:	undefined
					)
					const iconUrl = pickCoingeckoCoinImageUrl(coin)
					const iconMedia = (
						iconUrl == null || iconUrl.trim() === '' ?
							undefined
						:	{
								[EntityMetaKey.Id]: { url: iconUrl },
								type: MediaType.Image,
							}
					)

					return {
						coinId: nativeCurrency.coinId,
						...(nativeCurrency.name.trim() !== '' ? { name: nativeCurrency.name.trim() } : {}),
						symbol: nativeCurrency.symbol,
						decimals: nativeCurrency.decimals,
						...(nativeCurrency.slip44 != null ?
							{ caip19: caip19Slip44(entityId.$network.chainId, nativeCurrency.slip44) }
						:	{}),
						...(iconMedia != null ?
							{ $icon: iconMedia }
						:	{}),
					}
				}

				const caip19 = caip19Erc20(
					entityId.$network.chainId,
					entityId.$contract.address,
				)
				const assetPlatform = await findCoingeckoAssetPlatformByChainId(
					publicEnv,
					entityId.$network.chainId,
				)
				if (assetPlatform == null) {
					throw new Error('Coingecko_Rest: no asset platform for chain')
				}

				const coin = await getCoingeckoCoinByAssetPlatformContract({
					publicEnv,
					assetPlatformId: assetPlatform.id,
					contractAddress: entityId.$contract.address,
				})

				if (coin == null) {
					throw new Error('Coingecko_Rest: ERC-20 contract not found on asset platform')
				}

				const coinId = coinIdByWireId[coin.id] ?? CoinId.Unknown
				const decimals = (
					coin.detail_platforms?.[assetPlatform.id]?.decimal_place
					?? Object.values(coin.detail_platforms ?? {})
						.find((platform) => typeof platform.decimal_place === 'number')
						?.decimal_place
					?? decimalsByCoinId[coinId]
				)
				const iconUrl = pickCoingeckoCoinImageUrl(coin)
				const iconMedia = (
					iconUrl == null || iconUrl.trim() === '' ?
						undefined
					:	{
							[EntityMetaKey.Id]: { url: iconUrl },
							type: MediaType.Image,
						}
				)

				return {
					coinId,
					symbol: coin.symbol.trim().toUpperCase(),
					...(coin.name.trim() !== '' ? { name: coin.name.trim() } : {}),
					...(decimals != null ? { decimals } : {}),
					caip19,
					...(iconMedia != null ?
						{ $icon: iconMedia }
					:	{}),
				}
			},
		}),
		defineEntityResolver({
			entityType: EntityType.Market,
			resolve: async () => ({}),
		}),
		defineEntityResolver({
			entityType: EntityType.MarketPrice,
			resolve: async (entityId, context) => {
				const { sourcePublicEnv } = await import('$/resolvers/$resolvers.ts')
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoingeckoCoinMarketSpot } = await import('$/sources/Coingecko/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coingecko_Rest)
				const coinId = (
					entityId.$market.$base.kind === MarketAssetKind.Coin ?
						entityId.$market.$base.$coin.coinId
					:	undefined
				)
				if (coinId == null) throw new Error('Coingecko_Rest: market base is not a catalog coin')
				const coingeckoId = idByCoinId[coinId]
				if (coingeckoId == null) throw new Error('Coingecko_Rest: coin price not mapped')

				const spot = await getCoingeckoCoinMarketSpot(
					publicEnv,
					coingeckoId,
				)
				if (spot == null) throw new Error('Coingecko_Rest: coin market spot not returned')
				const { usd, lastUpdatedAtSec, coin } = spot
				const eth = coin.platforms?.ethereum?.trim()
				const caip19 = (
					eth != null && /^0x[a-fA-F0-9]{40}$/.test(eth) ?
						caip19Erc20(1, eth.toLowerCase() as `0x${string}`)
					: coin.id === 'ethereum' ?
						caip19Slip44(1, Slip44.Ether)
					:	undefined
				)

				return {
					[EntityMetaKey.Id]: entityId,
					price: BigInt(Math.round(usd * 1e8)),
					timestampNs: BigInt(Math.floor(lastUpdatedAtSec)) * 1_000_000_000n,
					updatedAt: lastUpdatedAtSec * 1000,
					transport: 'coingecko-coins-id-market-data-usd-1e8',
					providerAssetId: coingeckoId,
					...(caip19 != null ? { caip19 } : {}),
				}
			},
		}),
		defineEntityResolver({
			entityType: EntityType.MarketPriceRange,
			resolve: async (entityId, context) => {
				const { sourcePublicEnv } = await import('$/resolvers/$resolvers.ts')
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoingeckoCoinOhlc } = await import('$/sources/Coingecko/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coingecko_Rest)
				if (entityId.rangeType !== MarketPriceRangeType.OHLCCandles) throw new Error('Coingecko_Rest: unsupported range type')
				if (entityId.timeInterval.unit !== MarketTimeIntervalUnit.Day) {
					throw new Error('Coingecko_Rest: OHLC timeInterval must be day-based')
				}
				const coinId = (
					entityId.$market.$base.kind === MarketAssetKind.Coin ?
						entityId.$market.$base.$coin.coinId
					:	undefined
				)
				if (coinId == null) throw new Error('Coingecko_Rest: OHLC market base is not a catalog coin')
				const coingeckoId = idByCoinId[coinId]
				if (coingeckoId == null) throw new Error('Coingecko_Rest: OHLC coin not mapped')
				const rows = await getCoingeckoCoinOhlc({
					publicEnv,
					coingeckoId,
					vs: 'usd',
					days: entityId.timeInterval.value,
				})
				return {
					pointCount: rows.length,
					rangePayload: JSON.stringify(rows),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$coins',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				return (
					Object.entries(idByCoinId)
						.filter(([coinId]) => coinById[coinId as keyof typeof coinById] != null)
						.map(([coinId]) => ({
							[EntityMetaKey.Id]: {
								coinId: coinId as CoinId,
							},
						}))
				)
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$markets',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				return (
					Object.entries(idByCoinId)
						.filter(([coinId]) => coinById[coinId as keyof typeof coinById] != null)
						.map(([coinId]) => ({
							[EntityMetaKey.Id]: {
								$base: {
									kind: MarketAssetKind.Coin,
									$coin: { coinId: coinId as CoinId },
								},
								$quote: {
									kind: MarketAssetKind.Currency,
									iso4217: 'USD',
								},
								venue: MarketVenue.SpotIndex,
							} as const,
						}))
				)
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$marketPrices',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				return (
					Object.entries(idByCoinId)
						.filter(([coinId]) => coinById[coinId as keyof typeof coinById] != null)
						.map(([coinId]) => ({
							[EntityMetaKey.Id]: {
								$market: {
									$base: {
										kind: MarketAssetKind.Coin,
										$coin: { coinId: coinId as CoinId },
									},
									$quote: {
										kind: MarketAssetKind.Currency,
										iso4217: 'USD',
									},
									venue: MarketVenue.SpotIndex,
								} as const,
							},
						}))
				)
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$marketPriceRanges',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				return (
					Object.entries(idByCoinId)
						.filter(([coinId]) => coinById[coinId as keyof typeof coinById] != null)
						.flatMap(
							([coinId]) => [...coingeckoOhlcDayWindowLengths].map((value) => ({
								[EntityMetaKey.Id]: {
									$market: {
										$base: {
											kind: MarketAssetKind.Coin,
											$coin: { coinId: coinId as CoinId },
										},
										$quote: {
											kind: MarketAssetKind.Currency,
											iso4217: 'USD',
										},
										venue: MarketVenue.SpotIndex,
									} as const,
									timeInterval: {
										unit: MarketTimeIntervalUnit.Day,
										value,
									},
									rangeType: MarketPriceRangeType.OHLCCandles,
								},
							})),
						)
				)
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$coinInstances',
			resolve: async (entityId, context) => {
				const { stringify } = await import('devalue')
				const { sourcePublicEnv } = await import('$/resolvers/$resolvers.ts')
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoingeckoCoinWithAssetPlatforms } = await import('$/sources/Coingecko/Rest/queries.ts')
				type CoinInstanceEntityId = import('$/schema/$schema.ts').EntityId<typeof schema, EntityType.CoinInstance>
				const publicEnv = sourcePublicEnv(context, Source.Coingecko_Rest)
				const coingeckoId = idByCoinId[entityId.coinId]
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

				const seenKeys = new Set<string>()
				const rows: { [EntityMetaKey.Id]: CoinInstanceEntityId }[] = []

				const isEvmContractAddress = (value: string) => (
					/^0x[a-fA-F0-9]{40}$/.test(value.trim())
				)

				const pushId = (id: CoinInstanceEntityId) => {
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
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketsWithCoinAsBase',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>) => {
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				if (idByCoinId[entityId.coinId] == null) {
					return []
				}
				return (
					[
						{
							[EntityMetaKey.Id]: {
								$base: {
									kind: MarketAssetKind.Coin,
									$coin: { coinId: entityId.coinId },
								},
								$quote: {
									kind: MarketAssetKind.Currency,
									iso4217: 'USD',
								},
								venue: MarketVenue.SpotIndex,
							} as const,
						},
					]
				)
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketsWithCoinAsQuote',
			resolve: async () => (
				[]
			),
		}),
		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketPrice',
			resolve: async (entityId) => {
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				if (idByCoinId[entityId.coinId] == null) return undefined
				return (
					{
						[EntityMetaKey.Id]: {
							$market: {
								$base: {
									kind: MarketAssetKind.Coin,
									$coin: { coinId: entityId.coinId },
								},
								$quote: {
									kind: MarketAssetKind.Currency,
									iso4217: 'USD',
								},
								venue: MarketVenue.SpotIndex,
							} as const,
						},
					}
				)
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketPriceRanges',
			resolve: async (entityId) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				if (coinById[entityId.coinId] == null || idByCoinId[entityId.coinId] == null) {
					return []
				}
				return [...coingeckoOhlcDayWindowLengths].map((value) => (
					{
						[EntityMetaKey.Id]: {
							$market: {
								$base: {
									kind: MarketAssetKind.Coin,
									$coin: { coinId: entityId.coinId },
								},
								$quote: {
									kind: MarketAssetKind.Currency,
									iso4217: 'USD',
								},
								venue: MarketVenue.SpotIndex,
							} as const,
							timeInterval: {
								unit: MarketTimeIntervalUnit.Day,
								value,
							},
							rangeType: MarketPriceRangeType.OHLCCandles,
						},
					}
				))
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.CoinInstance,
			fieldName: '$$marketsWithInstanceAsBase',
			resolve: async () => (
				[]
			),
		}),
		defineEntityFieldResolver({
			entityType: EntityType.CoinInstance,
			fieldName: '$$marketsWithInstanceAsQuote',
			resolve: async () => (
				[]
			),
		}),
		defineEntityFieldResolver({
			entityType: EntityType.Market,
			fieldName: '$$baseCoin',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Market>) => (
				entityId.$base.kind === MarketAssetKind.Coin ?
					{
						[EntityMetaKey.Id]: {
							coinId: entityId.$base.$coin.coinId,
						},
					}
				:	undefined
			),
		}),
		defineEntityFieldResolver({
			entityType: EntityType.Market,
			fieldName: '$$marketPrices',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Market>) => (
				[
					{
						[EntityMetaKey.Id]: {
							$market: entityId,
						},
					},
				]
			),
		}),
		defineEntityFieldResolver({
			entityType: EntityType.Market,
			fieldName: '$$marketPriceRanges',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Market>) => (
				[...coingeckoOhlcDayWindowLengths].map((value) => (
					{
						[EntityMetaKey.Id]: {
							$market: entityId,
							timeInterval: {
								unit: MarketTimeIntervalUnit.Day,
								value,
							},
							rangeType: MarketPriceRangeType.OHLCCandles,
						},
					}
				))
			),
		}),
		defineEntityFieldResolver({
			entityType: EntityType.MarketPrice,
			fieldName: '$$parentMarket',
			resolve: async (entityId: EntityId<typeof schema, EntityType.MarketPrice>) => (
				{
					[EntityMetaKey.Id]: entityId.$market,
				}
			),
		}),
		defineEntityFieldResolver({
			entityType: EntityType.MarketPriceRange,
			fieldName: '$$parentMarket',
			resolve: async (entityId: EntityId<typeof schema, EntityType.MarketPriceRange>) => (
				{
					[EntityMetaKey.Id]: entityId.$market,
				}
			),
		}),
	],
}
