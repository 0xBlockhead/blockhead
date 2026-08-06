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

const getSimplePrice = vi.hoisted(() => vi.fn())
const getDerivativesExchange = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Coingecko/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Coingecko/Rest/queries.ts')>(),
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
	})
})

describe('CoinGecko derivative timestamp resolver', () => {
	it('projects enrolled markPrice and indexPrice from last/index wire', async () => {
		getDerivativesExchange.mockResolvedValue({
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
		expect(resolver.projections.markPrice(snapshot)).toBe(snapshot.markPrice)
		expect(resolver.projections.indexPrice(snapshot)).toBe(snapshot.indexPrice)
		expect(getDerivativesExchange).toHaveBeenCalledWith({
			publicEnv: {},
			id: 'binance_futures',
		})
	})
})
