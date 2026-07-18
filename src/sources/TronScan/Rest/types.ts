export type TronScanBlock = {
	number: number
	hash?: string
	parentHash?: string
	timestamp?: number
	witnessAddress?: string
	txTrieRoot?: string
	version?: number
	nrOfTrx?: number
	transactionCount?: number
}

export type TronScanBlocks = {
	data: TronScanBlock[]
}

export type TronScanAccount = {
	address?: string
	name?: string
	balance?: number | string
	balanceStr?: string
	totalTransactionCount?: number
	transactions?: number
	date_created?: number
	latest_operation_time?: number
	contractMap?: Record<string, boolean>
	bandwidth?: {
		freeNetRemaining?: number
		netRemaining?: number
	}
	accountResource?: {
		energyRemaining?: number
	}
}

export type TronScanTransaction = {
	hash?: string
	transactionHash?: string
	block?: number
	blockNumber?: number
	timestamp?: number
	contractType?: number | string
	contractRet?: string
	contractData?: {
		owner_address?: string
		to_address?: string
		contract_address?: string
		amount?: number | string
		asset_name?: string
	}
	ownerAddress?: string
	toAddress?: string
	contractAddress?: string
	amount?: number | string
	cost?: {
		fee?: number
		net_fee?: number
		energy_fee?: number
	}
}

export type TronScanTransactionDetail = TronScanTransaction & {
	data?: TronScanTransaction[]
}

export type TronScanContract = {
	address?: string
	name?: string
	contractName?: string
	compiler?: string
	verify_status?: number | string
	verifyStatus?: string
	is_proxy?: boolean
	proxy_implementation?: string
	creator?: {
		address?: string
	}
	creator_address?: string
	create_tx_hash?: string
	trc20token?: TronScanToken
	trc10token?: TronScanToken
}

export type TronScanContractDetail = {
	data: TronScanContract[]
}

export type TronScanToken = {
	id?: string | number
	tokenId?: string | number
	contractAddress?: string
	address?: string
	name?: string
	tokenName?: string
	abbr?: string
	tokenAbbr?: string
	symbol?: string
	precision?: number
	decimals?: number
	balance?: number | string
	balanceStr?: string
	totalSupply?: number | string
	total_supply?: number | string
	ownerAddress?: string
	owner_address?: string
	dateCreated?: number
	createTime?: number
	holderCount?: number
	tokenType?: string
	type?: string
}

export type TronScanTokenOverview = {
	tokens: TronScanToken[]
}

export type TronScanTrc10Tokens = {
	data: TronScanToken[]
}

export type TronScanAccountTokens = {
	data: TronScanToken[]
}

export type TronScanTrc20Transfer = {
	transaction_id?: string
	transactionHash?: string
	contract_address?: string
	contractAddress?: string
	tokenInfo?: TronScanToken
	from_address?: string
	fromAddress?: string
	to_address?: string
	toAddress?: string
	quant?: string
	amount?: string
	block_ts?: number
	timestamp?: number
}

export type TronScanTrc20Transfers = {
	token_transfers?: TronScanTrc20Transfer[]
	data?: TronScanTrc20Transfer[]
}
