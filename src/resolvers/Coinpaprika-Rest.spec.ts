import { describe, expect, it, vi } from 'vitest'

import { CoinId } from '$/constants/Coin.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
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

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

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
			},
			{
				id: 'btc-bitcoin',
				last_updated: '2026-08-04T09:00:00Z',
			},
			{
				id: 'unknown-coin',
				last_updated: '2026-08-04T09:00:00Z',
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
	})
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
			total_supply: 120_000_000,
			last_updated: '2026-08-04T09:00:00Z',
			quotes: {
				USD: {
					market_cap: 400_000_000_000,
					percent_change_24h: 1.25,
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

		await expect(coinTimestampResolver.resolve['CoinTimestampMsSource'].resolve({
			$coin: {
				coinId: CoinId.ETH,
			},
			timestampMs: Date.parse('2026-08-04T09:00:00Z'),
			source: Source.Coinpaprika_Rest,
		}, resolverContext)).resolves.toEqual({
			marketCapRank: 2,
			marketCap: 400_000_000_000n,
			marketCapUsd: 400_000_000_000,
			change24hPercent: 1.25,
			totalSupply: 120_000_000n,
			transport: 'coinpaprika-ticker',
			providerAssetId: 'eth-ethereum',
		})
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
			},
			{
				base_currency_id: 'btc-bitcoin',
				quote_currency_id: 'usd-us-dollars',
				category: 'Spot',
				pair: 'BTC/USD',
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
