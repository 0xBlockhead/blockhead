import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { CoinId } from '$/constants/Coin.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getSimplePrice = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Coingecko/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Coingecko/Rest/queries.ts')>(),
	getSimplePrice,
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
	])
	})
})

describe('CoinGecko global market prices resolver', () => {
	it('windows catalog spots while resolveCount stays complete', async () => {
		getSimplePrice.mockResolvedValue({
			bitcoin: {
				usd: 100,
				last_updated_at: 1_700_000_000,
			},
			ethereum: {
				usd: 10,
				last_updated_at: 1_700_000_001,
			},
		})

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
