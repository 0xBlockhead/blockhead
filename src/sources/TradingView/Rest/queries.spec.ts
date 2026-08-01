import {
	afterEach,
	expect,
	it,
	vi,
} from 'vitest'

import { getCryptoQuotes } from '$/sources/TradingView/Rest/queries.ts'

afterEach(() => {
	vi.unstubAllGlobals()
})

it('keeps the scanner request endpoint-shaped and preserves its provider clock', async () => {
	const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({
		totalCount: 1,
		data: [{
			s: 'BINANCE:BTCUSDT',
			d: [
				'BTCUSDT',
				64570.01,
				'streaming',
				1785404458,
			],
		}],
	})))
	vi.stubGlobal('fetch', fetchMock)

	await expect(getCryptoQuotes({
		tickers: [
			'BINANCE:BTCUSDT',
		],
	})).resolves.toEqual([{
		ticker: 'BINANCE:BTCUSDT',
		name: 'BTCUSDT',
		price: 64570.01,
		updateMode: 'streaming',
		updateTimeSec: 1785404458,
	}])
	expect(fetchMock).toHaveBeenCalledWith(
		'https://scanner.tradingview.com/crypto/scan',
		expect.objectContaining({
			method: 'POST',
			body: JSON.stringify({
				symbols: {
					tickers: [
						'BINANCE:BTCUSDT',
					],
				},
				columns: [
					'name',
					'close',
					'update_mode',
					'update_time',
				],
			}),
		})
	)
})
