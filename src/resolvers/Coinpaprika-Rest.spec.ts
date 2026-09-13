import { createResolverContext } from '../../tests/resolverContext.ts'
import { describe, expect, it, vi } from 'vitest'

import { CoinId } from '$/constants/Coin.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'
import { seededCoinSpotUsdMarketByCoinId } from '$/constants/MarketCatalog.ts'
import { marketSelectorFromCatalogCoinCurrencyMarket } from '$/resolvers/market.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { coinpaprikaCoins } from '$/sources/Coinpaprika/OpenApi/constants.ts'
import { Source } from '$/sources/Source.ts'

const getCoinById = vi.hoisted(() => vi.fn())
const getTickerById = vi.hoisted(() => vi.fn())
const getTickers = vi.hoisted(() => vi.fn())
const getExchangeMarkets = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Coinpaprika/OpenApi/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Coinpaprika/OpenApi/queries.ts')>(),
	getCoinById,
	getTickerById,
	getTickers,
	getExchangeMarkets,
}))

const { default: coinpaprikaResolvers } = await import('$/resolvers/Coinpaprika-Rest.ts')

const resolverContext = createResolverContext()

describe('Coinpaprika coin catalog resolver', () => {
	it('emits only catalog-backed canonical selectors with authoritative resolveCount', async () => {
		const resolver = coinpaprikaResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType._Global
			&& '$$coins' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Coinpaprika global coin resolver is not registered')

		const rows = await resolver.resolve['Scope'].resolve({
			scope: 'global',
		}, resolverContext)

		expect(rows).toHaveLength(coinpaprikaCoins.length)
		expect(rows).toContainEqual({
			[EntityMetaKey.Selector]: {
				coinId: CoinId.AAVE,
			},
		})
		expect(resolver.projections.$$coins.select(rows)).toEqual(rows)
		expect(resolver.projections.$$coins.resolveCount(rows)).toBe(coinpaprikaCoins.length)
	})
})

describe('Coinpaprika global market prices resolver', () => {
	it('windows catalog tickers while resolveCount stays complete', async () => {
		getTickers.mockResolvedValue([
			{
				id: 'eth-ethereum',
				last_updated: '2026-08-04T09:00:00Z',
				quotes: { USD: { price: 10 } },
			},
			{
				id: 'btc-bitcoin',
				last_updated: '2026-08-04T09:00:00Z',
				quotes: { USD: { price: 100 } },
			},
			{
				id: 'unknown-coin',
				last_updated: '2026-08-04T09:00:00Z',
			},
			{
				last_updated: '2026-08-04T09:00:00Z',
				quotes: { USD: { price: 10 } },
			},
			{
				id: 'eth-ethereum',
				last_updated: '2026-08-04T09:00:00Z',
			},
			{
				id: 'eth-ethereum',
				last_updated: '2026-08-04T09:00:00Z',
				quotes: { USD: { price: NaN } },
			},
		])

		const resolver = coinpaprikaResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType._Global
			&& '$$marketPrices' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Coinpaprika global $$marketPrices resolver is not registered')

		const snapshot = await resolver.resolve['Scope'].resolve({
			scope: 'global',
		}, {
			...resolverContext,
			pagination: { limit: 1 },
		})

		expect(snapshot.marketPrices).toHaveLength(1)
		expect(snapshot.marketPriceCount).toBe(2)
		expect(resolver.projections.$$marketPrices.select(snapshot)).toEqual(snapshot.marketPrices)
		expect(resolver.projections.$$marketPrices.resolveCount(snapshot)).toBe(2)
		expect(snapshot.marketPrices[0]?.[EntityMetaKey.Selector].feedKey).toBe('eth-ethereum')
		expect(snapshot.marketPrices[0]?.[EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.Market_Timestamp, [], 'price')]: 1_000_000_000n,
			[entityFieldAddressKey(EntityType.Market_Timestamp, [], 'transport')]: 'coinpaprika-usd-1e8',
			[entityFieldAddressKey(EntityType.Market_Timestamp, [], 'providerAssetId')]: 'eth-ethereum',
		})
	})
})

it('retains each Coinpaprika quote value with the provider clock that produced it', async () => {
	const resolver = coinpaprikaResolvers.resolvers.find((candidate) => (
		candidate.entityType === EntityType.MarketPrice
		&& '$$quotes' in candidate.projections
	))
	if (resolver == null)
		throw new Error('Coinpaprika quote resolver missing')
	getTickerById.mockReset()
	getTickerById
		.mockResolvedValueOnce({ id: 'eth-ethereum', last_updated: '2026-08-04T09:00:00Z', quotes: { USD: { price: 10 } } })
		.mockResolvedValueOnce({ id: 'eth-ethereum', last_updated: '2026-08-04T09:00:01Z', quotes: { USD: { price: 11 } } })
	const selector = {
		$market: marketSelectorFromCatalogCoinCurrencyMarket(seededCoinSpotUsdMarketByCoinId[CoinId.ETH]),
	}
	const first = await resolver.resolve.Market.resolve(selector, resolverContext)
	const second = await resolver.resolve.Market.resolve(selector, resolverContext)
	expect(first).toEqual([{
		[EntityMetaKey.Selector]: { ...selector, timestampMs: Date.parse('2026-08-04T09:00:00Z'), feedKey: 'eth-ethereum' },
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.Market_Timestamp, [], 'price')]: 1_000_000_000n,
			[entityFieldAddressKey(EntityType.Market_Timestamp, [], 'transport')]: 'coinpaprika-usd-1e8',
			[entityFieldAddressKey(EntityType.Market_Timestamp, [], 'providerAssetId')]: 'eth-ethereum',
		},
	}])
	expect(second).toEqual([{
		[EntityMetaKey.Selector]: { ...selector, timestampMs: Date.parse('2026-08-04T09:00:01Z'), feedKey: 'eth-ethereum' },
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.Market_Timestamp, [], 'price')]: 1_100_000_000n,
			[entityFieldAddressKey(EntityType.Market_Timestamp, [], 'transport')]: 'coinpaprika-usd-1e8',
			[entityFieldAddressKey(EntityType.Market_Timestamp, [], 'providerAssetId')]: 'eth-ethereum',
		},
	}])
	expect(getTickerById).toHaveBeenCalledTimes(2)
})

describe('Coinpaprika coin detail resolver', () => {
	it('rejects a response for a different catalog coin', async () => {
		getCoinById.mockResolvedValue({
			id: 'btc-bitcoin',
			name: 'Bitcoin',
			symbol: 'BTC',
		})
		const resolver = coinpaprikaResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Coin
			&& 'name' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Coinpaprika coin detail resolver is not registered')

		await expect(resolver.resolve['CoinId'].resolve({
			coinId: CoinId.ETH,
		}, resolverContext)).rejects.toThrow('Coinpaprika_Rest: coin response does not match requested coin')
	})
})

describe('Coinpaprika coin timestamp resolvers', () => {
	it('rejects a ticker response for a different catalog coin', async () => {
		getTickerById.mockResolvedValue({
			id: 'btc-bitcoin',
			last_updated: '2026-08-04T09:00:00Z',
		})
		const resolver = coinpaprikaResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Coin
			&& '$$timestamps' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Coinpaprika coin $$timestamps resolver is not registered')

		await expect(resolver.resolve['CoinId'].resolve({
			coinId: CoinId.ETH,
		}, resolverContext)).rejects.toThrow('Coinpaprika_Rest: ticker response does not match requested coin')
	})

	it('projects $$timestamps from the ticker clock and maps Coin_Timestamp fields', async () => {
		getTickerById.mockResolvedValue({
			id: 'eth-ethereum',
			rank: 2,
			circulating_supply: 120_000_000,
			total_supply: 120_000_000,
			max_supply: 0,
			last_updated: '2026-08-04T09:00:00Z',
			quotes: {
				USD: {
					market_cap: 400_000_000_000,
					volume_24h: 10_000_000_000,
					percent_change_24h: 1.25,
					percent_change_7d: 0.28,
					percent_change_30d: 27.39,
				},
			},
		})

		const timestampsResolver = coinpaprikaResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Coin
			&& '$$timestamps' in candidate.projections
		))
		if (timestampsResolver == null)
			throw new Error('Coinpaprika coin $$timestamps resolver is not registered')

		const timestampRows = await timestampsResolver.resolve['CoinId'].resolve({
			coinId: CoinId.ETH,
		}, resolverContext)
		expect(timestampRows).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$coin: {
						coinId: CoinId.ETH,
					},
					timestampMs: Date.parse('2026-08-04T09:00:00Z'),
					source: Source.Coinpaprika_Rest,
				},
			},
		])

		const coinTimestampResolver = coinpaprikaResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Coin_Timestamp
			&& 'marketCap' in candidate.projections
		))
		if (coinTimestampResolver == null)
			throw new Error('Coinpaprika Coin_Timestamp resolver is not registered')

		const snapshot = await coinTimestampResolver.resolve['CoinTimestampMsSource'].resolve({
			$coin: {
				coinId: CoinId.ETH,
			},
			timestampMs: Date.parse('2026-08-04T09:00:00Z'),
			source: Source.Coinpaprika_Rest,
		}, resolverContext)

		expect(snapshot).toEqual({
			marketCapRank: 2,
			marketCap: 400_000_000_000n,
			marketCapUsd: 400_000_000_000,
			change24hPercent: 1.25,
			totalSupply: 120_000_000n,
			transport: 'coinpaprika-ticker',
			providerAssetId: 'eth-ethereum',
		})
		expect(snapshot).not.toHaveProperty('circulatingSupply')
		expect(snapshot).not.toHaveProperty('maxSupply')
		expect(snapshot).not.toHaveProperty('volume24h')
		expect(snapshot).not.toHaveProperty('change7dPercent')
	})
})

describe('Coinpaprika coin detail leftovers', () => {
	it('omits empty logo for ZeroOrOne $logo', async () => {
		getCoinById.mockResolvedValue({
			id: 'eth-ethereum',
			name: 'Ethereum',
			symbol: 'ETH',
			logo: '',
			description: 'Ethereum',
			proof_type: 'Proof of Stake',
		})
		const resolver = coinpaprikaResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Coin
			&& 'name' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Coinpaprika coin detail resolver is not registered')

		const coin = await resolver.resolve['CoinId'].resolve({
			coinId: CoinId.ETH,
		}, resolverContext)

		expect(coin).toEqual({
			name: 'Ethereum',
			symbol: 'ETH',
		})
		expect(coin).not.toHaveProperty('$logo')
	})
})

describe('Coinpaprika market venue markets', () => {
	it('maps exchange markets onto catalog selectors for a known venue', async () => {
		getExchangeMarkets.mockClear()
		getExchangeMarkets.mockResolvedValue([
			{
				base_currency_id: 'btc-bitcoin',
				quote_currency_id: 'usdt-tether',
				category: 'Spot',
				pair: 'BTC/USDT',
				adjusted_volume_24h_share: 30.29,
			},
			{
				base_currency_id: 'btc-bitcoin',
				quote_currency_id: 'usd-us-dollars',
				category: 'Spot',
				pair: 'BTC/USD',
			},
			{
				base_currency_id: 'btc-bitcoin',
				quote_currency_id: 'usdt-tether',
				category: 'Perpetuals',
				pair: 'BTC/USDT',
				reported_volume_24h_share: 12.5,
			},
			{
				base_currency_id: 'btc-bitcoin',
				quote_currency_id: 'usdt-tether',
				category: 'Futures',
				pair: 'BTC/USDT-0626',
			},
			{
				base_currency_id: 'unknown-coin',
				quote_currency_id: 'usdt-tether',
				category: 'Spot',
				pair: 'UNK/USDT',
			},
		])

		const resolver = coinpaprikaResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.MarketVenue
			&& '$$markets' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Coinpaprika MarketVenue $$markets resolver is not registered')

		const rows = await resolver.resolve['MarketVenueId'].resolve({
			marketVenueId: MarketVenueId.Coinbase,
		}, resolverContext)

		expect(rows).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$base: {
						kind: 'Coin',
						assetKey: CoinId.BTC,
					},
					$quote: {
						kind: 'Currency',
						assetKey: 'USD',
					},
					$marketVenue: {
						marketVenueId: MarketVenueId.Coinbase,
					},
					marketKind: 'Spot',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$base: {
						kind: 'Coin',
						assetKey: CoinId.BTC,
					},
					$quote: {
						kind: 'Currency',
						assetKey: 'USD',
					},
					$marketVenue: {
						marketVenueId: MarketVenueId.Coinbase,
					},
					marketKind: 'Perpetual',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$base: {
						kind: 'Coin',
						assetKey: CoinId.BTC,
					},
					$quote: {
						kind: 'Currency',
						assetKey: 'USD',
					},
					$marketVenue: {
						marketVenueId: MarketVenueId.Coinbase,
					},
					marketKind: 'Futures',
				},
			},
		])
		expect(getExchangeMarkets).toHaveBeenCalledWith({
			publicEnv: {},
			exchangeId: 'coinbase',
		})
	})

	it('throws when the venue has no Coinpaprika exchange mapping', async () => {
		getExchangeMarkets.mockClear()
		const resolver = coinpaprikaResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.MarketVenue
			&& '$$markets' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Coinpaprika MarketVenue $$markets resolver is not registered')

		await expect(resolver.resolve['MarketVenueId'].resolve({
			marketVenueId: MarketVenueId.Uniswap,
		}, resolverContext)).rejects.toThrow('Coinpaprika_Rest: exchange not mapped for venue')
		expect(getExchangeMarkets).not.toHaveBeenCalled()
	})
})
