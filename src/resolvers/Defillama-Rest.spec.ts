import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { CoinId } from '$/constants/Coin.ts'
import {
	marketOhlcDailyTimeInterval,
} from '$/constants/Market.ts'
import { seededCoinSpotUsdMarketByCoinId } from '$/constants/MarketCatalog.ts'
import { marketSelectorFromCatalogCoinCurrencyMarket } from '$/resolvers/market.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
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
const marketChartListResolver = defillama.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Market
	&& '$$marketTimeIntervalTimestamps' in resolver.projections
))
const marketChartPointResolver = defillama.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Market_TimeInterval_Timestamp
	&& 'close' in resolver.projections
))

if (
	marketPriceResolver == null
	|| marketTimestampResolver == null
	|| marketChartListResolver == null
	|| marketChartPointResolver == null
)
	throw new Error('Defillama REST price/chart resolvers are not registered')
const resolveMarketPrice = (
	'Market' in marketPriceResolver.resolve ?
		marketPriceResolver.resolve.Market.resolve
	:
		undefined
)
const resolveMarketChartList = (
	'BaseQuoteMarketVenueKind' in marketChartListResolver.resolve ?
		marketChartListResolver.resolve.BaseQuoteMarketVenueKind.resolve
	:
		undefined
)
const resolveMarketChartPoint = (
	'MarketTimeIntervalTimestampMs' in marketChartPointResolver.resolve ?
		marketChartPointResolver.resolve.MarketTimeIntervalTimestampMs.resolve
	:
		undefined
)
if (
	resolveMarketPrice == null
	|| resolveMarketChartList == null
	|| resolveMarketChartPoint == null
)
	throw new Error('Defillama REST MarketPrice/chart resolvers are not registered')

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
})

describe('Defillama REST daily chart projection', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('projects close-only daily samples from the Pro chart series', async () => {
		getProChart.mockResolvedValue({
			coins: {
				[feedKey]: {
					symbol: 'ETH',
					confidence: 0.99,
					prices: [
						{
							timestamp: historicalTimestampSeconds,
							price: 2_800.5,
						},
						{
							timestamp: timestampSeconds,
							price: 3_500.125,
						},
					],
				},
			},
		})

		await expect(resolveMarketChartList(market, context)).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$market: market,
					timeInterval: marketOhlcDailyTimeInterval,
					timestampMs: historicalTimestampSeconds * 1_000,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.Market_TimeInterval_Timestamp, [], 'close')]: 280_050_000_000n,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$market: market,
					timeInterval: marketOhlcDailyTimeInterval,
					timestampMs: timestampSeconds * 1_000,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.Market_TimeInterval_Timestamp, [], 'close')]: 350_012_500_000n,
				},
			},
		])
		await expect(resolveMarketChartPoint({
			$market: market,
			timeInterval: marketOhlcDailyTimeInterval,
			timestampMs: timestampSeconds * 1_000,
		}, context)).resolves.toEqual({
			[EntityMetaKey.Selector]: {
				$market: market,
				timeInterval: marketOhlcDailyTimeInterval,
				timestampMs: timestampSeconds * 1_000,
			},
			close: 350_012_500_000n,
		})
		expect(getProChart).toHaveBeenCalledWith({
			coins: [feedKey],
			span: 90,
			period: '1d',
			publicEnv: context.publicEnv,
		})
		expect(getChart).not.toHaveBeenCalled()
		expect(marketChartPointResolver.projections).not.toHaveProperty('open')
		expect(marketChartPointResolver.projections).not.toHaveProperty('high')
		expect(marketChartPointResolver.projections).not.toHaveProperty('low')
	})
})
