import { describe, expect, it, vi } from 'vitest'

import { CoinId } from '$/constants/Coin.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getCoins = vi.hoisted(() => vi.fn())
const getTickerById = vi.hoisted(() => vi.fn())
const getExchangeMarkets = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Coinpaprika/OpenApi/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Coinpaprika/OpenApi/queries.ts')>(),
	getCoins,
	getTickerById,
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
	it('emits mapped canonical selectors with structured identity fields', async () => {
		getCoins.mockResolvedValue([
			{
				id: 'eth-ethereum',
				name: 'Ethereum',
				symbol: 'eth',
			},
			{
				id: 'unknown-coin',
				name: 'Unknown Coin',
				symbol: 'unknown',
			},
			{
				id: 'btc-bitcoin',
				name: '',
				symbol: 'btc',
			},
		])
		const resolver = coinpaprikaResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType._Global
			&& '$$coins' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Coinpaprika global coin resolver is not registered')

		const rows = await resolver.resolve['Scope'].resolve({
			scope: 'global',
		}, resolverContext)

		expect(rows).toEqual([
			{
				[EntityMetaKey.Selector]: {
					coinId: CoinId.ETH,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.Coin, [], 'name')]: 'Ethereum',
					[entityFieldAddressKey(EntityType.Coin, [], 'symbol')]: 'ETH',
				},
			},
		])
	})
})

describe('Coinpaprika coin timestamp resolvers', () => {
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
