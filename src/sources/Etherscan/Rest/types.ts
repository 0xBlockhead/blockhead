/**
 * Etherscan API V2 API shapes used by **`Rest/queries.ts`**.
 *
 * @see https://docs.etherscan.io/api-reference/endpoint/ethgettransactionbyhash
 * @see https://docs.etherscan.io/api-reference/endpoint/getabi
 */

/**
 * `module=proxy` — success is **`{ jsonrpc, id, result }`**; failures may be
 * JSON-RPC **`error`**, or Etherscan’s string-status envelope
 * **`{ status: "0", message: "NOTOK" | "NOTOK-…", result: "<explanation>" }`**
 * (e.g. free API not available for a chain). Do not use `result` from the latter as RPC data.
 */
export type EtherscanProxyJsonRpc<T> = {
	jsonrpc?: string
	id?: number
	status?: string
	message?: string
	result?: T | null
	error?: {
		code: number
		message: string
	}
}

/**
 * `module=contract` **`action=getabi`** (and similar) — **`status`** **`1`** / **`0`**, **`result`** string or message.
 * @see https://docs.etherscan.io/api-reference/endpoint/getabi
 */
export type EtherscanStringStatus = {
	status: string
	message: string
	result: string
}

export type EtherscanContractCreationResult = {
	contractAddress?: string
	contractCreator?: string
	txHash?: string
}

export type EtherscanContractCreation = (
	| {
		status: '1'
		message: string
		result: EtherscanContractCreationResult[]
	}
	| {
		status: '0'
		message: string
		result: string
	}
)

export type EtherscanContractSourceResult = {
	SourceCode?: string
	ABI?: string
	ContractName?: string
	Implementation?: string
	Proxy?: string
}

export type EtherscanContractSourceCode = {
	status: string
	message: string
	result: EtherscanContractSourceResult[] | string
}

/**
 * `module=account` list endpoints — **`status`** **`1`** / **`0`**, **`result`** row array or message string.
 * @see https://docs.etherscan.io/api-reference/endpoint/tokentx
 * @see https://docs.etherscan.io/api-reference/endpoint/txlistinternal
 */
export type EtherscanAccountArray<T> = (
	| {
		status: '1'
		message: string
		result: T[]
	}
	| {
		status: '0'
		message: string
		result: string
	}
)

/** Shared fields on Etherscan account token-transfer rows (`tokentx`, `tokennfttx`, `token1155tx`). */
export type EtherscanTokenTransfer = {
	blockNumber?: string
	timeStamp?: string
	hash?: string
	nonce?: string
	blockHash?: string
	from?: string
	to?: string
	contractAddress?: string
	tokenName?: string
	tokenSymbol?: string
	tokenDecimal?: string
	transactionIndex?: string
	gas?: string
	gasPrice?: string
	gasUsed?: string
	cumulativeGasUsed?: string
	input?: string
	confirmations?: string
	logIndex?: string
}

/** `module=account`, **`action=tokentx`** — ERC-20 token transfers. */
export type EtherscanErc20TokenTransfer = EtherscanTokenTransfer & {
	value?: string
}

/** `module=account`, **`action=tokennfttx`** — ERC-721 token transfers. */
export type EtherscanErc721TokenTransfer = EtherscanTokenTransfer & {
	tokenID?: string
}

/** `module=account`, **`action=token1155tx`** — ERC-1155 token transfers. */
export type EtherscanErc1155TokenTransfer = EtherscanTokenTransfer & {
	tokenID?: string
	tokenValue?: string
}

/** Discriminated union for ERC-20 / ERC-721 / ERC-1155 token transfer rows. */
export type EtherscanTokenTransferTagged = (
	| {
		standard: 'erc20'
		row: EtherscanErc20TokenTransfer
	}
	| {
		standard: 'erc721'
		row: EtherscanErc721TokenTransfer
	}
	| {
		standard: 'erc1155'
		row: EtherscanErc1155TokenTransfer
	}
)

/** `module=account`, **`action=txlist`** — normal transactions by address. */
export type EtherscanNormalTransaction = {
	blockNumber?: string
	timeStamp?: string
	hash?: string
	nonce?: string
	blockHash?: string
	transactionIndex?: string
	from?: string
	to?: string
	value?: string
	gas?: string
	gasPrice?: string
	input?: string
	methodId?: string
	functionName?: string
	contractAddress?: string
	cumulativeGasUsed?: string
	gasUsed?: string
	confirmations?: string
	isError?: string
	txreceipt_status?: string
}

/** `module=account`, **`action=txlistinternal`** — internal transactions. */
export type EtherscanInternalTransaction = {
	blockNumber?: string
	timeStamp?: string
	hash?: string
	from?: string
	to?: string
	value?: string
	contractAddress?: string
	input?: string
	type?: string
	gas?: string
	gasUsed?: string
	traceId?: string
	isError?: string
	errCode?: string
}
