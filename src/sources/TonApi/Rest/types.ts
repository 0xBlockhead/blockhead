import { type } from 'arktype'

export const TonApiAccount = type({
	address: 'string',
	balance: 'string',
	last_activity: 'number.integer >= 0',
	status: "'uninit' | 'active' | 'frozen'",
	interfaces: 'string[]',
	get_methods: 'string[]',
	is_wallet: 'boolean',
})

export type TonApiAccount = typeof TonApiAccount.infer

export const TonApiMasterchainHead = type({
	seqno: 'number.integer >= 0',
	gen_utime: 'number.integer >= 0',
})

export type TonApiMasterchainHead = typeof TonApiMasterchainHead.infer

export const TonApiAccountTransactionWire = type({
	hash: 'string',
	lt: 'number.integer >= 0',
	account: {
		address: 'string',
		is_scam: 'boolean',
		is_wallet: 'boolean',
	},
	success: 'boolean',
	utime: 'number.integer >= 0',
	total_fees: 'number.integer >= 0',
	end_balance: 'number.integer >= 0',
	transaction_type: 'string',
	block: 'string',
	aborted: 'boolean',
	destroyed: 'boolean',
})

export type TonApiAccountTransactionWire = typeof TonApiAccountTransactionWire.infer

export const TonApiAccountTransactionsWire = type({
	transactions: TonApiAccountTransactionWire.array(),
})

export type TonApiAccountTransactionsWire = typeof TonApiAccountTransactionsWire.infer

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
