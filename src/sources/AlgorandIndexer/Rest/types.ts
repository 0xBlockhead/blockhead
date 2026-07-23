export type AlgorandIndexerAssetHolding = {
	amount: number
	'asset-id': number
	deleted?: boolean
	'is-frozen': boolean
	'opted-in-at-round'?: number
	'opted-out-at-round'?: number
}

export type AlgorandIndexerAssetHoldingsPage = {
	assets: AlgorandIndexerAssetHolding[]
	'current-round': number
	'next-token'?: string
}

export type AlgorandIndexerAccount = {
	address: string
	amount: number
	'pending-rewards'?: number
	'reward-base'?: number
	status?: string
}

export type AlgorandIndexerAccountResponse = {
	account: AlgorandIndexerAccount
	'current-round': number
}

export type AlgorandIndexerTransaction = {
	id: string
	sender: string
	fee: number
	'confirmed-round'?: number
	'payment-transaction'?: {
		amount: number
		receiver: string
		'close-amount'?: number
		'close-remainder-to'?: string
	}
	'asset-transfer-transaction'?: {
		amount: number
		'asset-id': number
		receiver: string
		sender?: string
		'close-amount'?: number
		'close-to'?: string
	}
	'application-transaction'?: {
		accounts?: string[]
	}
	'heartbeat-transaction'?: {
		'hb-address': string
	}
	'inner-txns'?: AlgorandIndexerTransaction[]
}

export type AlgorandIndexerTransactionsPage = {
	'current-round': number
	'next-token'?: string
	transactions: AlgorandIndexerTransaction[]
}
