import { createResolverContext } from '../../tests/resolverContext.ts'
import { describe, expect, it, vi } from 'vitest'

import { CoinId } from '$/constants/Coin.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { idByCoinId } from '$/sources/CoinMarketCap/Rest/constants.ts'
import { Source } from '$/sources/Source.ts'

const getQuotesLatest = vi.hoisted(() => vi.fn())
const getInfo = vi.hoisted(() => vi.fn())
const getOhlcvHistorical = vi.hoisted(() => vi.fn())

vi.mock('$/sources/CoinMarketCap/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/CoinMarketCap/Rest/queries.ts')>(),
	getQuotesLatest,
	getInfo,
	getOhlcvHistorical,
}))

const { default: coinMarketCapResolvers } = await import('$/resolvers/CoinMarketCap-Rest.ts')

const resolverContext = createResolverContext()

const mappedCoinCount = Object.keys(idByCoinId).length

describe('CoinMarketCap global catalog resolvers', () => {
	it('emits catalog-backed $$coins with authoritative resolveCount', async () => {
		const resolver = coinMarketCapResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType._Global
			&& '$$coins' in candidate.projections
		))
		if (resolver == null)
			throw new Error('CoinMarketCap global coin resolver is not registered')

		const rows = await resolver.resolve['Scope'].resolve({
			scope: 'global',
		}, resolverContext)

		expect(rows).toHaveLength(mappedCoinCount)
		expect(rows).toContainEqual({
			[EntityMetaKey.Selector]: {
				coinId: CoinId.ETH,
			},
		})
		expect(resolver.projections.$$coins.select(rows)).toEqual(rows)
		expect(resolver.projections.$$coins.resolveCount(rows)).toBe(mappedCoinCount)
	})

	it('windows $$marketPrices while resolveCount stays complete', async () => {
		getQuotesLatest.mockImplementation(async ({ id }: { id: number }) => ({
			status: {
				error_code: 0,
			},
			data: {
				[String(id)]: {
					id,
					quote: {
						USD: {
							price: 1,
							last_updated: '2026-08-06T12:00:00.000Z',
						},
					},
				},
			},
		}))

		const resolver = coinMarketCapResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType._Global
			&& '$$marketPrices' in candidate.projections
		))
		if (resolver == null)
			throw new Error('CoinMarketCap global $$marketPrices resolver is not registered')

		const snapshot = await resolver.resolve['Scope'].resolve({
			scope: 'global',
		}, {
			...resolverContext,
			pagination: { limit: 2 },
		})

		expect(snapshot.marketPrices).toHaveLength(2)
		expect(snapshot.marketPriceCount).toBe(mappedCoinCount)
		expect(resolver.projections.$$marketPrices.select(snapshot)).toEqual(snapshot.marketPrices)
		expect(resolver.projections.$$marketPrices.resolveCount(snapshot)).toBe(mappedCoinCount)
	})
})

describe('CoinMarketCap coin detail resolver', () => {
	it('omits empty logo for ZeroOrOne $logo', async () => {
		getInfo.mockResolvedValue({
			status: {
				error_code: 0,
			},
			data: {
				'1027': {
					id: 1027,
					name: 'Ethereum',
					symbol: 'ETH',
					logo: '',
					platform: null,
				},
			},
		})

		const resolver = coinMarketCapResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Coin
			&& 'name' in candidate.projections
		))
		if (resolver == null)
			throw new Error('CoinMarketCap coin detail resolver is not registered')

		const coin = await resolver.resolve['CoinId'].resolve({
			coinId: CoinId.ETH,
		}, resolverContext)

		expect(coin).toEqual({
			name: 'Ethereum',
			symbol: 'ETH',
		})
		expect(coin).not.toHaveProperty('$logo')
	})

	it('emits $$timestamps from quote clock', async () => {
		getQuotesLatest.mockResolvedValueOnce({
			status: {
				error_code: 0,
			},
			data: {
				'1027': {
					id: 1027,
					cmc_rank: 2,
					quote: {
						USD: {
							price: 3500,
							last_updated: '2026-08-06T12:00:00.000Z',
						},
					},
				},
			},
		})

		const resolver = coinMarketCapResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Coin
			&& '$$timestamps' in candidate.projections
		))
		if (resolver == null)
			throw new Error('CoinMarketCap coin $$timestamps resolver is not registered')

		const rows = await resolver.resolve['CoinId'].resolve({
			coinId: CoinId.ETH,
		}, resolverContext)

		expect(rows).toEqual([{
			[EntityMetaKey.Selector]: {
				$coin: {
					coinId: CoinId.ETH,
				},
				timestampMs: Date.parse('2026-08-06T12:00:00.000Z'),
				source: Source.CoinMarketCap_Rest,
			},
		}])
		expect(resolver.projections.$$timestamps(rows)).toEqual(rows)
	})
})

describe('CoinMarketCap Coin_Timestamp resolver', () => {
	it('projects enrolled Coin_Timestamp fields and omits supply/volume leftovers', async () => {
		getQuotesLatest.mockResolvedValueOnce({
			status: {
				error_code: 0,
			},
			data: {
				'1027': {
					id: 1027,
					cmc_rank: 2,
					circulating_supply: 120_000_000,
					total_supply: 120_000_000,
					max_supply: null,
					num_market_pairs: 900,
					quote: {
						USD: {
							price: 3500,
							market_cap: 400_000_000_000,
							fully_diluted_market_cap: 420_000_000_000,
							volume_24h: 10_000_000_000,
							percent_change_1h: 0.1,
							percent_change_24h: 1.25,
							percent_change_7d: -0.5,
							last_updated: '2026-08-06T12:00:00.000Z',
						},
					},
				},
			},
		})

		const resolver = coinMarketCapResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Coin_Timestamp
			&& 'marketCap' in candidate.projections
		))
		if (resolver == null)
			throw new Error('CoinMarketCap Coin_Timestamp resolver is not registered')

		const snapshot = await resolver.resolve['CoinTimestampMsSource'].resolve({
			$coin: {
				coinId: CoinId.ETH,
			},
			timestampMs: Date.parse('2026-08-06T12:00:00.000Z'),
			source: Source.CoinMarketCap_Rest,
		}, resolverContext)

		expect(snapshot).toEqual({
			marketCapRank: 2,
			marketCap: 400_000_000_000n,
			marketCapUsd: 400_000_000_000,
			change24hPercent: 1.25,
			totalSupply: 120_000_000n,
			transport: 'coinmarketcap-v3-quotes-latest',
			providerAssetId: String(idByCoinId[CoinId.ETH]),
		})
		expect(snapshot).not.toHaveProperty('circulatingSupply')
		expect(snapshot).not.toHaveProperty('maxSupply')
		expect(snapshot).not.toHaveProperty('volume24h')
		expect(snapshot).not.toHaveProperty('change7dPercent')
		expect(snapshot).not.toHaveProperty('fullyDilutedMarketCap')
		expect(snapshot).not.toHaveProperty('numMarketPairs')
	})
})
