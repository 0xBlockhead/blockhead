export type TronNodeContractValue = {
	amount?: number | string
	asset_name?: string
	contract_address?: string
	owner_address?: string
	to_address?: string
}

export type TronNodeTransaction = {
	txID?: string
	ret?: {
		contractRet?: string
		fee?: number
	}[]
	raw_data?: {
		contract?: {
			type?: string
			parameter?: {
				value?: TronNodeContractValue
			}
		}[]
		expiration?: number
		timestamp?: number
		data?: string
	}
	raw_data_hex?: string
	signature?: string[]
}

export type TronNodeBlock = {
	blockID?: string
	block_header?: {
		raw_data?: {
			number?: number
			timestamp?: number
			txTrieRoot?: string
			parentHash?: string
			witness_address?: string
			version?: number
		}
		witness_signature?: string
	}
	transactions?: TronNodeTransaction[]
}

export type TronNodeWitness = {
	address: string
	url?: string
	voteCount?: number | string
	totalProduced?: number | string
	totalMissed?: number | string
	latestBlockNum?: number | string
	isJobs?: boolean
}

export type TronNodeWitnesses = {
	witnesses: TronNodeWitness[]
}

export type TronNodeChainParameters = {
	chainParameter: {
		key: string
		value?: number | string
	}[]
}

export type TronNodeInfo = {
	block?: string
	solidityBlock?: string
	currentConnectCount?: number
	activeConnectCount?: number
	passiveConnectCount?: number
}

export type TronNodeAccount = {
	address?: string
	account_name?: string
	balance?: number
	create_time?: number
	latest_opration_time?: number
}

export type TronGridAccountTransactions = {
	data: TronNodeTransaction[]
}

export type TronGridTrc20Transfer = {
	transaction_id: string
	token_info?: {
		address?: string
		symbol?: string
		name?: string
		decimals?: number
	}
	from?: string
	to?: string
	value?: string
	block_timestamp?: number
}

export type TronGridTrc20Transfers = {
	data: TronGridTrc20Transfer[]
}

export type TronNodeTransactionInfo = {
	id?: string
	blockNumber?: number
	blockTimeStamp?: number
	fee?: number
	contractResult?: string[]
	receipt?: {
		result?: string
		energy_usage_total?: number
		net_usage?: number
	}
}
