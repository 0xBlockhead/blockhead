import { fetchFailedMessage } from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import {
	tradingViewCryptoScannerPath,
} from '$/sources/TradingView/Rest/constants.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/TradingView/bindings.ts'
import type {
	TradingViewScannerColumn,
	TradingViewScannerResponse,
} from '$/sources/TradingView/Rest/types.ts'

const tradingViewBinding = bindings[Source.TradingView_Rest]

export const tradingViewScannerFetch = async ({
	columns,
	tickers,
}: {
	columns: readonly TradingViewScannerColumn[]
	tickers: readonly string[]
}) => {
	const url = `${firstHttpUrlForBinding(tradingViewBinding)}${tradingViewCryptoScannerPath}`
	const response = await sourceFetch(
		tradingViewBinding,
		url,
		{
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
		}
	)
	if (!response.ok)
		throw new Error(await fetchFailedMessage(url, response))

	return response.json<TradingViewScannerResponse>()
}
