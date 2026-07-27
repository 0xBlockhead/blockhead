import { tradingViewScannerFetch } from '$/sources/TradingView/Rest/client.ts'
import type { TradingViewQuote } from '$/sources/TradingView/Rest/types.ts'

/**
 * `POST /crypto/scan` scanner request for quote columns.
 *
 * @see https://www.tradingview.com/widget-docs/widgets/screeners/screener/demos/crypto-pairs/
 */
export const getCryptoQuotes = async ({
	tickers,
}: {
	tickers: readonly string[]
}) => (
	(await tradingViewScannerFetch({
		tickers,
		columns: [
			'name',
			'close',
			'update_mode',
		],
	})).data
		?.flatMap((row): TradingViewQuote[] => {
			const [
				name,
				price,
				updateMode,
			] = row.d ?? []
			return (
				typeof row.s !== 'string'
				|| typeof name !== 'string'
				|| typeof price !== 'number'
				|| typeof updateMode !== 'string' ?
					[]
				:
					[
						{
							ticker: row.s,
							name,
							price,
							updateMode,
						},
					]
			)
		})
	?? []
)
