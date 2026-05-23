/**
 * Etherscan API V2 wire shapes used by **`Rest/queries.ts`**.
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
export type EtherscanProxyJsonRpcWire<T> = {
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
export type EtherscanStringStatusWire = {
	status: string
	message: string
	result: string
}

/**
 * `module=gastracker`, `action=gasoracle`.
 * @see https://docs.etherscan.io/api-reference/endpoint/gasoracle
 */
export type EtherscanGasOracleResultWire = {
	LastBlock: string
	SafeGasPrice: string
	ProposeGasPrice: string
	FastGasPrice: string
	suggestBaseFee?: string
	gasUsedRatio?: string
}

export type EtherscanGasOracleWire = {
	status: string
	message: string
	result: EtherscanGasOracleResultWire
}

export type EtherscanContractCreationRowWire = {
	contractAddress?: string
	contractCreator?: string
	txHash?: string
}

export type EtherscanContractCreationWire = {
	status: string
	message: string
	result: EtherscanContractCreationRowWire[] | string
}

export type EtherscanContractSourceRowWire = {
	SourceCode?: string
	ABI?: string
	ContractName?: string
	Implementation?: string
	Proxy?: string
}

export type EtherscanContractSourceCodeWire = {
	status: string
	message: string
	result: EtherscanContractSourceRowWire[] | string
}

/**
 * `module=account` list endpoints — **`status`** **`1`** / **`0`**, **`result`** row array or message string.
 * @see https://docs.etherscan.io/api-reference/endpoint/tokentx
 * @see https://docs.etherscan.io/api-reference/endpoint/txlistinternal
 */
export type EtherscanAccountArrayWire<T> = {
	status: string
	message: string
	result: T[] | string
}

/** Shared fields on Etherscan account token-transfer rows (`tokentx`, `tokennfttx`, `token1155tx`). */
export type EtherscanTokenTransferRowWire = {
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
export type EtherscanErc20TokenTransferRowWire = EtherscanTokenTransferRowWire & {
	value?: string
}

/** `module=account`, **`action=tokennfttx`** — ERC-721 token transfers. */
export type EtherscanErc721TokenTransferRowWire = EtherscanTokenTransferRowWire & {
	tokenID?: string
}

/** `module=account`, **`action=token1155tx`** — ERC-1155 token transfers. */
export type EtherscanErc1155TokenTransferRowWire = EtherscanTokenTransferRowWire & {
	tokenID?: string
	tokenValue?: string
}

/** `module=account`, **`action=txlistinternal`** — internal transactions. */
export type EtherscanInternalTransactionRowWire = {
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
