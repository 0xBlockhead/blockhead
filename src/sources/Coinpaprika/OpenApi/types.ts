import type { paths } from '$/sources/Coinpaprika/OpenApi/openapi.d.ts'

export type CoinpaprikaCurrencies = paths['/coins']['get']['responses'][200]['content']['application/json']
export type CoinpaprikaCurrency = CoinpaprikaCurrencies[number]

export type CoinpaprikaCoin = paths['/coins/{coin_id}']['get']['responses'][200]['content']['application/json']
export type CoinpaprikaCoinPath = paths['/coins/{coin_id}']['get']['parameters']['path']

export type CoinpaprikaCoinMarkets = paths['/coins/{coin_id}/markets']['get']['responses'][200]['content']['application/json']
export type CoinpaprikaCoinMarket = CoinpaprikaCoinMarkets[number]

export type CoinpaprikaExchangeMarkets = paths['/exchanges/{exchange_id}/markets']['get']['responses'][200]['content']['application/json']
export type CoinpaprikaExchangeMarket = CoinpaprikaExchangeMarkets[number]
export type CoinpaprikaExchangeMarketsPath = paths['/exchanges/{exchange_id}/markets']['get']['parameters']['path']

/** Common input accepted by the resolver's market normalization. */
export type CoinpaprikaMarket = CoinpaprikaCoinMarket | CoinpaprikaExchangeMarket

export type CoinpaprikaOhlcvTodayRows = paths['/coins/{coin_id}/ohlcv/today']['get']['responses'][200]['content']['application/json']
export type CoinpaprikaOhlcvHistoricalRows = paths['/coins/{coin_id}/ohlcv/historical']['get']['responses'][200]['content']['application/json']
export type CoinpaprikaOhlcvHistoricalQuery = paths['/coins/{coin_id}/ohlcv/historical']['get']['parameters']['query']
export type CoinpaprikaOhlcv = CoinpaprikaOhlcvTodayRows[number] | CoinpaprikaOhlcvHistoricalRows[number]

export type CoinpaprikaTicker = paths['/tickers/{coin_id}']['get']['responses'][200]['content']['application/json']
