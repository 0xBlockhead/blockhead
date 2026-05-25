export type TradingViewScannerColumn = 'name' | 'close' | 'update_mode'

export type TradingViewScannerDatum = {
	s?: string
	d?: unknown[]
}

export type TradingViewScannerResponse = {
	totalCount?: number
	data?: TradingViewScannerDatum[]
}

export type TradingViewQuote = {
	ticker: string
	name: string
	price: number
	updateMode: string
}
