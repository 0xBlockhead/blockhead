import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { CoinMarketCapOhlcvHistoricalResponse } from '$/sources/CoinMarketCap/Rest/types.ts'

const { coinMarketCapFetch } = vi.hoisted(() => ({
	coinMarketCapFetch: vi.fn(),
}))

vi.mock('$/sources/CoinMarketCap/Rest/client.ts', () => ({
	coinMarketCapFetch,
}))

const {
	getInfo,
	getOhlcvHistorical,
	getQuotesLatest,
} = await import('$/sources/CoinMarketCap/Rest/queries.ts')

describe('CoinMarketCap REST market transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('returns the wire response from the documented count-based OHLC endpoint', async () => {
		const response = {
			status: {
				error_code: 0,
			},
			data: {
				'1': {
					id: 1,
					quotes: [{
						time_open: '2026-07-01T00:00:00.000Z',
						quote: {
							USD: {
								open: 1,
								high: 2,
								low: 0.5,
								close: 1.5,
								volume: 100,
							},
						},
					}],
				},
			},
		} satisfies CoinMarketCapOhlcvHistoricalResponse
		coinMarketCapFetch.mockResolvedValueOnce(response)

		await expect(getOhlcvHistorical({
			publicEnv: {},
			id: 1,
			count: 30,
		})).resolves.toBe(response)
		expect(coinMarketCapFetch).toHaveBeenCalledWith(
			{},
			'/v2/cryptocurrency/ohlcv/historical?id=1&time_period=daily&count=30&convert=USD'
		)
	})

	it('accepts quotes latest and info envelopes', async () => {
		coinMarketCapFetch.mockResolvedValueOnce({
			status: {
				error_code: 0,
			},
			data: {
				'1027': {
					id: 1027,
					symbol: 'ETH',
					cmc_rank: 2,
					circulating_supply: 120_000_000,
					total_supply: 120_000_000,
					max_supply: null,
					quote: {
						USD: {
							price: 3500,
							market_cap: 400_000_000_000,
							volume_24h: 10_000_000_000,
							percent_change_24h: 1.25,
							percent_change_7d: -0.5,
							last_updated: '2026-08-06T12:00:00.000Z',
						},
					},
				},
			},
		})
		coinMarketCapFetch.mockResolvedValueOnce({
			status: {
				error_code: 0,
			},
			data: {
				'1027': {
					id: 1027,
					name: 'Ethereum',
					symbol: 'ETH',
					logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
					platform: null,
				},
			},
		})

		await expect(getQuotesLatest({
			publicEnv: {},
			id: 1027,
		})).resolves.toMatchObject({
			data: {
				'1027': {
					id: 1027,
					cmc_rank: 2,
					circulating_supply: 120_000_000,
					total_supply: 120_000_000,
					quote: {
						USD: {
							price: 3500,
							market_cap: 400_000_000_000,
							percent_change_24h: 1.25,
						},
					},
				},
			},
		})
		await expect(getInfo({
			publicEnv: {},
			id: 1027,
		})).resolves.toMatchObject({
			data: {
				'1027': {
					name: 'Ethereum',
				},
			},
		})
	})

	it('rejects a quote response for a foreign requested coin', async () => {
		coinMarketCapFetch.mockResolvedValueOnce({
			status: {
				error_code: 0,
			},
			data: {
				'1': {
					id: 1,
				},
			},
		})

		await expect(getQuotesLatest({
			publicEnv: {},
			id: 1027,
		})).rejects.toThrow('CoinMarketCap_Rest: quotes latest response does not match requested coin')
	})

	it('retains quote supply / percent leftovers on transport without requiring enrolled projection', async () => {
		coinMarketCapFetch.mockResolvedValueOnce({
			status: {
				error_code: 0,
			},
			data: {
				'1': {
					id: 1,
					cmc_rank: 1,
					circulating_supply: 19_800_000,
					total_supply: 19_800_000,
					max_supply: 21_000_000,
					num_market_pairs: 1000,
					quote: {
						USD: {
							price: 99_000,
							market_cap: 1_960_000_000_000,
							fully_diluted_market_cap: 2_079_000_000_000,
							volume_24h: 30_000_000_000,
							volume_change_24h: 2.5,
							percent_change_1h: 0.1,
							percent_change_24h: 2.3,
							percent_change_7d: -1.0,
							percent_change_30d: 5.0,
							percent_change_60d: 8.0,
							percent_change_90d: 12.0,
							last_updated: '2026-08-06T12:00:00.000Z',
						},
					},
				},
			},
		})

		await expect(getQuotesLatest({
			publicEnv: {},
			id: 1,
		})).resolves.toMatchObject({
			data: {
				'1': {
					max_supply: 21_000_000,
					num_market_pairs: 1000,
					quote: {
						USD: {
							fully_diluted_market_cap: 2_079_000_000_000,
							volume_change_24h: 2.5,
							percent_change_7d: -1.0,
							percent_change_90d: 12.0,
						},
					},
				},
			},
		})
	})

	it.each([
		{
			label: 'quotes latest',
			query: () => getQuotesLatest({
				publicEnv: {},
				id: 1,
			}),
			response: {
				data: {
					'1': {
						quote: {
							USD: {
								price: '3500',
							},
						},
					},
				},
			},
		},
		{
			label: 'info',
			query: () => getInfo({
				publicEnv: {},
				id: 1,
			}),
			response: {
				data: {
					'1': {
						id: '1',
					},
				},
			},
		},
		{
			label: 'ohlcv historical',
			query: () => getOhlcvHistorical({
				publicEnv: {},
				id: 1,
				count: 7,
			}),
			response: {
				data: {
					'1': {
						quotes: [{
							quote: {
								USD: {
									open: '1',
								},
							},
						}],
					},
				},
			},
		},
	])('fails closed for malformed $label envelopes', async ({
		query,
		response,
		label,
	}) => {
		coinMarketCapFetch.mockResolvedValueOnce(response)

		await expect(query()).rejects.toThrow(`CoinMarketCap_Rest: invalid ${label} response envelope`)
	})

	it('fails closed when status.error_code is nonzero', async () => {
		coinMarketCapFetch.mockResolvedValueOnce({
			status: {
				error_code: 1001,
				error_message: 'Invalid API key',
			},
			data: {},
		})

		await expect(getQuotesLatest({
			publicEnv: {},
			id: 1,
		})).rejects.toThrow('CoinMarketCap_Rest: quotes latest API error 1001: Invalid API key')
	})
})
