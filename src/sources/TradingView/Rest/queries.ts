import { tradingViewScannerFetch } from '$/sources/TradingView/Rest/client.ts'
import {
	tradingViewScannerResponseWire,
	type TradingViewCryptoQuote,
} from '$/sources/TradingView/Rest/types.ts'

const assertScannerResponse = (
	response: unknown
) => {
	try {
		return tradingViewScannerResponseWire.assert(response)
	} catch {
		throw new Error('TradingView_Rest: invalid crypto/scan response envelope')
	}
}

/**
 * `POST /crypto/scan` scanner request for quote columns.
 *
 * @see https://www.tradingview.com/widget-docs/widgets/screeners/screener/demos/crypto-pairs/
 */
export const getCryptoQuotes = async ({
	tickers,
}: {
	tickers: readonly string[]
}): Promise<TradingViewCryptoQuote[]> => (
	(
		assertScannerResponse(
			await tradingViewScannerFetch({
				tickers,
				columns: [
					'name',
					'close',
					'update_mode',
					'update_time',
				],
			})
		)
			.data
		?? []
	)
		.flatMap((row) => {
			const [
				name,
				price,
				updateMode,
				updateTimeSec,
			] = row.d
			if (
				name == null
				|| price == null
				|| updateMode == null
				|| updateTimeSec == null
			)
				return []

			if (!Number.isFinite(price))
				throw new Error(`TradingView_Rest: non-finite close for ${row.s}`)

			if (!Number.isSafeInteger(updateTimeSec) || updateTimeSec < 0)
				throw new Error(`TradingView_Rest: invalid update_time for ${row.s}`)

			return [
				{
					ticker: row.s,
					name,
					price,
					updateMode,
					updateTimeSec,
				},
			]
		})
)
