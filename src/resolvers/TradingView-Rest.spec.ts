import {
	expect,
	it,
	vi,
} from 'vitest'

import { CoinId } from '$/constants/Coin.ts'
import { Iso4217 } from '$/constants/Currency.ts'
import {
	MarketAssetKind,
	MarketKind,
} from '$/constants/Market.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const getCryptoQuotes = vi.hoisted(() => vi.fn())

vi.mock('$/sources/TradingView/Rest/queries.ts', () => ({
	getCryptoQuotes,
}))

const { default: tradingViewResolvers } = await import('$/resolvers/TradingView-Rest.ts')

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}
const market = {
	$base: {
		kind: MarketAssetKind.Coin,
		assetKey: CoinId.BTC,
	},
	$quote: {
		kind: MarketAssetKind.Currency,
		assetKey: Iso4217.USD,
	},
	$marketVenue: {
		marketVenueId: MarketVenueId.Binance,
	},
	marketKind: MarketKind.Spot,
} as const
const quote = {
	ticker: 'BINANCE:BTCUSDT',
	name: 'BTCUSDT',
	price: 64570.01,
	updateMode: 'streaming',
	updateTimeSec: 1785404458,
}

it('derives quote identity from the provider clock and resolves the same observation', async () => {
	getCryptoQuotes.mockResolvedValue([quote])
	const quoteListResolver = tradingViewResolvers.resolvers.find((resolver) => (
		resolver.entityType === EntityType.MarketPrice
		&& '$$quotes' in resolver.projections
	))
	const quoteResolver = tradingViewResolvers.resolvers.find((resolver) => (
		resolver.entityType === EntityType.Market_Timestamp
		&& 'price' in resolver.projections
	))
	if (quoteListResolver == null || quoteResolver == null)
		throw new Error('TradingView quote resolvers are not registered')

	await expect(quoteListResolver.resolve.Market.resolve({
		$market: market,
	}, resolverContext)).resolves.toEqual([{
		[EntityMetaKey.Selector]: {
			$market: market,
			timestampMs: 1785404458000,
			feedKey: 'BINANCE:BTCUSDT',
		},
	}])
	await expect(quoteResolver.resolve.MarketTimestampMsFeedKey.resolve({
		$market: market,
		timestampMs: 1785404458000,
		feedKey: 'BINANCE:BTCUSDT',
	}, resolverContext)).resolves.toEqual({
		price: 6457001000000n,
		transport: 'streaming',
		providerAssetId: 'BINANCE:BTCUSDT',
	})
})

it('rejects a selector that does not match the provider clock', async () => {
	getCryptoQuotes.mockResolvedValue([quote])
	const quoteResolver = tradingViewResolvers.resolvers.find((resolver) => (
		resolver.entityType === EntityType.Market_Timestamp
		&& 'price' in resolver.projections
	))
	if (quoteResolver == null)
		throw new Error('TradingView quote resolver is not registered')

	await expect(quoteResolver.resolve.MarketTimestampMsFeedKey.resolve({
		$market: market,
		timestampMs: 1785404458001,
		feedKey: 'BINANCE:BTCUSDT',
	}, resolverContext)).rejects.toThrow('provider clock')
})
