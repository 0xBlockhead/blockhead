export type TonApiAccount = {
	address: string
	balance: string
	last_activity: number
	status: 'uninit' | 'active' | 'frozen'
	interfaces: string[]
	get_methods: string[]
	is_wallet: boolean
}

export type TonApiMasterchainHead = {
	seqno: number
	gen_utime: number
}

export type TonApiAccountTransactionWire = {
	hash: string
	lt: number
	account: {
		address: string
		is_scam: boolean
		is_wallet: boolean
	}
	success: boolean
	utime: number
	total_fees: number
	end_balance: number
	transaction_type: string
	block: string
	aborted: boolean
	destroyed: boolean
}

export type TonApiAccountTransactionsWire = {
	transactions: TonApiAccountTransactionWire[]
}

export type TonApiAccountTransaction = {
	hash: string
	lt: bigint
	accountAddress: string
	success: boolean
	utime: number
	totalFeesNano: bigint
	endBalanceNano: bigint
	transactionType: string
	block: string
	aborted: boolean
	destroyed: boolean
}

export type TonApiAccountTransactionsPage = {
	transactions: TonApiAccountTransaction[]
	nextBeforeLt?: bigint
}
