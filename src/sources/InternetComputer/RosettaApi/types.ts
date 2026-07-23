export type InternetComputerRosettaNetworkIdentifier = {
	blockchain: 'Internet Computer'
	network: '00000000000000020101'
}

export type InternetComputerRosettaBlockIdentifier = {
	index: number
	hash: string
}

export type InternetComputerRosettaAccountIdentifier = {
	address: string
}

export type InternetComputerRosettaCurrency = {
	symbol: string
	decimals: number
}

export type InternetComputerRosettaAmount = {
	value: string
	currency: InternetComputerRosettaCurrency
}

export type InternetComputerRosettaAccountBalanceResponse = {
	block_identifier: InternetComputerRosettaBlockIdentifier
	balances: InternetComputerRosettaAmount[]
}

export type InternetComputerRosettaOperation = {
	operation_identifier: {
		index: number
	}
	type: string
	status?: string
	account?: InternetComputerRosettaAccountIdentifier
	amount?: InternetComputerRosettaAmount
}

export type InternetComputerRosettaTransaction = {
	transaction_identifier: {
		hash: string
	}
	operations: InternetComputerRosettaOperation[]
	metadata?: {
		block_height?: number
		memo?: number
		created_at_time?: number
	}
}

export type InternetComputerRosettaBlockTransaction = {
	block_identifier: InternetComputerRosettaBlockIdentifier
	transaction: InternetComputerRosettaTransaction
}

export type InternetComputerRosettaSearchTransactionsResponse = {
	transactions: InternetComputerRosettaBlockTransaction[]
	total_count: number
	next_offset?: number
}
