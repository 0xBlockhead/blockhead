import { getJson } from '$/lib/http.ts'
import TradingView from '$/sources/TradingView/index.ts'
import {
	baseUrl,
	tradingViewCryptoScannerPath,
} from '$/sources/TradingView/Rest/constants.ts'
import type {
	TradingViewScannerColumn,
	TradingViewScannerResponse,
} from '$/sources/TradingView/Rest/types.ts'

export const tradingViewScannerFetch = async ({
	columns,
	tickers,
}: {
	columns: readonly TradingViewScannerColumn[]
	tickers: readonly string[]
}) => (
	await getJson<TradingViewScannerResponse>(
		`${baseUrl}${tradingViewCryptoScannerPath}`,
		{
			origins: TradingView.origins ?? [],
			init: {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify({
					symbols: {
						tickers,
					},
					columns,
				}),
			},
		},
	)
)
