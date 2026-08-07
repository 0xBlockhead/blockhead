import {
	type as arktype,
} from 'arktype'

export type TronScanBlock = {
	number: number
	hash?: string
	parentHash?: string
	timestamp?: number
	witnessAddress?: string
	txTrieRoot?: string
	version?: number | string
	nrOfTrx?: number
	transactionCount?: number
}

export const tronScanBlockWire = arktype({
	number: 'number.integer >= 0',
	'hash?': 'string',
	'parentHash?': 'string',
	'timestamp?': 'number.integer >= 0',
	'witnessAddress?': 'string',
	'txTrieRoot?': 'string',
	// Live `/api/block` returns version as a decimal string (e.g. "29").
	'version?': 'number.integer | string',
	'nrOfTrx?': 'number.integer >= 0',
	'transactionCount?': 'number.integer >= 0',
}).and(arktype('Record<string, unknown>'))

export type TronScanBlocks = {
	data: TronScanBlock[]
}

export const tronScanBlocksWire = arktype({
	data: tronScanBlockWire.array(),
}).and(arktype('Record<string, unknown>'))

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

export const tronScanAccountWire = arktype({
	'address?': 'string',
	'name?': 'string',
	'balance?': 'number | string',
	'balanceStr?': 'string',
	'totalTransactionCount?': 'number.integer >= 0',
	'transactions?': 'number.integer >= 0',
	'date_created?': 'number.integer >= 0',
	'latest_operation_time?': 'number.integer >= 0',
	'contractMap?': 'Record<string, boolean>',
	'bandwidth?': {
		'freeNetRemaining?': 'number.integer >= 0',
		'netRemaining?': 'number.integer >= 0',
	},
	'accountResource?': {
		'energyRemaining?': 'number.integer >= 0',
	},
}).and(arktype('Record<string, unknown>'))

export type TronScanTransaction = {
	hash?: string
	transactionHash?: string
	block?: number
	blockNumber?: number
	timestamp?: number
	confirmed?: boolean
	revert?: boolean
	contractType?: number | string
	contractRet?: string
	result?: string
	contractData?: {
		owner_address?: string
		to_address?: string
		contract_address?: string
		amount?: number | string
		asset_name?: string
	}
	ownerAddress?: string
	toAddress?: string
	toAddressList?: string[]
	contractAddress?: string
	amount?: number | string
	cost?: {
		fee?: number
		net_fee?: number
		energy_fee?: number
	}
}

export const tronScanTransactionWire = arktype({
	'hash?': 'string',
	'transactionHash?': 'string',
	'block?': 'number.integer >= 0',
	'blockNumber?': 'number.integer >= 0',
	'timestamp?': 'number.integer >= 0',
	'confirmed?': 'boolean',
	'revert?': 'boolean',
	'contractType?': 'number | string',
	'contractRet?': 'string',
	'result?': 'string',
	'contractData?': {
		'owner_address?': 'string',
		'to_address?': 'string',
		'contract_address?': 'string',
		'amount?': 'number | string',
		'asset_name?': 'string',
	},
	'ownerAddress?': 'string',
	'toAddress?': 'string',
	'toAddressList?': 'string[]',
	'contractAddress?': 'string',
	'amount?': 'number | string',
	'cost?': {
		'fee?': 'number.integer >= 0',
		'net_fee?': 'number.integer >= 0',
		'energy_fee?': 'number.integer >= 0',
	},
}).and(arktype('Record<string, unknown>'))

export type TronScanListTransaction = TronScanTransaction & {
	hash: string
}

export const tronScanListTransactionWire = tronScanTransactionWire.and(arktype({
	hash: 'string',
}))

export type TronScanTransactions = {
	total: number
	rangeTotal?: number
	wholeChainTxCount?: number
	data: TronScanListTransaction[]
}

export const tronScanTransactionsWire = arktype({
	total: 'number.integer >= 0',
	'rangeTotal?': 'number.integer >= 0',
	'wholeChainTxCount?': 'number.integer >= 0',
	data: tronScanListTransactionWire.array(),
}).and(arktype('Record<string, unknown>'))

export type TronScanTransactionDetail = TronScanTransaction & {
	data?: TronScanTransaction[]
}

export const tronScanTransactionDetailWire = tronScanTransactionWire.and(arktype({
	'data?': tronScanTransactionWire.array(),
}))

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

export const tronScanTokenWire = arktype({
	'id?': 'string | number.integer',
	'tokenId?': 'string | number.integer',
	'contractAddress?': 'string',
	'address?': 'string',
	'name?': 'string',
	'tokenName?': 'string',
	'abbr?': 'string',
	'tokenAbbr?': 'string',
	'symbol?': 'string',
	'precision?': 'number.integer >= 0',
	'decimals?': 'number.integer >= 0',
	'balance?': 'number | string',
	'balanceStr?': 'string',
	'totalSupply?': 'number | string',
	'total_supply?': 'number | string',
	'ownerAddress?': 'string',
	'owner_address?': 'string',
	'dateCreated?': 'number.integer >= 0',
	'createTime?': 'number.integer >= 0',
	'holderCount?': 'number.integer >= 0',
	'tokenType?': 'string',
	'type?': 'string',
}).and(arktype('Record<string, unknown>'))

export const tronScanContractWire = arktype({
	'address?': 'string',
	'name?': 'string',
	'contractName?': 'string',
	'compiler?': 'string',
	'verify_status?': 'number | string',
	'verifyStatus?': 'string',
	'is_proxy?': 'boolean',
	'proxy_implementation?': 'string',
	'creator?': {
		'address?': 'string',
	},
	'creator_address?': 'string',
	'create_tx_hash?': 'string',
	'trc20token?': tronScanTokenWire,
	'trc10token?': tronScanTokenWire,
}).and(arktype('Record<string, unknown>'))

export type TronScanContractDetail = {
	data: TronScanContract[]
}

export const tronScanContractDetailWire = arktype({
	data: tronScanContractWire.array(),
}).and(arktype('Record<string, unknown>'))

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

export const tronScanTokenOverviewWire = arktype({
	tokens: tronScanTokenWire.array(),
}).and(arktype('Record<string, unknown>'))

export type TronScanTrc10Tokens = {
	data: TronScanToken[]
}

export const tronScanTrc10TokensWire = arktype({
	data: tronScanTokenWire.array(),
}).and(arktype('Record<string, unknown>'))

export type TronScanAccountTokens = {
	data: TronScanToken[]
}

export const tronScanAccountTokensWire = arktype({
	data: tronScanTokenWire.array(),
}).and(arktype('Record<string, unknown>'))

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

export const tronScanTrc20TransferWire = arktype({
	'transaction_id?': 'string',
	'transactionHash?': 'string',
	'contract_address?': 'string',
	'contractAddress?': 'string',
	'tokenInfo?': tronScanTokenWire,
	'from_address?': 'string',
	'fromAddress?': 'string',
	'to_address?': 'string',
	'toAddress?': 'string',
	'quant?': 'string',
	'amount?': 'string',
	'block_ts?': 'number.integer >= 0',
	'timestamp?': 'number.integer >= 0',
}).and(arktype('Record<string, unknown>'))

export type TronScanTrc20Transfers = {
	token_transfers?: TronScanTrc20Transfer[]
	data?: TronScanTrc20Transfer[]
}

export const tronScanTrc20TransfersWire = arktype({
	'token_transfers?': tronScanTrc20TransferWire.array(),
	'data?': tronScanTrc20TransferWire.array(),
}).and(arktype('Record<string, unknown>'))
