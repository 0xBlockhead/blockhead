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
	'tx-type': string
	'confirmed-round'?: number
	group?: string
	'inner-txns'?: AlgorandIndexerTransaction[]
	logs?: string[]
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
		'application-id'?: number
	}
	'heartbeat-transaction'?: {
		'hb-address': string
	}
}

export type AlgorandIndexerTransactionsPage = {
	'current-round': number
	'next-token'?: string
	transactions: AlgorandIndexerTransaction[]
}

export type AlgorandIndexerTransactionResponse = {
	'current-round': number
	transaction: AlgorandIndexerTransaction
}

export type AlgorandIndexerAssetParams = {
	creator: string
	decimals: number
	total: number
	'default-frozen'?: boolean
	'unit-name'?: string
	name?: string
	url?: string
	'metadata-hash'?: string
	manager?: string
	reserve?: string
	freeze?: string
	clawback?: string
}

export type AlgorandIndexerAsset = {
	index: number
	deleted?: boolean
	'created-at-round'?: number
	params: AlgorandIndexerAssetParams
}

export type AlgorandIndexerAssetResponse = {
	asset: AlgorandIndexerAsset
	'current-round': number
}

export type AlgorandIndexerApplicationParams = {
	creator: string
	'approval-program'?: string
	'clear-state-program'?: string
	'global-state'?: unknown
	'global-state-schema'?: unknown
	'local-state-schema'?: unknown
}

export type AlgorandIndexerApplication = {
	id: number
	deleted?: boolean
	'created-at-round'?: number
	params: AlgorandIndexerApplicationParams
}

export type AlgorandIndexerApplicationResponse = {
	application: AlgorandIndexerApplication
	'current-round': number
}

export type AlgorandIndexerApplicationLocalState = {
	id: number
	deleted?: boolean
	'key-value'?: unknown
	schema?: unknown
	'opted-in-at-round'?: number
}

export type AlgorandIndexerApplicationLocalStatesPage = {
	'apps-local-states': AlgorandIndexerApplicationLocalState[]
	'current-round': number
	'next-token'?: string
}

export type AlgorandIndexerBoxDescriptor = {
	name: string
}

export type AlgorandIndexerApplicationBoxesPage = {
	'application-id': number
	boxes: AlgorandIndexerBoxDescriptor[]
	'next-token'?: string
}

export type AlgorandIndexerBlock = {
	round: number
	timestamp: number
	'genesis-hash'?: string
	'previous-block-hash'?: string
	proposer?: string
	transactions?: AlgorandIndexerTransaction[]
}

export type AlgorandIndexerHealth = {
	'round'?: number
	message?: string
	version?: string
	'db-available'?: boolean
	data?: {
		'round'?: number
	}
}

export type AlgorandIndexerAssetBalance = {
	address: string
	amount: number
	deleted?: boolean
	'is-frozen': boolean
	'opted-in-at-round'?: number
	'opted-out-at-round'?: number
}

export type AlgorandIndexerAssetBalancesPage = {
	balances: AlgorandIndexerAssetBalance[]
	'current-round': number
	'next-token'?: string
}
