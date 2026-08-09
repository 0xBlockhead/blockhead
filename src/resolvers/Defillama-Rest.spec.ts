import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { CoinId } from '$/constants/Coin.ts'
import { seededCoinSpotUsdMarketByCoinId } from '$/constants/MarketCatalog.ts'
import { marketSelectorFromCatalogCoinCurrencyMarket } from '$/resolvers/market.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const getCurrentPrices = vi.hoisted(() => vi.fn())
const getProCurrentPrices = vi.hoisted(() => vi.fn())
const getHistoricalPrices = vi.hoisted(() => vi.fn())
const getProHistoricalPrices = vi.hoisted(() => vi.fn())
const getChart = vi.hoisted(() => vi.fn())
const getProChart = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Defillama/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Defillama/Rest/queries.ts')>(),
	getCurrentPrices,
	getProCurrentPrices,
	getHistoricalPrices,
	getProHistoricalPrices,
	getChart,
	getProChart,
}))

const { default: defillama } = await import('$/resolvers/Defillama-Rest.ts')

const market = marketSelectorFromCatalogCoinCurrencyMarket(
	seededCoinSpotUsdMarketByCoinId[CoinId.ETH]
)
const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {
		PUBLIC_DEFILLAMA_PRO_API_KEY: 'pro key',
	},
}
const feedKey = 'coingecko:ethereum'
const timestampSeconds = 1_725_000_000
const historicalTimestampSeconds = 1_700_000_000
const marketPriceResolver = defillama.resolvers.find((resolver) => (
	resolver.entityType === EntityType.MarketPrice
	&& '$$quotes' in resolver.projections
))
const marketTimestampResolver = defillama.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Market_Timestamp
))

if (
	marketPriceResolver == null
	|| marketTimestampResolver == null
)
	throw new Error('Defillama REST price resolvers are not registered')
const resolveMarketPrice = (
	'Market' in marketPriceResolver.resolve ?
		marketPriceResolver.resolve.Market.resolve
	:
		undefined
)
if (resolveMarketPrice == null)
	throw new Error('Defillama REST MarketPrice resolver is not registered')

describe('Defillama REST current-price projection', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('matches encoded response keys and projects the quote and timestamp', async () => {
		getProCurrentPrices.mockResolvedValue({
			coins: {
				'coingecko%3Aethereum': {
					price: 3_500.125,
					symbol: 'ETH',
					timestamp: timestampSeconds,
				},
			},
		})

		await expect(resolveMarketPrice({
			$market: market,
		}, context)).resolves.toEqual([{
			[EntityMetaKey.Selector]: {
				$market: market,
				timestampMs: timestampSeconds * 1_000,
				feedKey,
			},
		}])
		await expect(marketTimestampResolver.resolve.MarketTimestampMsFeedKey.resolve({
			$market: market,
			timestampMs: timestampSeconds * 1_000,
			feedKey,
		}, context)).resolves.toEqual({
			price: 350_012_500_000n,
			transport: 'defillama-current-usd-1e8',
			providerAssetId: feedKey,
		})
		expect(getProCurrentPrices).toHaveBeenCalledWith({
			coins: [feedKey],
			publicEnv: context.publicEnv,
		})
		expect(getCurrentPrices).not.toHaveBeenCalled()
		expect(getProHistoricalPrices).not.toHaveBeenCalled()
		expect(getChart).not.toHaveBeenCalled()
		expect(getProChart).not.toHaveBeenCalled()
	})

	it('falls back to historical prices when the current clock does not match', async () => {
		getProCurrentPrices.mockResolvedValue({
			coins: {
				[feedKey]: {
					price: 3_500.125,
					symbol: 'ETH',
					timestamp: timestampSeconds,
				},
			},
		})
		getProHistoricalPrices.mockResolvedValue({
			coins: {
				[feedKey]: {
					price: 2_800.5,
					symbol: 'ETH',
					timestamp: historicalTimestampSeconds,
				},
			},
		})

		await expect(marketTimestampResolver.resolve.MarketTimestampMsFeedKey.resolve({
			$market: market,
			timestampMs: historicalTimestampSeconds * 1_000,
			feedKey,
		}, context)).resolves.toEqual({
			price: 280_050_000_000n,
			transport: 'defillama-historical-usd-1e8',
			providerAssetId: feedKey,
		})
		expect(getProHistoricalPrices).toHaveBeenCalledWith({
			coins: [feedKey],
			timestamp: historicalTimestampSeconds,
			publicEnv: context.publicEnv,
		})
		expect(getChart).not.toHaveBeenCalled()
		expect(getProChart).not.toHaveBeenCalled()
	})

	it('returns no quote and fails an addressed timestamp when the row is missing', async () => {
		getProCurrentPrices.mockResolvedValue({})
		getProHistoricalPrices.mockResolvedValue({})

		await expect(resolveMarketPrice({
			$market: market,
		}, context)).resolves.toEqual([])
		await expect(marketTimestampResolver.resolve.MarketTimestampMsFeedKey.resolve({
			$market: market,
			timestampMs: timestampSeconds * 1_000,
			feedKey,
		}, context)).rejects.toThrow('historical price not returned')
	})

	it('uses the public endpoint when Pro credentials are absent', async () => {
		getCurrentPrices.mockResolvedValue({
			coins: {
				[feedKey]: {
					price: 3_500.125,
					symbol: 'ETH',
					timestamp: timestampSeconds,
				},
			},
		})

		await expect(resolveMarketPrice({
			$market: market,
		}, {
			...context,
			publicEnv: {},
		})).resolves.toHaveLength(1)
		expect(getCurrentPrices).toHaveBeenCalledWith({
			coins: [feedKey],
		})
		expect(getProCurrentPrices).not.toHaveBeenCalled()
	})

	it('admits price observations but no OHLC candles', () => {
		expect(defillama.resolvers.some((resolver) => (
			resolver.entityType === EntityType.MarketPrice
			&& '$$quotes' in resolver.projections
		))).toBe(true)
		expect(defillama.resolvers.some((resolver) => (
			resolver.entityType === EntityType.Market_TimeInterval_Timestamp
		))).toBe(false)
		expect(defillama.resolvers.some((resolver) => (
			resolver.entityType === EntityType.Market
			&& '$$marketTimeIntervalTimestamps' in resolver.projections
		))).toBe(false)
	})
})

describe('Defillama REST global catalog resolvers', () => {
	it('emits catalog-backed $$coins with authoritative resolveCount', async () => {
		const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
		const resolver = defillama.resolvers.find((candidate) => (
			candidate.entityType === EntityType._Global
			&& '$$coins' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Defillama global coin resolver is not registered')

		const rows = await resolver.resolve['Scope'].resolve({
			scope: 'global',
		}, context)

		expect(rows).toHaveLength(Object.keys(defillamaCurrentPriceIdByCoinId).length)
		expect(rows).toContainEqual({
			[EntityMetaKey.Selector]: {
				coinId: CoinId.ETH,
			},
		})
		expect(resolver.projections.$$coins.select(rows)).toEqual(rows)
		expect(resolver.projections.$$coins.resolveCount(rows)).toBe(rows.length)
	})

	it('windows $$marketPrices while resolveCount stays complete', async () => {
		const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
		const coins = Object.fromEntries(
			Object.values(defillamaCurrentPriceIdByCoinId)
				.map((requestedId) => [
					requestedId,
					{
						price: 1,
						symbol: 'X',
						timestamp: timestampSeconds,
					},
				])
		)
		getProCurrentPrices.mockResolvedValueOnce({
			coins,
		})

		const resolver = defillama.resolvers.find((candidate) => (
			candidate.entityType === EntityType._Global
			&& '$$marketPrices' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Defillama global $$marketPrices resolver is not registered')

		const snapshot = await resolver.resolve['Scope'].resolve({
			scope: 'global',
		}, {
			...context,
			pagination: { limit: 2 },
		})

		expect(snapshot.marketPrices).toHaveLength(2)
		expect(snapshot.marketPriceCount).toBe(Object.keys(defillamaCurrentPriceIdByCoinId).length)
		expect(resolver.projections.$$marketPrices.select(snapshot)).toEqual(snapshot.marketPrices)
		expect(resolver.projections.$$marketPrices.resolveCount(snapshot)).toBe(snapshot.marketPriceCount)
	})
})
