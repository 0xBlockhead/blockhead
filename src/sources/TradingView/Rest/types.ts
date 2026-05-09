export type TradingViewScannerColumn = 'name' | 'close' | 'update_mode'

export type TradingViewScannerRow = {
	s?: string
	d?: unknown[]
}

export type TradingViewScannerResponse = {
	totalCount?: number
	data?: TradingViewScannerRow[]
}

export type TradingViewQuote = {
	ticker: string
	name: string
	price: number
	updateMode: string
}
