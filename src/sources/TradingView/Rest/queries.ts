import { tradingViewScannerFetch } from '$/sources/TradingView/Rest/client.ts'

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
			'update_time',
		],
	})).data
		?.flatMap((row) => {
			const [
				name,
				price,
				updateMode,
				updateTimeSec,
			] = row.d
			return (
				name == null
				|| price == null
				|| updateMode == null
				|| updateTimeSec == null ?
					[]
				:
					[
						{
							ticker: row.s,
							name,
							price,
							updateMode,
							updateTimeSec,
						},
					]
			)
		})
	?? []
)
