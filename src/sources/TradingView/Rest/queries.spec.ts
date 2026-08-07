import {
	afterEach,
	expect,
	it,
	vi,
} from 'vitest'

const tradingViewScannerFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/TradingView/Rest/client.ts', () => ({
	tradingViewScannerFetch,
}))

const { getCryptoQuotes } = await import('$/sources/TradingView/Rest/queries.ts')

afterEach(() => {
	tradingViewScannerFetch.mockReset()
})

it('keeps the scanner request endpoint-shaped and preserves its provider clock', async () => {
	tradingViewScannerFetch.mockResolvedValue({
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
	})

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
	expect(tradingViewScannerFetch).toHaveBeenCalledWith({
		tickers: [
			'BINANCE:BTCUSDT',
		],
		columns: [
			'name',
			'close',
			'update_mode',
			'update_time',
		],
	})
})

it('fail-closes a malformed crypto/scan envelope', async () => {
	tradingViewScannerFetch.mockResolvedValue({
		data: [{
			s: 'BINANCE:BTCUSDT',
			d: 'not-a-tuple',
		}],
	})

	await expect(getCryptoQuotes({
		tickers: [
			'BINANCE:BTCUSDT',
		],
	})).rejects.toThrow('invalid crypto/scan response envelope')
})

it('fail-closes a non-finite close on an otherwise shaped row', async () => {
	tradingViewScannerFetch.mockResolvedValue({
		data: [{
			s: 'BINANCE:BTCUSDT',
			d: [
				'BTCUSDT',
				Number.NaN,
				'streaming',
				1785404458,
			],
		}],
	})

	await expect(getCryptoQuotes({
		tickers: [
			'BINANCE:BTCUSDT',
		],
	})).rejects.toThrow('non-finite close')
})

it('fail-closes a non-integer update_time', async () => {
	tradingViewScannerFetch.mockResolvedValue({
		data: [{
			s: 'BINANCE:BTCUSDT',
			d: [
				'BTCUSDT',
				64570.01,
				'streaming',
				1785404458.5,
			],
		}],
	})

	await expect(getCryptoQuotes({
		tickers: [
			'BINANCE:BTCUSDT',
		],
	})).rejects.toThrow('invalid update_time')
})
