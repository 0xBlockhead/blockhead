import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { CoinId } from '$/constants/Coin.ts'
import {
	MarketAssetKind,
	MarketKind,
} from '$/constants/Market.ts'
import { Iso4217 } from '$/constants/Currency.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getCoin = vi.hoisted(() => vi.fn())
const getSimplePrice = vi.hoisted(() => vi.fn())
const getDerivativesExchange = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Coingecko/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Coingecko/Rest/queries.ts')>(),
	getCoin,
	getSimplePrice,
	getDerivativesExchange,
}))

const { default: coingecko } = await import('$/resolvers/Coingecko-Rest.ts')

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('CoinGecko resolver collapse', () => {
	it('retains each unique REST and derivative projection under one source', () => {
		expect(coingecko.source).toBe(Source.Coingecko_Rest)
		expect([
		[EntityType.Coin, '$$timestamps'],
		[EntityType.Coin, '$$marketsWithCoinAsBase'],
		[EntityType.Market, '$$derivativeTimestamps'],
		[EntityType.Market, '$$marketTimeIntervalTimestamps'],
		[EntityType.Market_Derivative_Timestamp, 'fundingRate'],
		[EntityType.Market_Derivative_Timestamp, 'markPrice'],
		[EntityType.Market_Derivative_Timestamp, 'indexPrice'],
		[EntityType.Market_Timestamp, 'price'],
		[EntityType.Market_TimeInterval_Timestamp, 'open'],
		[EntityType.Coin_Timestamp, 'marketCap'],
		[EntityType.Coin_Timestamp, 'change24hPercent'],
		[EntityType.Coin_Timestamp, 'totalSupply'],
	].map(([entityType, field]) => (
		coingecko.resolvers.filter((resolver) => (
			resolver.entityType === entityType
			&& field in resolver.projections
		)).length
	))).toEqual([
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
	])
	})
})

describe('CoinGecko global market prices resolver', () => {
	it('windows catalog spots while resolveCount stays complete', async () => {
		const resolver = coingecko.resolvers.find((candidate) => (
			candidate.entityType === EntityType._Global
			&& '$$marketPrices' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Coingecko global $$marketPrices resolver is not registered')

		const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
		getSimplePrice.mockImplementation(async ({ ids }: { ids: string }) => (
			Object.fromEntries(
				ids.split(',').flatMap((id) => (
					id === idByCoinId[CoinId.BTC] || id === idByCoinId[CoinId.ETH] ?
						[[id, {
							usd: id === idByCoinId[CoinId.BTC] ? 100 : 10,
							last_updated_at: 1_700_000_000,
							usd_market_cap: 1_000_000_000_000,
							usd_24h_vol: 30_000_000_000,
							usd_24h_change: 1.5,
						}]]
					:
						[]
				))
			)
		))

		const snapshot = await resolver.resolve.Scope.resolve(
			{ scope: '_Global' },
			{
				...resolverContext,
				pagination: { limit: 1 },
			}
		)

		expect(snapshot.marketPrices).toHaveLength(1)
		expect(snapshot.marketPriceCount).toBe(2)
		expect(resolver.projections.$$marketPrices.select(snapshot)).toEqual(snapshot.marketPrices)
		expect(resolver.projections.$$marketPrices.resolveCount(snapshot)).toBe(2)
		expect(snapshot.marketPrices[0]?.[EntityMetaKey.Selector].feedKey).toBe(idByCoinId[CoinId.BTC])
		expect(getSimplePrice).toHaveBeenCalledWith(expect.objectContaining({
			include_market_cap: true,
			include_24hr_vol: true,
			include_24hr_change: true,
		}))
	})
})

describe('CoinGecko derivative timestamp resolver', () => {
	it('projects enrolled markPrice and indexPrice from last/index wire', async () => {
		getDerivativesExchange.mockResolvedValue({
			name: 'Binance (Futures)',
			trade_volume_24h_btc: 50,
			tickers: [{
				coin_id: 'bitcoin',
				target_coin_id: 'tether',
				symbol: 'BTCUSDT',
				last: 100_000.25,
				index: 99_999.5,
				last_traded: 1_700_000_000,
				open_interest_usd: 1_000_000,
				index_basis_percentage: 0.12,
				funding_rate: 0.01,
				volume_24h: 5_000,
			}],
		})

		const resolver = coingecko.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Market_Derivative_Timestamp
			&& 'markPrice' in candidate.projections
			&& 'fundingRate' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Coingecko Market_Derivative_Timestamp mark/index resolver missing')

		const $market = {
			$base: {
				kind: MarketAssetKind.Coin,
				assetKey: CoinId.BTC,
			},
			$quote: {
				kind: MarketAssetKind.Currency,
				assetKey: Iso4217.USD,
			},
			$marketVenue: { marketVenueId: MarketVenueId.Binance },
			marketKind: MarketKind.Perpetual,
		}
		const snapshot = await resolver.resolve.MarketTimestampMsFeedKey.resolve(
			{
				$market,
				timestampMs: 1_700_000_000_000,
				feedKey: 'coingecko:BTCUSDT',
			},
			resolverContext
		)

		expect(snapshot.markPrice).toBe(BigInt(Math.round(100_000.25 * 1e8)))
		expect(snapshot.indexPrice).toBe(BigInt(Math.round(99_999.5 * 1e8)))
		expect(snapshot).not.toHaveProperty('volume_24h')
		expect(snapshot).not.toHaveProperty('trade_volume_24h_btc')
		expect(resolver.projections.markPrice(snapshot)).toBe(snapshot.markPrice)
		expect(resolver.projections.indexPrice(snapshot)).toBe(snapshot.indexPrice)
		expect(getDerivativesExchange).toHaveBeenCalledWith({
			publicEnv: {},
			id: 'binance_futures',
		})
	})
})

describe('CoinGecko coin detail and timestamp leftovers', () => {
	it('omits empty logo for ZeroOrOne $logo', async () => {
		getCoin.mockResolvedValue({
			id: 'ethereum',
			name: 'Ethereum',
			symbol: 'eth',
			image: {
				large: '',
			},
			market_data: {
				last_updated: '2026-08-06T12:00:00.000Z',
			},
		})

		const resolver = coingecko.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Coin
			&& 'name' in candidate.projections
			&& '$logo' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Coingecko coin detail resolver missing')

		const coin = await resolver.resolve.CoinId.resolve(
			{ coinId: CoinId.ETH },
			resolverContext
		)
		expect(coin.name).toBe('Ethereum')
		expect(coin).not.toHaveProperty('$logo')
	})

	it('projects enrolled Coin_Timestamp fields and omits supply/volume leftovers', async () => {
		getCoin.mockResolvedValue({
			id: 'ethereum',
			name: 'Ethereum',
			symbol: 'eth',
			market_data: {
				last_updated: '2026-08-06T12:00:00.000Z',
				market_cap_rank: 2,
				market_cap: {
					usd: 400_000_000_000,
				},
				total_volume: {
					usd: 10_000_000_000,
				},
				price_change_percentage_24h: 1.25,
				price_change_percentage_7d: -0.5,
				circulating_supply: 120_000_000,
				total_supply: 120_000_000,
				max_supply: null,
			},
		})

		const resolver = coingecko.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Coin_Timestamp
			&& 'marketCap' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Coingecko Coin_Timestamp resolver missing')

		const snapshot = await resolver.resolve.CoinTimestampMsSource.resolve(
			{
				$coin: { coinId: CoinId.ETH },
				timestampMs: Date.parse('2026-08-06T12:00:00.000Z'),
				source: Source.Coingecko_Rest,
			},
			resolverContext
		)

		expect(snapshot).toEqual({
			marketCapRank: 2,
			marketCap: 400_000_000_000n,
			marketCapUsd: 400_000_000_000,
			change24hPercent: 1.25,
			totalSupply: 120_000_000n,
			transport: 'coingecko-coin',
			providerAssetId: 'ethereum',
		})
		expect(snapshot).not.toHaveProperty('circulatingSupply')
		expect(snapshot).not.toHaveProperty('maxSupply')
		expect(snapshot).not.toHaveProperty('totalVolume')
		expect(snapshot).not.toHaveProperty('change7dPercent')
	})
})
