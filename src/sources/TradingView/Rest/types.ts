/**
 * TradingView crypto scanner wire (`POST /crypto/scan`).
 * @see https://www.tradingview.com/widget-docs/widgets/screeners/screener/demos/crypto-pairs/
 */

import { type as arktype } from 'arktype'


export type TradingViewScannerColumn =
	| 'close'
	| 'name'
	| 'update_mode'
	| 'update_time'


/**
 * One scanner row for quote columns ordered as
 * `name`, `close`, `update_mode`, `update_time`.
 */
export const tradingViewScannerDatumWire = arktype({
	s: 'string',
	d: arktype([
		'string | null',
		'number | null',
		'string | null',
		'number | null',
	]),
})

export type TradingViewScannerDatum = typeof tradingViewScannerDatumWire.infer

export const tradingViewScannerResponseWire = arktype({
	'totalCount?': 'number',
	'data?': tradingViewScannerDatumWire.array(),
})

export type TradingViewScannerResponse = typeof tradingViewScannerResponseWire.infer

export type TradingViewCryptoQuote = {
	ticker: string
	name: string
	price: number
	updateMode: string
	updateTimeSec: number
}
