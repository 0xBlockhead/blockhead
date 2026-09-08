import { afterEach, describe, expect, it, vi } from 'vitest'

import { CoinId } from '$/constants/Coin.ts'
import { seededCoinSpotUsdMarketByCoinId } from '$/constants/MarketCatalog.ts'
import { marketSelectorFromCatalogCoinCurrencyMarket } from '$/resolvers/market.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getSimplePrice = vi.hoisted(() => vi.fn())
const getProCurrentPrices = vi.hoisted(() => vi.fn())
const getProHistoricalPrices = vi.hoisted(() => vi.fn())
const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Coingecko/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Coingecko/Rest/queries.ts')>(),
	getSimplePrice,
}))
vi.mock('$/sources/Defillama/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Defillama/Rest/queries.ts')>(),
	getProCurrentPrices,
	getProHistoricalPrices,
}))
vi.mock('$/sources/_runtime/http.ts', () => ({ sourceFetch }))

const { default: coingecko } = await import('$/resolvers/Coingecko-Rest.ts')
const { default: defillama } = await import('$/resolvers/Defillama-Rest.ts')
const { default: ipfs } = await import('$/resolvers/Ipfs-Rest.ts')

const market = marketSelectorFromCatalogCoinCurrencyMarket(
	seededCoinSpotUsdMarketByCoinId[CoinId.ETH]
)
const context = {
	filters: [], sorts: [], pagination: {}, selectorKeys: [], parentSelectorKeys: [], sources: [],
	publicEnv: { PUBLIC_DEFILLAMA_PRO_API_KEY: 'test key' },
}
const providerTimestampMs = 1_725_000_000_000
const historicalTimestampMs = 1_700_000_000_000
const feedKey = 'ethereum'

const coingeckoMarketTimestamp = coingecko.resolvers.find((candidate) => (
	candidate.entityType === EntityType.Market_Timestamp
))
const defillamaMarketTimestamp = defillama.resolvers.find((candidate) => (
	candidate.entityType === EntityType.Market_Timestamp
))

describe('historical-truth authority', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('uses Coingecko provider time and rejects a selector at an arbitrary old time', async () => {
		getSimplePrice.mockResolvedValue({ ethereum: { usd: 3_500, last_updated_at: providerTimestampMs / 1_000 } })
		if (coingeckoMarketTimestamp == null || !('MarketTimestampMsFeedKey' in coingeckoMarketTimestamp.resolve))
			throw new Error('Coingecko Market_Timestamp resolver is not registered')
		const resolve = coingeckoMarketTimestamp.resolve.MarketTimestampMsFeedKey.resolve
		await expect(resolve({ $market: market, feedKey, timestampMs: providerTimestampMs }, context)).resolves.toMatchObject({
			transport: 'coingecko-simple-price-usd-1e8', providerAssetId: feedKey,
		})
		await expect(resolve({ $market: market, feedKey, timestampMs: historicalTimestampMs }, context))
			.rejects.toThrow('does not match spot clock')
	})

	it('records IPFS capture time as current-only topology evidence', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(providerTimestampMs)
		sourceFetch.mockResolvedValue({ ok: true })
		const resolver = ipfs.resolvers.find((candidate) => candidate.entityType === EntityType._GlobalIpfsAccess)
		if (resolver == null || !('Scope' in resolver.resolve)) throw new Error('IPFS access resolver is not registered')
		const snapshot = await resolver.resolve.Scope.resolve({ scope: '_GlobalIpfsAccess' })
		expect(snapshot.$$timestamps[0][EntityMetaKey.Selector]).toMatchObject({
			source: Source.Ipfs_Rest, timestampMs: providerTimestampMs,
		})
		expect(ipfs.resolvers.some((candidate) => candidate.entityType === EntityType._GlobalIpfsAccess_Timestamp)).toBe(false)
	})

	it('replays Defillama historical provider time and rejects a non-returned old clock', async () => {
		getProCurrentPrices.mockResolvedValue({ coins: { 'coingecko%3Aethereum': { price: 3_500, timestamp: providerTimestampMs / 1_000 } } })
		getProHistoricalPrices.mockResolvedValue({ coins: { 'coingecko%3Aethereum': { price: 2_800, timestamp: historicalTimestampMs / 1_000 } } })
		if (defillamaMarketTimestamp == null || !('MarketTimestampMsFeedKey' in defillamaMarketTimestamp.resolve))
			throw new Error('Defillama Market_Timestamp resolver is not registered')
		const resolve = defillamaMarketTimestamp.resolve.MarketTimestampMsFeedKey.resolve
		await expect(resolve({ $market: market, feedKey: 'coingecko:ethereum', timestampMs: historicalTimestampMs }, context)).resolves.toMatchObject({
			transport: 'defillama-historical-usd-1e8', providerAssetId: 'coingecko:ethereum',
		})
		getProHistoricalPrices.mockResolvedValue({ coins: {} })
		await expect(resolve({ $market: market, feedKey: 'coingecko:ethereum', timestampMs: historicalTimestampMs - 1_000 }, context))
			.rejects.toThrow('historical price not returned')
	})
})
