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
					quote: {
						USD: {
							price: 3500,
							market_cap: 400_000_000_000,
							volume_24h: 10_000_000_000,
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
					quote: {
						USD: {
							price: 3500,
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
