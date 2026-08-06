import { afterEach, describe, expect, it, vi } from 'vitest'

import { CoinId } from '$/constants/Coin.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'
import {
	coinpaprikaCoins,
	coinpaprikaExchangeIdByMarketVenueId,
	idByCoinId,
} from '$/sources/Coinpaprika/OpenApi/constants.ts'
import {
	getCoinById,
	getCoinMarkets,
	getExchangeMarkets,
	getOhlcvHistorical,
	getTickerById,
	getTickers,
} from '$/sources/Coinpaprika/OpenApi/queries.ts'

describe('Coinpaprika coin queries', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	it('uses the current canonical AAVE API id', () => {
		expect(idByCoinId[CoinId.AAVE]).toBe('aave-new')
	})

	it('maps catalog venues onto Coinpaprika exchange wire ids', () => {
		expect(coinpaprikaExchangeIdByMarketVenueId[MarketVenueId.Binance]).toBe('binance')
		expect(coinpaprikaExchangeIdByMarketVenueId[MarketVenueId.Coinbase]).toBe('coinbase')
		expect(coinpaprikaExchangeIdByMarketVenueId[MarketVenueId.Okx]).toBe('okx')
	})

	it('loads all catalog tickers with one bulk request', async () => {
		const tickers = [{
			id: 'aave-new',
			name: 'Aave',
			symbol: 'AAVE',
		}]
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify(tickers)))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(getTickers({
			publicEnv: {},
		})).resolves.toEqual(tickers)
		expect(fetchMock).toHaveBeenCalledOnce()
		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringContaining(encodeURIComponent(
				'https://api.coinpaprika.com/v1/tickers?quotes=USD'
			)),
			expect.any(Object)
		)
	})

	it('loads a single ticker by coin id through the registered browser proxy transport', async () => {
		const ticker = {
			id: 'eth-ethereum',
			name: 'Ethereum',
			symbol: 'ETH',
			last_updated: '2026-08-04T09:00:00Z',
			quotes: {
				USD: {
					price: 3200,
					market_cap: 400_000_000_000,
					percent_change_24h: 1.25,
				},
			},
		}
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify(ticker)))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(getTickerById({
			publicEnv: {},
			coinpaprikaId: 'eth-ethereum',
		})).resolves.toEqual(ticker)
		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringContaining(encodeURIComponent(
				'https://api.coinpaprika.com/v1/tickers/eth-ethereum'
			)),
			expect.objectContaining({
				headers: {
					Accept: 'application/json',
				},
			})
		)
	})

	it('keeps the supported coin catalog in source constants', () => {
		expect(coinpaprikaCoins).toContainEqual({
			coinId: CoinId.ETH,
			wireId: 'eth-ethereum',
		})
	})

	it('passes documented historical OHLC parameters through and returns raw rows', async () => {
		const rows = [{
			time_open: '2026-07-01T00:00:00.000Z',
			open: 1,
			high: 2,
			low: 0.5,
			close: 1.5,
			volume: 100,
		}]
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify(rows)))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(getOhlcvHistorical({
			publicEnv: {},
			coinpaprikaId: 'btc-bitcoin',
			start: '2026-07-01',
			end: '2026-07-30',
			limit: 30,
		})).resolves.toEqual(rows)
		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringContaining(encodeURIComponent(
				'https://api.coinpaprika.com/v1/coins/btc-bitcoin/ohlcv/historical?start=2026-07-01&end=2026-07-30&limit=30&interval=24h&quote=usd'
			)),
			expect.objectContaining({
				headers: {
					Accept: 'application/json',
				},
			})
		)
	})

	it('keeps coin and exchange market operations distinct and encodes their path IDs', async () => {
		const coinMarkets = [{
			exchange_id: 'binance',
			pair: 'BTC/USDT',
			adjusted_volume_24h_share: 30.29,
		}]
		const exchangeMarkets = [{
			pair: 'BTC/USDT',
			reported_volume_24h_share: 31.25,
		}]
		const fetchMock = vi.fn<typeof fetch>()
			.mockResolvedValueOnce(new Response(JSON.stringify(coinMarkets)))
			.mockResolvedValueOnce(new Response(JSON.stringify(exchangeMarkets)))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(getCoinMarkets({
			publicEnv: {},
			coinpaprikaId: 'btc/bitcoin',
		})).resolves.toEqual(coinMarkets)
		await expect(getExchangeMarkets({
			publicEnv: {},
			exchangeId: 'binance/us',
		})).resolves.toEqual(exchangeMarkets)
		expect(fetchMock).toHaveBeenNthCalledWith(
			1,
			expect.stringContaining(encodeURIComponent(
				'https://api.coinpaprika.com/v1/coins/btc%2Fbitcoin/markets?quotes=USD'
			)),
			expect.any(Object)
		)
		expect(fetchMock).toHaveBeenNthCalledWith(
			2,
			expect.stringContaining(encodeURIComponent(
				'https://api.coinpaprika.com/v1/exchanges/binance%2Fus/markets?quotes=USD'
			)),
			expect.any(Object)
		)
	})

	it('fail-closes malformed coin / ticker / ohlcv / markets envelopes', async () => {
		const fetchMock = vi.fn<typeof fetch>()
			.mockResolvedValueOnce(new Response(JSON.stringify({ name: 'Bitcoin' })))
			.mockResolvedValueOnce(new Response(JSON.stringify({ symbol: 'BTC' })))
			.mockResolvedValueOnce(new Response(JSON.stringify({ id: 'btc-bitcoin' })))
			.mockResolvedValueOnce(new Response(JSON.stringify({ open: 1 })))
			.mockResolvedValueOnce(new Response(JSON.stringify({ pair: 'BTC/USDT' })))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(getCoinById({
			publicEnv: {},
			coinpaprikaId: 'btc-bitcoin',
		})).rejects.toThrow('invalid coin response envelope')
		await expect(getTickerById({
			publicEnv: {},
			coinpaprikaId: 'btc-bitcoin',
		})).rejects.toThrow('invalid ticker response envelope')
		await expect(getTickers({
			publicEnv: {},
		})).rejects.toThrow('invalid tickers response envelope')
		await expect(getOhlcvHistorical({
			publicEnv: {},
			coinpaprikaId: 'btc-bitcoin',
			start: '2026-07-01',
		})).rejects.toThrow('invalid ohlcv historical response envelope')
		await expect(getCoinMarkets({
			publicEnv: {},
			coinpaprikaId: 'btc-bitcoin',
		})).rejects.toThrow('invalid coin markets response envelope')
	})
})
