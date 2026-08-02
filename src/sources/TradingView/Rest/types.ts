export type TradingViewScannerColumn =
	| 'close'
	| 'name'
	| 'update_mode'
	| 'update_time'

export type TradingViewScannerDatum = {
	s: string
	d: [
		name: string | null,
		price: number | null,
		updateMode: string | null,
		updateTimeSec: number | null,
	]
}

export type TradingViewScannerResponse = {
	totalCount?: number
	data?: TradingViewScannerDatum[]
}
