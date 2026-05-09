import { getJson } from '$/lib/http.ts'
import {
	baseUrl,
	origin,
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
			origins: [
				{
					origin,
					corsEnabled: false,
				},
			],
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
