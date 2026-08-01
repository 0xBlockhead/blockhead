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
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const getCurrentPrices = vi.hoisted(() => vi.fn())
const getProCurrentPrices = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Defillama/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Defillama/Rest/queries.ts')>(),
	getCurrentPrices,
	getProCurrentPrices,
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
const marketPriceResolver = defillama.resolvers.find((resolver) => (
	resolver.entityType === EntityType.MarketPrice
	&& '$$quotes' in resolver.projections
))
const marketTimestampResolver = defillama.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Market_Timestamp
))

if (marketPriceResolver == null || marketTimestampResolver == null)
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
	})

	it('returns no quote and fails an addressed timestamp when the row is missing', async () => {
		getProCurrentPrices.mockResolvedValue({})

		await expect(resolveMarketPrice({
			$market: market,
		}, context)).resolves.toEqual([])
		await expect(marketTimestampResolver.resolve.MarketTimestampMsFeedKey.resolve({
			$market: market,
			timestampMs: timestampSeconds * 1_000,
			feedKey,
		}, context)).rejects.toThrow('current price not returned')
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
