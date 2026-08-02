import { Iso4217 } from '$/constants/Currency.ts'
import {
	MarketAssetKind,
	MarketKind,
} from '$/constants/Market.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import {
	tradingViewMarketByCoinIdAndMarketVenueId,
} from '$/sources/TradingView/Rest/constants.ts'

const tradingViewMarketFor = (
	market: EntitySelector<typeof schema, EntityType.Market>
) => (
	market.marketKind === MarketKind.Spot
	&& market.$base.kind === MarketAssetKind.Coin
	&& market.$quote.kind === MarketAssetKind.Currency
	&& market.$quote.assetKey === Iso4217.USD ?
		tradingViewMarketByCoinIdAndMarketVenueId[`${market.$base.assetKey}:${market.$marketVenue.marketVenueId}`]
	:
		undefined
)

const getTradingViewQuote = async (ticker: string) => {
	const { getCryptoQuotes } = await import('$/sources/TradingView/Rest/queries.ts')
	const quote = (await getCryptoQuotes({
		tickers: [
			ticker,
		],
	})).at(0)
	if (quote == null)
		throw new Error(`TradingView_Rest: no quote for ${ticker}`)

	return quote
}

export default {
	source: Source.TradingView_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.Market,
			resolve: {
				BaseQuoteMarketVenueKind: {
					resolve: async (market) => (
						tradingViewMarketFor(market) == null ?
							[]
						:
							[{
								[EntityMetaKey.Selector]: {
									$market: market,
								},
							}]
					),
				},
			},
		})({
			$$marketPrices: (marketPrices) => marketPrices,
		}),

		defineResolver({
			entityType: EntityType.MarketPrice,
			resolve: {
				Market: {
					resolve: async ({ $market }) => {
						const market = tradingViewMarketFor($market)
						if (market == null)
							return []

						const quote = await getTradingViewQuote(market.ticker)

						return [{
							[EntityMetaKey.Selector]: {
								$market,
								timestampMs: Math.trunc(quote.updateTimeSec * 1000),
								feedKey: market.ticker,
							},
						}]
					},
				},
			},
		})({
			$$quotes: (quotes) => quotes,
		}),

		defineResolver({
			entityType: EntityType.MarketPrice,
			resolve: {
				Market: {
					resolve: async ({ $market }) => ({
						[EntityMetaKey.Selector]: $market,
					}),
				},
			},
		})({
			$parentMarket: (market) => market,
		}),

		defineResolver({
			entityType: EntityType.Market_Timestamp,
			resolve: {
				MarketTimestampMsFeedKey: {
					resolve: async ({
						$market,
						feedKey,
						timestampMs,
					}) => {
						const market = tradingViewMarketFor($market)
						if (market == null || feedKey !== market.ticker)
							throw new Error('TradingView_Rest: quote selector does not match a mapped market')

						const quote = await getTradingViewQuote(market.ticker)
						if (Math.trunc(quote.updateTimeSec * 1000) !== timestampMs)
							throw new Error('TradingView_Rest: quote selector does not match the provider clock')

						return {
							price: BigInt(Math.round(quote.price * 1e8)),
							transport: quote.updateMode,
							providerAssetId: market.ticker,
						}
					},
				},
			},
		})({
			price: (quote) => quote.price,
			transport: (quote) => quote.transport,
			providerAssetId: (quote) => quote.providerAssetId,
		}),
	],
} satisfies RegisteredSourceResolverModule
