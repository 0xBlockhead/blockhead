import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { CoinMarketCapOhlcvHistoricalResponse } from '$/sources/CoinMarketCap/Rest/types.ts'

const { coinMarketCapFetch } = vi.hoisted(() => ({
	coinMarketCapFetch: vi.fn(),
}))

vi.mock('$/sources/CoinMarketCap/Rest/client.ts', () => ({
	coinMarketCapFetch,
}))

const { getOhlcvHistorical } = await import('$/sources/CoinMarketCap/Rest/queries.ts')

describe('CoinMarketCap REST OHLC transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('returns the wire response from the documented count-based endpoint', async () => {
		const response = {
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
})
